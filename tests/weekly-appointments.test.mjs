import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
import crypto from "node:crypto";
function load(path, mocks = {}, globals = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (id) => {
      if (id in mocks) return mocks[id];
      if (id === "node:crypto") return crypto;
      throw new Error(`Unexpected import: ${id}`);
    },
    Date,
    Intl,
    Buffer,
    URL,
    AbortSignal,
    console: { error() {} },
    ...globals,
  });
  return exports;
}
const policy = load("lib/appointments/policy.ts");
test("weekly visits obey Tue/Wed/Fri windows, two-hour maximum and future horizon", () => {
  const now = new Date("2026-10-15T07:00:00Z");
  const slots = policy.generateCandidates(
    policy.DEFAULT_POLICY,
    "we_come_free",
    120,
    [],
    now,
  );
  assert.ok(slots.length > 0);
  for (const s of slots) {
    const p = policy.berlinParts(new Date(s.start)),
      e = policy.berlinParts(new Date(s.end));
    const day = new Date(`${p.date}T12:00Z`).getUTCDay();
    assert.ok([2, 3, 5].includes(day));
    assert.ok(p.minutes >= (day === 5 ? 900 : 660));
    assert.ok(e.minutes <= (day === 5 ? 1140 : 1080));
    assert.equal(Date.parse(s.end) - Date.parse(s.start), 7200000);
    assert.ok(Date.parse(s.start) > now.getTime());
  }
  assert.equal(
    policy.generateCandidates(
      policy.DEFAULT_POLICY,
      "we_come_free",
      180,
      [],
      now,
    ).length,
    0,
  );
});
test("busy periods and visit travel buffers remove collisions across all modes", () => {
  const now = new Date("2026-10-15T07:00:00Z");
  const busy = [
    {
      reserved_start: "2026-10-16T14:00:00Z",
      reserved_end: "2026-10-16T15:00:00Z",
    },
  ];
  const slots = policy.generateCandidates(
    policy.DEFAULT_POLICY,
    "we_come_free",
    60,
    busy,
    now,
  );
  assert.ok(slots.length);
  assert.ok(
    slots.every(
      (s) =>
        Date.parse(s.start) - 1800000 >= Date.parse(busy[0].reserved_end) ||
        Date.parse(s.end) + 1800000 <= Date.parse(busy[0].reserved_start),
    ),
  );
  const calls = policy.generateCandidates(
    policy.DEFAULT_POLICY,
    "phone_call",
    30,
    busy,
    now,
  );
  assert.ok(calls.some((s) => s.time === "02:00"));
  assert.ok(
    calls.every(
      (s) =>
        Date.parse(s.end) <= Date.parse(busy[0].reserved_start) ||
        Date.parse(s.start) >= Date.parse(busy[0].reserved_end),
    ),
  );
});
test("shop excludes Sunday, closed dates, past times and meetings crossing DST changes", () => {
  const p = structuredClone(policy.DEFAULT_POLICY);
  p.closedDates = ["2026-10-16"];
  const slots = policy.generateCandidates(
    p,
    "at_store",
    60,
    [],
    new Date("2026-10-15T15:30:00Z"),
  );
  assert.ok(
    slots.every(
      (s) =>
        s.date !== "2026-10-16" &&
        new Date(`${s.date}T12:00Z`).getUTCDay() !== 0,
    ),
  );
  for (const now of ["2026-10-24T23:00:00Z", "2026-03-28T23:00:00Z"]) {
    const calls = policy.generateCandidates(
      p,
      "phone_call",
      30,
      [],
      new Date(now),
    );
    assert.ok(calls.length);
    for (const s of calls) {
      const a = policy.berlinParts(new Date(s.start)),
        b = policy.berlinParts(new Date(s.end));
      if (a.date === b.date) assert.equal(b.minutes - a.minutes, 30);
    }
  }
});
test("policy validates windows, days, exception dates and fixed customer price", () => {
  assert.equal(policy.validatePolicy(policy.DEFAULT_POLICY), true);
  for (const patch of [
    { urgentPriceCents: 19 },
    { horizonDays: 999 },
    { closedDates: ["2026-02-30"] },
    { visitBufferMinutes: -1 },
  ])
    assert.equal(
      policy.validatePolicy({ ...policy.DEFAULT_POLICY, ...patch }),
      false,
    );
});
const company = {
  LEGAL_COMPANY: {
    tradeName: "Caro Bara",
    address: "Fanningerstraße 20, 10365 Berlin",
    phone: "+49 30 43021132",
    email: "info@carobara.de",
  },
};
const docs = load("lib/appointments/documents.ts", {
  "@/lib/legal/company": company,
  "./policy": policy,
});
const a = {
  id: crypto.randomUUID(),
  reference: "CB-12345678901234567890123456789012",
  mode: "we_come_free",
  start_at: "2026-10-20T09:00:00Z",
  end_at: "2026-10-20T11:00:00Z",
  status: "confirmed",
  revision: 1,
  updated_at: "2026-10-15T07:00:00Z",
  full_name: "محمد <script>",
  email: "customer@example.com",
  phone: "+49 123",
  address: "Teststraße 5, Berlin",
  notes: "Original العربية,;\nText",
  urgent: true,
};
test("German confirmation includes date, code, actual location, fee and escaped original customer text", () => {
  const html = docs.bookingHtml(a, "confirmed", "https://example.com");
  assert.match(html, /Terminbestätigung/);
  assert.match(html, /20\. Oktober 2026/);
  assert.match(html, /11:00-13:00/);
  assert.match(html, /Teststraße/);
  assert.match(html, /20,00 EUR/);
  assert.match(html, /24 Stunden/);
  assert.match(html, /محمد &lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.match(
    docs.bookingHtml(
      { ...a, status: "pending" },
      "pending",
      "https://example.com",
    ),
    /noch nicht bestätigt/,
  );
});
test("calendar has stable UID, UTC times, sequence, cancellation status and RFC line folding", () => {
  const ics = docs.calendarFile(a, "https://example.com");
  assert.match(ics, /DTSTART:20261020T090000Z/);
  assert.match(ics, /DTEND:20261020T110000Z/);
  assert.match(ics, /SEQUENCE:1/);
  assert.match(ics, /STATUS:CONFIRMED/);
  assert.match(ics, /TRIGGER:-PT24H/);
  assert.ok(ics.split("\r\n").every((l) => Buffer.byteLength(l) <= 75));
  assert.match(
    docs.calendarFile(
      { ...a, status: "cancelled", revision: 2 },
      "https://example.com",
    ),
    /STATUS:CANCELLED/,
  );
});
test("request validation rejects missing consent, altered price inputs and invalid mode without changing free text", () => {
  const store = load("lib/appointments/store.ts", { "./policy": policy });
  const body = {
    fullName: "A",
    email: "a@example.com",
    phone: "123",
    mode: "we_come_free",
    address: "Street 1",
    notes: "نص أصلي",
    start: "2026-10-20T09:00:00.000Z",
    duration: 120,
    language: "ar",
    urgent: true,
    privacyAccepted: true,
    policyAccepted: true,
    idempotencyKey: crypto.randomUUID(),
    price: 1,
  };
  assert.equal(store.validateInput(body).notes, "نص أصلي");
  assert.equal(store.validateInput(body).price, undefined);
  for (const patch of [
    { policyAccepted: false },
    { privacyAccepted: false },
    { mode: "__proto__" },
    { address: "" },
    { duration: 120.5 },
  ])
    assert.throws(() => store.validateInput({ ...body, ...patch }));
});
for (const method of ["GET", "POST"])
  test(`weekly admin ${method} denies access before database or input`, async () => {
    let reads = 0;
    const api = load("app/api/appointments/admin/route.ts", {
      "next/server": { after() {} },
      "@/lib/admin-auth": { isAdminAuthenticated: async () => false },
      "@/lib/appointments/store": {
        BookingError: class extends Error {
          constructor(code, status) {
            super(code);
            this.code = code;
            this.status = status;
          }
        },
        database() {
          reads++;
        },
        parseBody() {
          reads++;
        },
      },
      "@/lib/appointments/policy": policy,
      "@/lib/appointments/notifications": {},
      "@/lib/appointments/http": {
        fail: (e) => ({ status: e.status }),
        ok: () => ({}),
      },
    });
    assert.equal((await api[method]({})).status, 401);
    assert.equal(reads, 0);
  });

test("notification retry reuses exact prepared payload and releases derived payload only after provider acceptance", async () => {
  const record = {
    id: "outbox-one",
    appointment_id: "appointment-one",
    snapshot: a,
    event: "confirmed",
    recipient: "customer",
    lease_token: "lease-one",
    prepared_payload: null,
  };
  let accepted = false,
    pdfCalls = 0;
  const sent = [];
  const api = load(
    "lib/appointments/notifications.ts",
    {
      resend: {
        Resend: class {
          emails = {
            send: async (payload, options) => {
              sent.push({ payload: structuredClone(payload), options });
              return accepted
                ? { data: { id: "provider-id" } }
                : { error: { message: "temporary" } };
            },
          };
        },
      },
      "@/lib/legal/company": company,
      "./documents": {
        appointmentDetails: () => ({ title: "Terminbestätigung" }),
        appointmentPdf: async () => {
          pdfCalls++;
          return Buffer.from("pdf");
        },
        bookingHtml: () => "<p>Terminbestätigung</p>",
        calendarFile: () => "BEGIN:VCALENDAR",
      },
      "./store": {
        database: async (path, method, body) => {
          if (path === "rpc/cb_booking_claim") return [{ ...record }];
          if (method === "PATCH") {
            Object.assign(record, body);
            return [record];
          }
          throw new Error("unexpected");
        },
      },
    },
    {
      process: {
        env: { RESEND_API_KEY: "test", RESEND_FROM_EMAIL: "from@example.com" },
      },
    },
  );
  const first = await api.dispatchNotifications();
  assert.equal(first.pending, true);
  assert.ok(record.prepared_payload);
  assert.equal(record.sent_at, undefined);
  accepted = true;
  const second = await api.dispatchNotifications();
  assert.equal(second.sent, 1);
  assert.equal(record.prepared_payload, null);
  assert.ok(record.sent_at);
  assert.equal(pdfCalls, 1);
  assert.deepEqual(sent[0], sent[1]);
});
