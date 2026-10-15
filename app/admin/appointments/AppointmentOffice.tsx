"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import AdminNav from "../AdminNav";
import { canRetry, mailState, selectAppointments, validAppointments, validMail, workCounts, type AdminAppointment, type MailRecord, type WorkFilter } from "@/lib/appointments/admin-model";
import { operationsCopy, mailFailure } from "./operations-copy";
import {
  DEFAULT_POLICY,
  validatePolicy,
  type BookingPolicy,
  type BookingMode,
} from "@/lib/appointments/policy";
import styles from "../admin.module.css";
const copy = {
  ar: {
    title: "المواعيد",
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
    saved: "حُفظ التعديل. إرسال البريد يُعالج بشكل منفصل؛ الحفظ لا يثبت وصول الرسالة.",
    error: "تعذر إتمام العملية. لم نؤكد الحفظ؛ حدّث الصفحة ثم حاول مجددًا.",
    unavailable:
      "تعذر تحميل البيانات. تحقق من جلسة الدخول ثم أعد المحاولة.",
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
      "راجع الطلبات الجديدة وأكّد المناسب منها. المواعيد المعلقة والمؤكدة تحجز الفترة؛ الاتصال لا يعني الرد الفوري. عرض آخر 300 موعد.",
  },
  de: {
    title: "Termine",
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
      "Gespeichert. E-Mails werden separat verarbeitet; dies bestätigt keinen Empfang.",
    error:
      "Vorgang fehlgeschlagen. Speichern ist nicht bestätigt. Bitte aktualisieren und erneut versuchen.",
    unavailable:
      "Daten konnten nicht geladen werden. Bitte Anmeldung prüfen und erneut versuchen.",
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
      "Neue Anfragen prüfen und passende Termine bestätigen. Angefragte und bestätigte Zeiten sind reserviert. Telefonzeiten sind kein Sofortservice. Letzte 300 Termine.",
  },
  en: {
    title: "Appointments",
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
    saved: "Saved. Emails are processed separately; this does not confirm receipt.",
    error: "Operation failed. Saving is not confirmed. Refresh and retry.",
    unavailable:
      "Could not load data. Check your sign-in and try again.",
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
      "Review new requests and confirm suitable appointments. Pending and confirmed times are reserved. Phone availability does not mean an immediate response. Latest 300 appointments.",
  },
};
const modes: BookingMode[] = ["we_come_free", "at_store", "phone_call"];
const clock = (n: number) =>
  `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
const minute = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};
export default function AppointmentOffice({initialLang = "de"}:{initialLang?: "ar" | "de" | "en"} = {}) {
  const [lang, setLang] = useState<"ar" | "de" | "en">(initialLang),
    [appointments, setAppointments] = useState<AdminAppointment[]>([]),
    [outbox, setOutbox] = useState<MailRecord[]>([]),
    [policy, setPolicy] = useState<BookingPolicy>(DEFAULT_POLICY),
    [updatedAt, setUpdatedAt] = useState(""),
    [busy, setBusy] = useState(false),
    [ready, setReady] = useState(false),
    [error, setError] = useState(false),
    [errorCode, setErrorCode] = useState(""),
    [notice, setNotice] = useState(false),
    [filter, setFilter] = useState<WorkFilter>("pending"),
    [closed, setClosed] = useState(""),
    [view, setView] = useState("appointments"),
    [search, setSearch] = useState(""),
    [history, setHistory] = useState(false);
  const dirty = useRef(false);
  const operation = useRef(false);
  const [draftDirty, setDraftDirty] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState<number | null>(null);
  const [truncated, setTruncated] = useState(false);
  const [writeNeedsRefresh, setWriteNeedsRefresh] = useState(false);
  const [mailFilter, setMailFilter] = useState<"all"|"review">("all");
  const op = operationsCopy[lang];
  const now = refreshedAt ?? Date.now();
  const counts = workCounts(appointments, outbox, now);
  const visible = selectAppointments(appointments,filter,history,search,now);
  const extra = {
    ar: {appointments:"المواعيد",email:"مراجعة البريد",search:"ابحث بالاسم أو رمز الموعد",history:"عرض المواعيد السابقة أيضًا",details:"تفاصيل الموعد",minutes:"دقيقة",queued:"طُلبت إعادة المحاولة. هذا لا يؤكد وصول البريد.",delivery:"قبول مزود البريد لا يعني وصول الرسالة إلى صندوق المستلم. هذه حتى 100 رسالة، مع أولوية غير المرسلة؛ تحقّق من حالات الارتداد لدى مزود البريد.",accepted:"قبله مزود البريد",waiting:"بانتظار الإرسال",review:"يحتاج مراجعة",draft:"لديك تعديلات غير محفوظة على الجدول؛ التحديث يحافظ عليها.",confirmCancel:"سيُلغى الموعد وتُحرر الفترة، وتُجهز رسالة للعميل. هل تريد المتابعة؟",expired:"موعد سابق؛ لا يمكن تأكيده",loading:"جارٍ تحميل البيانات…"},
    de: {appointments:"Termine",email:"E-Mail-Prüfung",search:"Name oder Termincode suchen",history:"Vergangene Termine einschließen",details:"Termindetails",minutes:"Min.",queued:"Erneuter Versuch angefordert. Der E-Mail-Empfang ist damit nicht bestätigt.",delivery:"Annahme durch den Anbieter bestätigt keinen Posteingang. Bis zu 100 E-Mails, ungesendete zuerst; Rückläufer beim E-Mail-Anbieter prüfen.",accepted:"Vom Anbieter angenommen",waiting:"Wartet auf Versand",review:"Prüfung erforderlich",draft:"Ungespeicherter Wochenplan bleibt beim Aktualisieren erhalten.",confirmCancel:"Der Termin wird abgesagt, die Zeit freigegeben und eine E-Mail vorbereitet. Fortfahren?",expired:"Vergangener Termin: Bestätigung nicht möglich",loading:"Daten werden geladen…"},
    en: {appointments:"Appointments",email:"Email review",search:"Search name or appointment code",history:"Include past appointments",details:"Appointment details",minutes:"min",queued:"Retry requested. Email receipt is not confirmed.",delivery:"Provider acceptance does not confirm inbox delivery. Up to 100 emails, unsent first; check bounces with the email provider.",accepted:"Accepted by provider",waiting:"Awaiting dispatch",review:"Needs review",draft:"Unsaved schedule changes are preserved when refreshing.",confirmCancel:"Cancel this appointment, release its time and prepare an email to the customer. Continue?",expired:"Past appointment: cannot confirm",loading:"Loading data…"}
  }[lang];
  const [queued, setQueued] = useState(false);
  const t = copy[lang];
  const load = useCallback(async (replaceDraft = false) => {
    setBusy(true);
    setNotice(false);
    try {
      const r = await fetch("/api/appointments/admin", { cache: "no-store" });
      const b = await r.json();
      if (!r.ok || !b.success || !b.settings?.[0]) throw new Error(b.error || "UNAVAILABLE");
      if (!validAppointments(b.appointments) || !validMail(b.outbox) || !validatePolicy(b.settings[0].policy) || !Number.isFinite(Date.parse(b.settings[0].updated_at))) throw new Error("INVALID_RESPONSE");
      setRefreshedAt(Date.now());
      setTruncated(!!b.limits && Object.values(b.limits).some(Boolean));
      setWriteNeedsRefresh(false);
      setAppointments(b.appointments);
      setOutbox(b.outbox);
      if (!dirty.current || replaceDraft) {
        setPolicy(b.settings[0].policy);
        setClosed(b.settings[0].policy.closedDates.join("\n"));
        setUpdatedAt(b.settings[0].updated_at);
        dirty.current = false;
        setDraftDirty(false);
      }
      setReady(true);
      setError(false);
      return true;
    } catch (e) {
      setErrorCode(e instanceof Error ? e.message : "UNAVAILABLE");
      setError(true);
      return false;
    } finally {
      setBusy(false);
    }
  }, []);
  useEffect(() => {
    const initial = new URLSearchParams(window.location.search).get("lang");
    if (initial === "ar" || initial === "de" || initial === "en") setLang(initial);
    void load();
  }, [load]);
  async function action(body: { action?: string; status?: string; [key: string]: unknown }) {
    if (busy || operation.current || writeNeedsRefresh) return;
    if (body.status === "cancelled" && !window.confirm(extra.confirmCancel)) return;
    if (body.action === "settings" && !validatePolicy(body.policy)) { setErrorCode("INVALID_INPUT"); setError(true); return; }
    operation.current = true;
    setBusy(true);
    setError(false);
    setNotice(false);
    setQueued(false);
    try {
      const r = await fetch("/api/appointments/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const b = await r.json();
      if (!r.ok || !b.success) throw new Error(b.error || "UNAVAILABLE");
      // The write is durable even if the following read fails. Never invite a duplicate.
      setQueued(body.action === "retry");
      setWriteNeedsRefresh(true);
      const refreshed = await load(body.action === "settings");
      if (refreshed) {
        setQueued(body.action === "retry");
        setNotice(true);
      }
    } catch (e) {
      setErrorCode(e instanceof Error ? e.message : "UNAVAILABLE");
      setError(true);
    } finally {
      operation.current = false;
      setBusy(false);
    }
  }
  function editPolicy(update: (p: BookingPolicy) => BookingPolicy) { dirty.current = true; setDraftDirty(true); setPolicy(update); }
  function changeWindow(
    mode: BookingMode,
    index: number,
    key: "start" | "end" | "days",
    value: number | number[],
  ) {
    dirty.current = true;
    editPolicy((p) => ({
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
      <AdminNav lang={lang} active="appointments" onLanguage={setLang} />
      <h1>{t.title}</h1>
      <p className={styles.muted}>{t.locked}</p>
      <button
        className={styles.secondary}
        disabled={busy}
        onClick={() => void load()}
      >
        {t.refresh}
      </button>
      <nav className={styles.links} aria-label={t.title}>
        {[["appointments",extra.appointments],["email",extra.email],["settings",t.settings]].map(([key,label]) => <button key={key} type="button" className={view===key?styles.button:styles.secondary} aria-pressed={view===key} onClick={()=>setView(key)}>{label}</button>)}
      </nav>
      {!ready && busy && <p role="status">{extra.loading}</p>}
      {view === "settings" && <p className={draftDirty ? styles.notice : styles.muted}>{draftDirty ? op.dirty : op.clean}</p>}
      {writeNeedsRefresh && <p role="alert" className={styles.notice}>{queued ? extra.queued : op.savedReload}</p>}
      {truncated && <p className={styles.notice}>{op.limited}</p>}
      {refreshedAt && <p className={styles.muted}>{op.updated}: {new Intl.DateTimeFormat(lang === "ar" ? "ar-DE" : lang === "de" ? "de-DE" : "en-GB",{dateStyle:"short",timeStyle:"short",timeZone:"Europe/Berlin"}).format(new Date(refreshedAt))}</p>}
      {error && !writeNeedsRefresh && (
        <p role="alert" className={styles.error}>
          {errorCode === "UNAUTHORIZED" ? (lang === "ar" ? "انتهت جلسة الدخول. سجّل الدخول مجددًا." : lang === "de" ? "Sitzung abgelaufen. Bitte erneut anmelden." : "Session expired. Sign in again.") : errorCode === "STATE_CONFLICT" ? (lang === "ar" ? "تغير السجل منذ تحميله. حدّث البيانات قبل إعادة المحاولة. تعديلات الجدول المحلية محفوظة حتى تعيد تحميل الصفحة." : lang === "de" ? "Der Datensatz wurde geändert. Bitte vor einem neuen Versuch aktualisieren. Lokale Planänderungen bleiben bis zum Neuladen erhalten." : "This record changed. Refresh before retrying. Local schedule edits remain until a page reload.") : errorCode === "INVALID_INPUT" ? (lang === "ar" ? "راجع الأيام والفترات والتواريخ المدخلة؛ لم يُحفظ الجدول." : lang === "de" ? "Tage, Zeitfenster und Datumsangaben prüfen. Plan nicht gespeichert." : "Check days, time windows and dates. Schedule was not saved.") : ready ? t.error : t.unavailable}
          {errorCode === "UNAUTHORIZED" && <Link href={`/admin/login?lang=${lang}`}>{lang === "ar" ? "دخول الإدارة" : lang === "de" ? "Anmelden" : "Sign in"}</Link>}
        </p>
      )}
      {notice && (
        <p role="status" className={styles.notice}>
          {queued ? extra.queued : t.saved}
        </p>
      )}
      {ready && (
        <>
          <section aria-label={op.overview} className={styles.metrics}>
            {(["pending","today","late","unresolved","mail"] as const).map(key=><button key={key} type="button" className={styles.metric} aria-pressed={key === "mail" ? view === "email" && mailFilter === "review" : view === "appointments" && filter === key} onClick={()=>{if(key === "mail"){setView("email");setMailFilter("review");}else{setView("appointments");setFilter(key);setSearch("");}}}><strong>{new Intl.NumberFormat(lang === "ar" ? "ar" : lang).format(counts[key])}</strong><span>{op[key]}</span></button>)}
          </section>
          <p className={styles.muted}>{op.scope}</p>
          {view === "appointments" && <section className={styles.panel}>
            <label className={styles.field}>
              {t.title}
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as WorkFilter)}
              >
                {(
                  ["pending", "confirmed", "late", "unresolved", "today", "cancelled", "rejected"] as const
                ).map((s) => (
                  <option key={s} value={s}>
                    {s === "late" || s === "unresolved" || s === "today" ? op[s] : t[s]} ({selectAppointments(appointments,s,history,"",now).length})
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>{extra.search}<input type="search" value={search} onChange={e=>setSearch(e.target.value)} /></label>
            <label className={styles.check}><input type="checkbox" checked={history} onChange={e=>setHistory(e.target.checked)} />{extra.history}</label>
            {!visible.length && <p className={styles.empty}>{op.noMatch}</p>}
            {visible
              .map((a) => (
                <article key={a.id} className={styles.panel}>
                  <div className={styles.rowHeading}><h2>{a.full_name}</h2><span className={styles.badge}>{t[a.status]}</span></div>
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
                    – {new Intl.DateTimeFormat(lang === "ar" ? "ar-DE" : lang === "de" ? "de-DE" : "en-GB", {hour:"2-digit",minute:"2-digit",timeZone:"Europe/Berlin"}).format(new Date(a.end_at))} · Europe/Berlin ·{" "}
                    {Math.round(
                      (Date.parse(a.end_at) - Date.parse(a.start_at)) / 60000,
                    )}{" "}
                    {extra.minutes}
                  </p>
                  <p>
                    {a.mode === "we_come_free"
                      ? t.visit
                      : a.mode === "at_store"
                        ? t.store
                        : t.phone}
                  </p>
                  <details><summary>{extra.details}</summary>
                  <code className={styles.code}>{a.reference}</code>
                  <p dir="auto">{a.address}</p>
                  <p>
                    <a href={`mailto:${a.email}`}>{a.email}</a> ·{" "}
                    <bdi>{a.phone}</bdi>
                  </p>
                  <p dir="auto">{a.notes}</p></details>
                  {a.urgent && <p className={styles.notice}>{t.fee}</p>}
                  {a.cancellation_requested_at && (
                    <p className={styles.error}>{t.late}</p>
                  )}
                  <div className={styles.links}>
                    {a.status === "pending" && (
                      <>
                        <button
                          className={styles.button}
                          disabled={busy || writeNeedsRefresh || Date.parse(a.start_at) <= now}
                          title={Date.parse(a.start_at) <= now ? extra.expired : undefined}
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
                          disabled={busy || writeNeedsRefresh}
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
                    {a.status === "confirmed" && (
                      <button
                        className={styles.secondary}
                        disabled={busy || writeNeedsRefresh}
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
          </section>}
          {view === "email" && <section className={styles.panel}>
            <h2>
              {t.outbox} ({outbox.length})
            </h2>
            <p className={styles.muted}>{extra.delivery}</p>
            <div className={styles.links}>{(["all","review"] as const).map(key=><button key={key} type="button" className={mailFilter===key?styles.button:styles.secondary} aria-pressed={mailFilter===key} onClick={()=>setMailFilter(key)}>{key === "review" ? op.mail : t.outbox}</button>)}</div>
            {!outbox.some(o=>mailFilter === "all" || mailState(o,now)==="review") && <p className={styles.empty}>{op.noMail}</p>}
            {outbox.filter(o=>mailFilter === "all" || mailState(o,now)==="review").map(o=><article className={styles.mailRow} key={o.id}>
              <div className={styles.rowHeading}><strong>{o.recipient === "owner" ? op.owner : op.customer}</strong><span className={styles.badge}>{extra[mailState(o,now)]}</span></div>
              <p>{op.event}: {op.events[o.event as keyof typeof op.events] || op.unknown}</p>
              <code className={styles.code}>{o.reference || o.appointment_id}</code>
              <p className={styles.muted}>{op.created}: {new Intl.DateTimeFormat(lang === "ar" ? "ar-DE" : lang === "de" ? "de-DE" : "en-GB",{dateStyle:"short",timeStyle:"short",timeZone:"Europe/Berlin"}).format(new Date(o.created_at))}</p>
              {!o.sent_at && <p>{o.last_error ? op.failures[mailFailure(o.last_error)] : !canRetry(o,now) ? op.expired : extra.waiting}</p>}
              {o.sent_at ? <p className={styles.muted}>{op.provider}</p> : canRetry(o,now) ? <button type="button" className={styles.secondary} disabled={busy || writeNeedsRefresh} onClick={()=>void action({action:"retry",id:o.appointment_id})}>{op.retry}</button> : <p className={styles.muted}>{op.expired}</p>}
            </article>)}
          </section>}
          {view === "settings" && <section className={styles.panel}>
            <h2>{t.settings}</h2>
            <button type="button" disabled={busy} className={styles.secondary} onClick={() => { if (window.confirm(lang === "ar" ? "تجاهل التعديلات المحلية وتحميل الجدول المحفوظ؟" : lang === "de" ? "Lokale Änderungen verwerfen und gespeicherten Plan laden?" : "Discard local changes and load the saved schedule?")) void load(true); }}>{lang === "ar" ? "تجاهل تعديلات الجدول" : lang === "de" ? "Planänderungen verwerfen" : "Discard schedule edits"}</button>
            <p><Link href={`/admin/requests?lang=${lang}&office=appointments_new&legacy=1`}>{lang === "ar" ? "سجل نظام المواعيد السابق" : lang === "de" ? "Archiv des früheren Terminsystems" : "Previous appointment system archive"}</Link></p>
            <form onChange={() => { dirty.current = true; setDraftDirty(true); }}
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
                          editPolicy((p) => ({
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
                      editPolicy((p) => ({
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
                        editPolicy((p) => ({
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
              <button className={styles.button} disabled={busy || writeNeedsRefresh} type="submit">
                {t.save}
              </button>
            </form>
          </section>}
        </>
      )}
    </main>
  );
}
