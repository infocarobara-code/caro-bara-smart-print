"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { useLanguage } from "@/lib/languageContext";
import { bookingCopy, errorCopy } from "@/lib/appointments/copy";
import { LEGAL_COMPANY } from "@/lib/legal/company";
import styles from "../weekly.module.css";
export default function ManageBooking() {
  const { language } = useLanguage(),
    lang = language === "ar" || language === "de" ? language : "en",
    t = bookingCopy[lang];
  const [reference, setReference] = useState(""),
    [email, setEmail] = useState(""),
    [busy, setBusy] = useState(false),
    [status, setStatus] = useState(""),
    [error, setError] = useState("");
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const r = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reference: reference.trim().toUpperCase(),
          email,
        }),
      });
      const b = await r.json();
      if (!r.ok || !b.success) throw new Error(b.error);
      setStatus(b.status);
    } catch (e) {
      setError(e instanceof Error ? e.message : "UNKNOWN");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Header />
      <main className={styles.main} dir={lang === "ar" ? "rtl" : "ltr"}>
        <h1>{t.cancelTitle}</h1>
        <p className={styles.muted}>{t.cancelIntro}</p>
        <section className={styles.panel}>
          <form onSubmit={submit}>
            <div className={styles.form}>
              <label className={`${styles.field} ${styles.wide}`}>
                {t.code}
                <input
                  dir="ltr"
                  required
                  maxLength={35}
                  value={reference}
                  disabled={busy}
                  onChange={(e) => setReference(e.target.value)}
                />
              </label>
              <label className={`${styles.field} ${styles.wide}`}>
                {t.email}
                <input
                  dir="ltr"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  disabled={busy}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <p className={styles.notice}>{t.policyNote}</p>
            {error && (
              <p role="alert" className={styles.error}>
                {errorCopy(error, t)}
              </p>
            )}
            {status && (
              <p role="status" className={styles.notice}>
                {status === "cancelled" ? t.cancelled : t.review}
              </p>
            )}
            <button
              className={styles.button}
              disabled={busy || status === "cancelled"}
            >
              {busy ? t.sending : t.cancel}
            </button>
          </form>
        </section>
        <nav className={styles.links}>
          <Link href="/booking">{t.back}</Link>
          <a href={`mailto:${LEGAL_COMPANY.email}`}>{t.contact}</a>
          <a href={`tel:${LEGAL_COMPANY.phone.replaceAll(" ", "")}`}>
            {LEGAL_COMPANY.phone}
          </a>
        </nav>
      </main>
    </>
  );
}
