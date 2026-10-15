"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import type { Appointment } from "@/lib/appointments/store";
import {
  DEFAULT_POLICY,
  type BookingPolicy,
  type BookingMode,
} from "@/lib/appointments/policy";
import styles from "@/app/booking/weekly.module.css";
const copy = {
  ar: {
    title: "إدارة المواعيد الأسبوعية",
    pending: "بانتظار الموافقة",
    confirmed: "مؤكد",
    cancelled: "ملغى",
    rejected: "مرفوض",
    confirm: "تأكيد الموعد",
    reject: "رفض الطلب",
    cancel: "إلغاء الموعد",
    retry: "إعادة محاولة الرسائل",
    refresh: "تحديث",
    settings: "الجدول الأسبوعي",
    save: "حفظ الجدول",
    saved: "حُفظ التعديل. رسائل التأكيد تُتابَع في سجل الإرسال.",
    error: "تعذر إتمام العملية. لم نؤكد الحفظ؛ حدّث الصفحة ثم حاول مجددًا.",
    unavailable:
      "نظام الحجز الأسبوعي غير جاهز. يجب تطبيق الترحيل والتحقق من اتصال قاعدة البيانات أولًا.",
    visit: "معاينة عند العميل",
    store: "الحضور إلى المحل",
    phone: "اتصال هاتفي",
    add: "إضافة فترة",
    remove: "إزالة الفترة",
    closed: "أيام مغلقة استثنائية (تاريخ بكل سطر)",
    outbox: "رسائل بانتظار الإرسال أو المراجعة",
    late: "طلب إلغاء متأخر يحتاج مراجعتك",
    empty: "لا توجد مواعيد في هذه القائمة.",
    back: "الإدارة الرئيسية",
    buffer: "فاصل انتقال المعاينة بالدقائق",
    lead: "الحد الأدنى قبل الموعد بالدقائق",
    days: "أفق الحجز بالأيام",
    from: "من",
    to: "إلى",
    weekdays: [
      "الأحد",
      "الإثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ],
    fee: "أولوية مستعجلة: 20 يورو · لم يتم تحصيل الدفع",
    locked:
      "الفترات المعلقة والمؤكدة محجوزة. إلغاء أو رفض الطلب يحررها. جدول الاتصال لا يعني الرد الفوري. آخر 300 موعد / 100 رسالة.",
  },
  de: {
    title: "Wöchentliche Terminverwaltung",
    pending: "Wartet auf Bestätigung",
    confirmed: "Bestätigt",
    cancelled: "Abgesagt",
    rejected: "Abgelehnt",
    confirm: "Termin bestätigen",
    reject: "Anfrage ablehnen",
    cancel: "Termin absagen",
    retry: "E-Mail-Versand erneut versuchen",
    refresh: "Aktualisieren",
    settings: "Wochenplan",
    save: "Wochenplan speichern",
    saved:
      "Gespeichert. Bestätigungs-E-Mails werden im Versandprotokoll verfolgt.",
    error:
      "Vorgang fehlgeschlagen. Speichern ist nicht bestätigt. Bitte aktualisieren und erneut versuchen.",
    unavailable:
      "Die Wochenbuchung ist noch nicht bereit. Migration und Datenbankverbindung müssen zuerst geprüft werden.",
    visit: "Besichtigung beim Kunden",
    store: "Besuch im Geschäft",
    phone: "Telefontermin",
    add: "Zeitfenster hinzufügen",
    remove: "Zeitfenster entfernen",
    closed: "Ausnahmetage geschlossen (ein Datum je Zeile)",
    outbox: "E-Mails warten auf Versand oder Prüfung",
    late: "Kurzfristige Absage: Prüfung erforderlich",
    empty: "Keine Termine in dieser Liste.",
    back: "Hauptverwaltung",
    buffer: "Fahrtpuffer für Besichtigungen (Min.)",
    lead: "Mindestvorlauf (Min.)",
    days: "Buchungshorizont (Tage)",
    from: "Von",
    to: "Bis",
    weekdays: [
      "Sonntag",
      "Montag",
      "Dienstag",
      "Mittwoch",
      "Donnerstag",
      "Freitag",
      "Samstag",
    ],
    fee: "Express: 20 EUR · Zahlung nicht eingezogen",
    locked:
      "Angefragte und bestätigte Zeiten sind reserviert. Absage oder Ablehnung gibt sie frei. Telefonzeiten sind kein Sofortservice. Letzte 300 Termine / 100 E-Mails.",
  },
  en: {
    title: "Weekly appointment office",
    pending: "Awaiting approval",
    confirmed: "Confirmed",
    cancelled: "Cancelled",
    rejected: "Rejected",
    confirm: "Confirm appointment",
    reject: "Reject request",
    cancel: "Cancel appointment",
    retry: "Retry queued emails",
    refresh: "Refresh",
    settings: "Weekly schedule",
    save: "Save schedule",
    saved: "Saved. Confirmation emails are tracked in the delivery queue.",
    error: "Operation failed. Saving is not confirmed. Refresh and retry.",
    unavailable:
      "Weekly booking is not ready. The migration and database connection must be verified first.",
    visit: "Visit the customer",
    store: "Visit our shop",
    phone: "Phone appointment",
    add: "Add window",
    remove: "Remove window",
    closed: "Closed exception dates (one per line)",
    outbox: "Emails awaiting delivery or review",
    late: "Late cancellation needs your review",
    empty: "No appointments in this list.",
    back: "Main administration",
    buffer: "Visit travel buffer (minutes)",
    lead: "Minimum notice (minutes)",
    days: "Booking horizon (days)",
    from: "From",
    to: "Until",
    weekdays: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    fee: "Express: EUR 20 · Payment not collected",
    locked:
      "Pending and confirmed times are reserved. Cancelling or rejecting releases them. Phone availability is not an instant response service. Latest 300 appointments / 100 emails.",
  },
};
type Outbox = {
  id: string;
  event: string;
  recipient: string;
  attempts: number;
  last_error: string | null;
  created_at: string;
};
const modes: BookingMode[] = ["we_come_free", "at_store", "phone_call"];
const clock = (n: number) =>
  `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
const minute = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};
export default function AppointmentOffice() {
  const [lang, setLang] = useState<"ar" | "de" | "en">("de"),
    [appointments, setAppointments] = useState<Appointment[]>([]),
    [outbox, setOutbox] = useState<Outbox[]>([]),
    [policy, setPolicy] = useState<BookingPolicy>(DEFAULT_POLICY),
    [updatedAt, setUpdatedAt] = useState(""),
    [busy, setBusy] = useState(false),
    [ready, setReady] = useState(false),
    [error, setError] = useState(false),
    [notice, setNotice] = useState(false),
    [filter, setFilter] = useState("pending"),
    [closed, setClosed] = useState("");
  const t = copy[lang];
  const load = useCallback(async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/appointments/admin", { cache: "no-store" });
      const b = await r.json();
      if (!r.ok || !b.success || !b.settings?.[0]) throw new Error();
      setAppointments(b.appointments);
      setOutbox(b.outbox);
      setPolicy(b.settings[0].policy);
      setClosed(b.settings[0].policy.closedDates.join("\n"));
      setUpdatedAt(b.settings[0].updated_at);
      setReady(true);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);
  async function action(body: object) {
    if (busy) return;
    setBusy(true);
    setError(false);
    setNotice(false);
    try {
      const r = await fetch("/api/appointments/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const b = await r.json();
      if (!r.ok || !b.success) throw new Error();
      await load();
      setNotice(true);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  function changeWindow(
    mode: BookingMode,
    index: number,
    key: "start" | "end" | "days",
    value: number | number[],
  ) {
    setPolicy((p) => ({
      ...p,
      weekly: {
        ...p.weekly,
        [mode]: p.weekly[mode].map((w, i) =>
          i === index ? { ...w, [key]: value } : w,
        ),
      },
    }));
  }
  return (
    <main className={styles.main} dir={lang === "ar" ? "rtl" : "ltr"}>
      <nav className={styles.links}>
        <Link href="/admin/requests">{t.back}</Link>
        {(["ar", "de", "en"] as const).map((l) => (
          <button
            disabled={busy}
            type="button"
            className={styles.secondary}
            key={l}
            aria-pressed={l === lang}
            onClick={() => setLang(l)}
          >
            {l === "ar" ? "عربي" : l === "de" ? "Deutsch" : "English"}
          </button>
        ))}
      </nav>
      <h1>{t.title}</h1>
      <p className={styles.muted}>{t.locked}</p>
      <button
        className={styles.secondary}
        disabled={busy}
        onClick={() => void load()}
      >
        {t.refresh}
      </button>
      {error && (
        <p role="alert" className={styles.error}>
          {ready ? t.error : t.unavailable}
        </p>
      )}
      {notice && (
        <p role="status" className={styles.notice}>
          {t.saved}
        </p>
      )}
      {ready && (
        <>
          <section className={styles.panel}>
            <label className={styles.field}>
              {t.title}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                {(
                  ["pending", "confirmed", "cancelled", "rejected"] as const
                ).map((s) => (
                  <option key={s} value={s}>
                    {t[s]} ({appointments.filter((a) => a.status === s).length})
                  </option>
                ))}
              </select>
            </label>
            {!appointments.some((a) => a.status === filter) && <p>{t.empty}</p>}
            {appointments
              .filter((a) => a.status === filter)
              .sort((a, b) => Date.parse(a.start_at) - Date.parse(b.start_at))
              .map((a) => (
                <article key={a.id} className={styles.panel}>
                  <h2>{a.full_name}</h2>
                  <p>
                    {new Intl.DateTimeFormat(
                      lang === "ar"
                        ? "ar-DE"
                        : lang === "de"
                          ? "de-DE"
                          : "en-GB",
                      {
                        dateStyle: "full",
                        timeStyle: "short",
                        timeZone: "Europe/Berlin",
                      },
                    ).format(new Date(a.start_at))}{" "}
                    ·{" "}
                    {Math.round(
                      (Date.parse(a.end_at) - Date.parse(a.start_at)) / 60000,
                    )}{" "}
                    min
                  </p>
                  <p>
                    {a.mode === "we_come_free"
                      ? t.visit
                      : a.mode === "at_store"
                        ? t.store
                        : t.phone}
                  </p>
                  <code className={styles.code}>{a.reference}</code>
                  <p dir="auto">{a.address}</p>
                  <p>
                    <a href={`mailto:${a.email}`}>{a.email}</a> ·{" "}
                    <bdi>{a.phone}</bdi>
                  </p>
                  <p dir="auto">{a.notes}</p>
                  {a.urgent && <p className={styles.notice}>{t.fee}</p>}
                  {a.cancellation_requested_at && (
                    <p className={styles.error}>{t.late}</p>
                  )}
                  <div className={styles.links}>
                    {a.status === "pending" && (
                      <>
                        <button
                          className={styles.button}
                          disabled={busy}
                          onClick={() =>
                            void action({
                              id: a.id,
                              revision: a.revision,
                              status: "confirmed",
                            })
                          }
                        >
                          {t.confirm}
                        </button>
                        <button
                          className={styles.secondary}
                          disabled={busy}
                          onClick={() =>
                            void action({
                              id: a.id,
                              revision: a.revision,
                              status: "rejected",
                            })
                          }
                        >
                          {t.reject}
                        </button>
                      </>
                    )}
                    {["pending", "confirmed"].includes(a.status) && (
                      <button
                        className={styles.secondary}
                        disabled={busy}
                        onClick={() =>
                          void action({
                            id: a.id,
                            revision: a.revision,
                            status: "cancelled",
                          })
                        }
                      >
                        {t.cancel}
                      </button>
                    )}
                  </div>
                </article>
              ))}
          </section>
          <section className={styles.panel}>
            <h2>
              {t.outbox} ({outbox.length})
            </h2>
            {outbox.map((o) => (
              <p key={o.id}>
                <code>{o.id.slice(0, 8)}</code> ·{" "}
                {o.recipient === "owner"
                  ? lang === "ar"
                    ? "الإدارة"
                    : lang === "de"
                      ? "Verwaltung"
                      : "Office"
                  : lang === "ar"
                    ? "العميل"
                    : lang === "de"
                      ? "Kunde"
                      : "Customer"}{" "}
                · {o.attempts} {o.last_error ? "⚠" : ""}
              </p>
            ))}
            <button
              className={styles.secondary}
              disabled={busy}
              onClick={() => void action({ action: "retry" })}
            >
              {t.retry}
            </button>
          </section>
          <details className={styles.panel}>
            <summary>{t.settings}</summary>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void action({
                  action: "settings",
                  updatedAt,
                  policy: {
                    ...policy,
                    version: policy.version + 1,
                    closedDates: closed.split(/\s+/).filter(Boolean),
                  },
                });
              }}
            >
              {modes.map((mode) => (
                <fieldset key={mode} className={styles.panel} disabled={busy}>
                  <legend>
                    {mode === "we_come_free"
                      ? t.visit
                      : mode === "at_store"
                        ? t.store
                        : t.phone}
                  </legend>
                  {policy.weekly[mode].map((w, i) => (
                    <div className={styles.panel} key={i}>
                      <div
                        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                      >
                        {t.weekdays.map((d, n) => (
                          <label className={styles.check} key={n}>
                            <input
                              type="checkbox"
                              checked={w.days.includes(n)}
                              onChange={(e) =>
                                changeWindow(
                                  mode,
                                  i,
                                  "days",
                                  e.target.checked
                                    ? [...w.days, n]
                                    : w.days.filter((v) => v !== n),
                                )
                              }
                            />
                            {d}
                          </label>
                        ))}
                      </div>
                      <div className={styles.form}>
                        <label className={styles.field}>
                          {t.from}
                          <input
                            type="time"
                            required
                            value={clock(w.start)}
                            onChange={(e) =>
                              changeWindow(
                                mode,
                                i,
                                "start",
                                minute(e.target.value),
                              )
                            }
                          />
                        </label>
                        <label className={styles.field}>
                          {t.to}
                          <select
                            value={w.end}
                            onChange={(e) =>
                              changeWindow(
                                mode,
                                i,
                                "end",
                                Number(e.target.value),
                              )
                            }
                          >
                            {Array.from(
                              { length: 48 },
                              (_, n) => (n + 1) * 30,
                            ).map((n) => (
                              <option key={n} value={n}>
                                {n === 1440 ? "24:00" : clock(n)}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>
                      <button
                        className={styles.secondary}
                        type="button"
                        onClick={() =>
                          setPolicy((p) => ({
                            ...p,
                            weekly: {
                              ...p.weekly,
                              [mode]: p.weekly[mode].filter((_, n) => n !== i),
                            },
                          }))
                        }
                      >
                        {t.remove}
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className={styles.secondary}
                    onClick={() =>
                      setPolicy((p) => ({
                        ...p,
                        weekly: {
                          ...p.weekly,
                          [mode]: [
                            ...p.weekly[mode],
                            { days: [1], start: 540, end: 1080 },
                          ],
                        },
                      }))
                    }
                  >
                    {t.add}
                  </button>
                </fieldset>
              ))}
              <div className={styles.form}>
                {(
                  [
                    ["visitBufferMinutes", t.buffer, 0, 120],
                    ["leadMinutes", t.lead, 0, 10080],
                    ["horizonDays", t.days, 1, 90],
                  ] as const
                ).map(([key, label, min, max]) => (
                  <label className={styles.field} key={key}>
                    {label}
                    <input
                      type="number"
                      min={min}
                      max={max}
                      required
                      value={policy[key]}
                      disabled={busy}
                      onChange={(e) =>
                        setPolicy((p) => ({
                          ...p,
                          [key]: Number(e.target.value),
                        }))
                      }
                    />
                  </label>
                ))}
                <label className={`${styles.field} ${styles.wide}`}>
                  {t.closed}
                  <textarea
                    rows={4}
                    placeholder="2026-12-25"
                    value={closed}
                    disabled={busy}
                    onChange={(e) => setClosed(e.target.value)}
                  />
                </label>
              </div>
              <button className={styles.button} disabled={busy} type="submit">
                {t.save}
              </button>
            </form>
          </details>
        </>
      )}
    </main>
  );
}
