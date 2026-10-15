"use client";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/languageContext";
import {
  DEFAULT_POLICY,
  type BookingMode,
  type Candidate,
  type BookingPolicy,
} from "@/lib/appointments/policy";
import { bookingCopy, errorCopy } from "@/lib/appointments/copy";
import { LEGAL_COMPANY } from "@/lib/legal/company";
import styles from "./weekly.module.css";
const initial = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  urgent: false,
  privacyAccepted: false,
  policyAccepted: false,
};
export default function WeeklyBooking() {
  const { language } = useLanguage(),
    lang = language === "ar" || language === "de" ? language : "en",
    t = bookingCopy[lang];
  const [mode, setMode] = useState<BookingMode>("we_come_free"),
    [duration, setDuration] = useState(120),
    [slots, setSlots] = useState<Candidate[]>([]),
    [selected, setSelected] = useState<Candidate | null>(null),
    [date, setDate] = useState(""),
    [page, setPage] = useState(0),
    [reload, setReload] = useState(0),
    [loading, setLoading] = useState(true),
    [loadError, setLoadError] = useState(false),
    [error, setError] = useState(""),
    [submitting, setSubmitting] = useState(false),
    [form, setForm] = useState(initial),
    [receipt, setReceipt] = useState<{
      reference: string;
      status: string;
      start: string;
      end: string;
    } | null>(null);
  const [activePolicy, setActivePolicy] =
    useState<BookingPolicy>(DEFAULT_POLICY);
  const idempotency = useRef({ fingerprint: "", key: "" });
  const dates = useMemo(
    () => Array.from(new Set(slots.map((s) => s.date))),
    [slots],
  );
  const locale = lang === "ar" ? "ar-DE" : lang === "de" ? "de-DE" : "en-GB";
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setLoadError(false);
    setSlots([]);
    fetch(`/api/appointments/availability?mode=${mode}&duration=${duration}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (r) => {
        const b = await r.json();
        if (!r.ok || b.success !== true || !Array.isArray(b.slots))
          throw new Error();
        setActivePolicy(b.policy);
        return b.slots as Candidate[];
      })
      .then((items) => {
        if (!controller.signal.aborted) {
          setSlots(items);
          setPage(0);
          setSelected(
            (old) => items.find((i) => i.start === old?.start) || null,
          );
          setDate((old) =>
            items.some((i) => i.date === old) ? old : items[0]?.date || "",
          );
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setLoadError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [mode, duration, reload]);
  function scheduleLabel(m: BookingMode) {
    return activePolicy.weekly[m]
      .map((w) => {
        const days = w.days
          .map((d) =>
            new Intl.DateTimeFormat(locale, {
              weekday: "short",
              timeZone: "UTC",
            }).format(new Date(Date.UTC(2026, 9, 18 + d))),
          )
          .join(" / ");
        const clock = (n: number) =>
          `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
        return `${days} · ${clock(w.start)}–${clock(w.end)}`;
      })
      .join(" · ");
  }
  function changeMode(value: BookingMode) {
    setMode(value);
    setDuration(DEFAULT_POLICY.durations[value].at(-1)!);
    setSelected(null);
    setDate("");
    setError("");
  }
  function input(name: keyof typeof initial, value: string | boolean) {
    setForm((old) => ({ ...old, [name]: value }));
    setError("");
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!selected || loading || loadError || submitting) return;
    const payload = {
      ...form,
      mode,
      duration,
      start: selected.start,
      language: lang,
    };
    const fingerprint = JSON.stringify(payload);
    if (idempotency.current.fingerprint !== fingerprint)
      idempotency.current = { fingerprint, key: crypto.randomUUID() };
    setSubmitting(true);
    setError("");
    try {
      const r = await fetch("/api/appointments/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          idempotencyKey: idempotency.current.key,
        }),
      });
      const b = await r.json();
      if (!r.ok || b.success !== true || typeof b.reference !== "string")
        throw new Error(b.error || "UNKNOWN");
      setReceipt(b);
      setForm(initial);
      setSelected(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "UNKNOWN");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
      <Header />
      <main className={styles.main} dir={lang === "ar" ? "rtl" : "ltr"}>
        <header className={styles.intro}>
          <div className={styles.eyebrow}>CARO BARA · BERLIN</div>
          <h1>{t.title}</h1>
          <p>{t.intro}</p>
        </header>
        {receipt ? (
          <section className={styles.panel} role="status">
            <h2>{t.received}</h2>
            <p>
              {t.successStatus}:{" "}
              {receipt.status === "confirmed"
                ? t.confirmed
                : receipt.status === "cancelled"
                  ? t.cancelledStatus
                  : t.pending}
            </p>
            <p>{t.code}</p>
            <code className={styles.code}>{receipt.reference}</code>
            <p>
              {new Intl.DateTimeFormat(locale, {
                dateStyle: "full",
                timeStyle: "short",
                timeZone: "Europe/Berlin",
              }).format(new Date(receipt.start))}
            </p>
            <p className={styles.muted}>{t.queued}</p>
            <div className={styles.links}>
              <Link href="/booking/manage">{t.manage}</Link>
            </div>
            <button
              className={styles.secondary}
              onClick={() => {
                setReceipt(null);
                setReload((n) => n + 1);
              }}
            >
              {t.new}
            </button>
          </section>
        ) : (
          <>
            <section className={styles.panel} aria-labelledby="meeting-type">
              <h2 id="meeting-type">1 · {t.mode}</h2>
              <div className={styles.modes}>
                {(
                  ["we_come_free", "at_store", "phone_call"] as BookingMode[]
                ).map((m) => (
                  <button
                    disabled={submitting}
                    key={m}
                    type="button"
                    aria-pressed={mode === m}
                    className={`${styles.choice} ${mode === m ? styles.active : ""}`}
                    onClick={() => changeMode(m)}
                  >
                    <strong>
                      {m === "we_come_free"
                        ? t.visit
                        : m === "at_store"
                          ? t.store
                          : t.phone}
                    </strong>
                    <small>
                      {m === "phone_call" ? t.phoneHint : scheduleLabel(m)}
                    </small>
                  </button>
                ))}
              </div>
              <label className={styles.duration}>
                {t.duration}
                <select
                  value={duration}
                  disabled={submitting}
                  onChange={(e) => {
                    setDuration(Number(e.target.value));
                    setSelected(null);
                  }}
                >
                  {DEFAULT_POLICY.durations[mode].map((n) => (
                    <option key={n} value={n}>
                      {n} {t.minutes}
                    </option>
                  ))}
                </select>
              </label>
            </section>
            <section
              className={styles.panel}
              aria-labelledby="meeting-time"
              aria-busy={loading}
            >
              <h2 id="meeting-time">2 · {t.schedule}</h2>
              <p className={styles.muted}>{t.zone}</p>
              {loading ? (
                <p role="status">{t.loading}</p>
              ) : loadError ? (
                <div className={styles.error} role="alert">
                  <p>{t.unavailable}</p>
                  <button
                    className={styles.secondary}
                    onClick={() => setReload((n) => n + 1)}
                  >
                    {t.retry}
                  </button>
                </div>
              ) : !dates.length ? (
                <p role="status">{t.empty}</p>
              ) : (
                <>
                  <div className={styles.days}>
                    {dates.slice(page * 6, page * 6 + 6).map((d) => {
                      const when = new Date(`${d}T12:00:00Z`);
                      return (
                        <button
                          disabled={submitting}
                          type="button"
                          key={d}
                          aria-pressed={d === date}
                          className={`${styles.day} ${d === date ? styles.active : ""}`}
                          onClick={() => {
                            setDate(d);
                            setSelected(null);
                          }}
                        >
                          <span>
                            {new Intl.DateTimeFormat(locale, {
                              weekday: "short",
                              timeZone: "Europe/Berlin",
                            }).format(when)}
                          </span>
                          <strong>
                            {new Intl.DateTimeFormat(locale, {
                              day: "numeric",
                              timeZone: "Europe/Berlin",
                            }).format(when)}
                          </strong>
                          <span>
                            {new Intl.DateTimeFormat(locale, {
                              month: "short",
                              timeZone: "Europe/Berlin",
                            }).format(when)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className={styles.navigation}>
                    <button
                      disabled={page === 0 || submitting}
                      className={styles.secondary}
                      onClick={() => {
                        setPage((n) => n - 1);
                        setDate(dates[(page - 1) * 6]);
                        setSelected(null);
                      }}
                    >
                      {t.previous}
                    </button>
                    <button
                      disabled={(page + 1) * 6 >= dates.length || submitting}
                      className={styles.secondary}
                      onClick={() => {
                        setPage((n) => n + 1);
                        setDate(dates[(page + 1) * 6]);
                        setSelected(null);
                      }}
                    >
                      {t.next}
                    </button>
                  </div>
                  <div className={styles.times} aria-label={t.schedule}>
                    {slots
                      .filter((s) => s.date === date)
                      .map((s) => (
                        <button
                          disabled={submitting}
                          type="button"
                          key={s.start}
                          aria-pressed={selected?.start === s.start}
                          className={`${styles.time} ${selected?.start === s.start ? styles.active : ""}`}
                          onClick={() => {
                            setSelected(s);
                            setError("");
                          }}
                        >
                          {s.time} –{" "}
                          {new Intl.DateTimeFormat("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            timeZone: "Europe/Berlin",
                            hourCycle: "h23",
                          }).format(new Date(s.end))}
                        </button>
                      ))}
                  </div>
                </>
              )}
            </section>
            {selected && !loadError && !loading && (
              <section className={styles.panel}>
                <h2>3 · {t.details}</h2>
                <p className={styles.notice}>
                  {t.selected}:{" "}
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "full",
                    timeStyle: "short",
                    timeZone: "Europe/Berlin",
                  }).format(new Date(selected.start))}{" "}
                  · {duration} {t.minutes}
                </p>
                <form onSubmit={submit}>
                  <div className={styles.form}>
                    {(
                      [
                        ["fullName", t.name, "text", "name"],
                        ["email", t.email, "email", "email"],
                        ["phone", t.telephone, "tel", "tel"],
                      ] as const
                    ).map(([name, label, type, autoComplete]) => (
                      <label className={styles.field} key={name}>
                        {label}
                        <input
                          name={name}
                          autoComplete={autoComplete}
                          type={type}
                          required
                          maxLength={
                            name === "fullName"
                              ? 160
                              : name === "email"
                                ? 254
                                : 50
                          }
                          value={form[name]}
                          disabled={submitting}
                          onChange={(e) => input(name, e.target.value)}
                        />
                      </label>
                    ))}
                    {mode === "we_come_free" && (
                      <label className={`${styles.field} ${styles.wide}`}>
                        {t.address}
                        <input
                          name="address"
                          autoComplete="street-address"
                          required
                          maxLength={500}
                          value={form.address}
                          disabled={submitting}
                          onChange={(e) => input("address", e.target.value)}
                        />
                      </label>
                    )}
                    <label className={`${styles.field} ${styles.wide}`}>
                      {t.notes} ({t.optional})
                      <textarea
                        name="notes"
                        rows={3}
                        maxLength={2000}
                        value={form.notes}
                        disabled={submitting}
                        onChange={(e) => input("notes", e.target.value)}
                      />
                    </label>
                  </div>
                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      checked={form.urgent}
                      disabled={submitting}
                      onChange={(e) => input("urgent", e.target.checked)}
                    />
                    <span>
                      <strong>{t.urgent}</strong>
                      <br />
                      {t.urgentHint}
                    </span>
                  </label>
                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      required
                      checked={form.privacyAccepted}
                      disabled={submitting}
                      onChange={(e) =>
                        input("privacyAccepted", e.target.checked)
                      }
                    />
                    <span>
                      {t.privacy}{" "}
                      <Link href="/datenschutz">
                        {lang === "ar"
                          ? "الخصوصية"
                          : lang === "de"
                            ? "Datenschutz"
                            : "Privacy"}
                      </Link>
                    </span>
                  </label>
                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      required
                      checked={form.policyAccepted}
                      disabled={submitting}
                      onChange={(e) =>
                        input("policyAccepted", e.target.checked)
                      }
                    />
                    <span>{t.policy}</span>
                  </label>
                  {error && (
                    <p role="alert" className={styles.error}>
                      {errorCopy(error, t)}
                      {error === "SLOT_UNAVAILABLE" && (
                        <button
                          type="button"
                          className={styles.secondary}
                          onClick={() => setReload((n) => n + 1)}
                        >
                          {t.retry}
                        </button>
                      )}
                    </p>
                  )}
                  <button
                    className={styles.button}
                    disabled={submitting}
                    type="submit"
                  >
                    {submitting ? t.sending : t.submit}
                  </button>
                </form>
              </section>
            )}
          </>
        )}
        <nav className={styles.links}>
          <Link href="/booking/manage">{t.manage}</Link>
          <a href={`mailto:${LEGAL_COMPANY.email}`}>{t.contact}</a>
          <a dir="ltr" href={`tel:${LEGAL_COMPANY.phone.replaceAll(" ", "")}`}>
            {LEGAL_COMPANY.phone}
          </a>
        </nav>
        <p className={styles.muted}>{t.policyNote}</p>
      </main>
    </>
  );
}
