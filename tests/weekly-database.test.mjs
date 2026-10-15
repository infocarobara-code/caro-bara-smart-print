import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import crypto from "node:crypto";
import vm from "node:vm";
import ts from "typescript";
import { PGlite } from "@electric-sql/pglite";
const exports = {};
vm.runInNewContext(
  ts.transpileModule(fs.readFileSync("lib/appointments/policy.ts", "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText,
  { exports, Intl, Date },
);
const migration = fs.readFileSync(
  "db/migrations/20261015_weekly_appointments.sql",
  "utf8",
);
test("database migration, privileged access, atomic booking, idempotency, cancellation and durable outbox", async () => {
  const pg = new PGlite();
  try {
    await pg.exec(
      "create role anon; create role authenticated; create role service_role bypassrls;",
    );
    await pg.exec(migration);
    await pg.exec(migration); // Safe migration replay preserves records/settings.
    const immediateMigration = fs.readdirSync("supabase/migrations").find(f => f.endsWith("_immediate_appointment_80.sql"));
    await pg.exec(fs.readFileSync("supabase/migrations/" + immediateMigration,"utf8"));
    await pg.exec(
      "create table appointments(date text,time text,status text); create table booking_slots(booking_date text,start_time text,end_time text,status text);create table customers(id uuid);create table booking_available_days(date text);",
    );
    const legacyMigration = fs
      .readdirSync("supabase/migrations")
      .find((f) => f.endsWith("_legacy_booking_availability_guards.sql"));
    await pg.exec(
      fs.readFileSync("supabase/migrations/" + legacyMigration, "utf8"),
    );
    await pg.exec("set role anon");
    await assert.rejects(
      pg.query("select * from cb_appointments"),
      /permission denied/,
    );
    await assert.rejects(
      pg.query("select cb_booking_busy()"),
      /permission denied/,
    );
    await pg.exec("reset role");
    const slot = exports.generateCandidates(
      exports.DEFAULT_POLICY,
      "we_come_free",
      120,
      [],
      new Date(Date.now() + 86400000),
    )[0];
    assert.ok(slot);
    // A flexible request can use a free Sunday outside regular visit hours.
    const flexible = exports.generateCandidates(exports.DEFAULT_POLICY,"we_come_free",60,[],new Date(Date.now()+86400000),true).find(s=>new Date(s.date+"T12:00:00Z").getUTCDay()===0);
    assert.ok(flexible);
    const flexibleData = {reference:"CB-FLEX-TEST",idempotency_key:crypto.randomUUID(),payload_hash:"flex",mode:"we_come_free",start_at:flexible.start,end_at:flexible.end,full_name:"Test",email:"test@example.com",phone:"123",address:"Berlin",notes:"",language:"de",urgent:false};
    await assert.rejects(pg.query("select cb_booking_create($1::jsonb)",[JSON.stringify(flexibleData)]),/SLOT_UNAVAILABLE/);
    const flexSaved = (await pg.query("select cb_booking_create($1::jsonb) a",[JSON.stringify({...flexibleData,urgent:true})])).rows[0].a;
    assert.equal(flexSaved.price_cents,8000);
    // Historical agreed prices remain legal, without rewriting existing records.
    await pg.query("update cb_appointments set price_cents=2000 where id=$1",[flexSaved.id]);
    assert.equal((await pg.query("select price_cents from cb_appointments where id=$1",[flexSaved.id])).rows[0].price_cents,2000);
    await pg.query("delete from cb_booking_outbox where appointment_id=$1",[flexSaved.id]);
    await pg.query("delete from cb_appointments where id=$1",[flexSaved.id]); // disposable local test database only
    const data = {
      reference: `CB-${crypto.randomBytes(16).toString("hex").toUpperCase()}`,
      idempotency_key: crypto.randomUUID(),
      payload_hash: "abc",
      mode: "we_come_free",
      start_at: slot.start,
      end_at: slot.end,
      full_name: "Test",
      email: "test@example.com",
      phone: "123",
      address: "Berlin",
      notes: "Original العربية",
      language: "ar",
      urgent: true,
    };
    const create = async (body) =>
      (
        await pg.query("select cb_booking_create($1::jsonb) a", [
          JSON.stringify(body),
        ])
      ).rows[0].a;
    const h = Number(slot.time.slice(0, 2)),
      label =
        String(h % 12 || 12).padStart(2, "0") +
        slot.time.slice(2) +
        (h >= 12 ? " م" : " ص");
    const arabic = label.replace(/[0-9]/g, (d) => "٠١٢٣٤٥٦٧٨٩"[Number(d)]);
    await pg.query(
      "insert into appointments(date,time,status) values($1,$2,$3)",
      [slot.date, arabic, "new"],
    );
    const legacyBusy = (await pg.query("select cb_booking_busy() busy")).rows[0]
      .busy;
    assert.equal(
      Date.parse(legacyBusy[0].reserved_start),
      Date.parse(slot.start),
    );
    await assert.rejects(create(data), /SLOT_UNAVAILABLE/);
    await pg.exec("delete from appointments");
    const a = await create(data);
    assert.equal(a.status, "pending");
    assert.equal(a.price_cents, 8000);
    assert.equal(a.notes, "Original العربية");
    assert.equal((await create(data)).id, a.id);
    await assert.rejects(
      create({ ...data, payload_hash: "different" }),
      /IDEMPOTENCY_CONFLICT/,
    );
    await assert.rejects(
      create({
        ...data,
        idempotency_key: crypto.randomUUID(),
        reference: "other",
      }),
      /SLOT_UNAVAILABLE/,
    );
    await assert.rejects(
      create({
        ...data,
        idempotency_key: crypto.randomUUID(),
        reference: "other",
        start_at: slot.end,
        end_at: new Date(Date.parse(slot.end) + 3600000).toISOString(),
      }),
      /SLOT_UNAVAILABLE/,
    ); // Travel buffer protects adjacent visits.
    const outbox = (await pg.query("select * from cb_booking_outbox")).rows;
    assert.equal(outbox.length, 2);
    const confirmed = (
      await pg.query("select cb_booking_transition($1,'confirmed',0) a", [a.id])
    ).rows[0].a;
    assert.equal(confirmed.status, "confirmed");
    assert.equal(confirmed.reference, a.reference);
    await assert.rejects(
      pg.query("select cb_booking_transition($1,'cancelled',0)", [a.id]),
      /STATE_CONFLICT/,
    );
    const claim1 = (await pg.query("select * from cb_booking_claim(null)"))
      .rows;
    assert.equal(claim1.length, 2);
    assert.equal(claim1[0].event, "pending");
    assert.equal(
      (await pg.query("select * from cb_booking_claim(null)")).rows.length,
      0,
    );
    await pg.query(
      "update cb_booking_outbox set sent_at=now() where revision=0",
    );
    const claim2 = (await pg.query("select * from cb_booking_claim(null)"))
      .rows;
    assert.equal(claim2.length, 2);
    assert.equal(claim2[0].event, "confirmed");
    assert.equal(
      (
        await pg.query("select cb_booking_cancel($1,$2) s", [
          a.reference,
          "wrong@example.com",
        ])
      ).rows[0].s,
      "NOT_FOUND",
    );
    assert.equal(
      (
        await pg.query("select cb_booking_cancel($1,$2) s", [
          a.reference,
          a.email,
        ])
      ).rows[0].s,
      "cancelled",
    );
    assert.equal(
      (await pg.query("select status from cb_appointments where id=$1", [a.id]))
        .rows[0].status,
      "cancelled",
    );
    const replacement = await create({
      ...data,
      idempotency_key: crypto.randomUUID(),
      reference: "CB-SECOND",
    });
    assert.equal(replacement.status, "pending");
    await pg.query(
      "update cb_appointments set start_at=now()+interval '23 hours',end_at=now()+interval '24 hours',reserved_start=now()+interval '23 hours',reserved_end=now()+interval '24 hours' where id=$1",
      [replacement.id],
    );
    assert.equal(
      (
        await pg.query("select cb_booking_cancel($1,$2) s", [
          replacement.reference,
          replacement.email,
        ])
      ).rows[0].s,
      "review_required",
    );
    const late = (
      await pg.query("select * from cb_appointments where id=$1", [
        replacement.id,
      ])
    ).rows[0];
    assert.equal(late.status, "pending");
    assert.ok(late.cancellation_requested_at);
    const countBefore = (
      await pg.query("select count(*) n from cb_booking_outbox")
    ).rows[0].n;
    await pg.query("select cb_booking_cancel($1,$2)", [
      replacement.reference,
      replacement.email,
    ]);
    assert.equal(
      (await pg.query("select count(*) n from cb_booking_outbox")).rows[0].n,
      countBefore,
    );
    for (let i = 0; i < 12; i++)
      assert.equal(
        (await pg.query("select cb_booking_limit('key') allowed")).rows[0]
          .allowed,
        true,
      );
    assert.equal(
      (await pg.query("select cb_booking_limit('key') allowed")).rows[0]
        .allowed,
      false,
    );
  } finally {
    await pg.close();
  }
});
