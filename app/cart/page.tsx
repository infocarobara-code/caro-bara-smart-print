"use client";

import { startTransition, useEffect, useMemo, useState, type MouseEvent } from "react";
import { Mail, MessageCircle, X } from "lucide-react";
import Header from "@/components/Header";
import { services } from "@/data/services";
import { getCart, removeCartItem, saveCart, type CartItem } from "@/lib/cart";
import { buildCartMessage, summarizeCartItem } from "@/lib/cart-summary";
import { LEGAL_COMPANY } from "@/lib/legal/company";
import { useLanguage } from "@/lib/languageContext";
import styles from "./cart.module.css";

const text = {
  ar: { title: "مراجعة الاستفسار", quantity: "الكمية", details: "التفاصيل", remove: "حذف", whatsapp: "إرسال عبر واتساب", email: "إرسال عبر البريد", hint: "تفتح رسالة جاهزة؛ أكمل إرسالها من واتساب أو تطبيق البريد. تُفرّغ السلة تلقائيًا عند فتح الرسالة.", empty: "السلة فارغة.", add: "اختر خدمة", prepared: "رسالتك جاهزة في التطبيق الذي اخترته، وأُفرغت السلة.", next: "أكمل الإرسال هناك. فتح التطبيق لا يؤكد استلامنا للرسالة.", recovery: "لم تفتح الرسالة؟", restore: "استعادة الاستفسار", failure: "تعذر تجهيز الرسالة أو تفريغ السلة. بقيت التفاصيل محفوظة؛ حاول مرة أخرى.", legal: "استفسار غير ملزم، دون التزام بالدفع.", privacy: "الخصوصية", terms: "الشروط", rights: "حق التراجع" },
  de: { title: "Anfrage prüfen", quantity: "Menge", details: "Details", remove: "Entfernen", whatsapp: "Per WhatsApp senden", email: "Per E-Mail senden", hint: "Eine fertige Nachricht wird geöffnet. Sende sie in WhatsApp oder deinem E-Mail-Programm ab. Der Warenkorb wird beim Öffnen automatisch geleert.", empty: "Dein Warenkorb ist leer.", add: "Service auswählen", prepared: "Deine Nachricht ist im gewählten Programm vorbereitet. Der Warenkorb wurde geleert.", next: "Sende sie dort ab. Das Öffnen bestätigt noch keinen Eingang bei uns.", recovery: "Nachricht nicht geöffnet?", restore: "Anfrage wiederherstellen", failure: "Die Nachricht konnte nicht vorbereitet oder der Warenkorb nicht geleert werden. Deine Angaben bleiben erhalten. Bitte versuche es erneut.", legal: "Unverbindliche Anfrage ohne Zahlungspflicht.", privacy: "Datenschutz", terms: "AGB", rights: "Widerruf" },
  en: { title: "Review inquiry", quantity: "Quantity", details: "Details", remove: "Remove", whatsapp: "Send via WhatsApp", email: "Send by email", hint: "A prepared message opens. Finish sending in WhatsApp or your email app. The cart clears automatically when the message opens.", empty: "Your cart is empty.", add: "Choose a service", prepared: "Your message is prepared in your chosen app. The cart has been cleared.", next: "Send it there. Opening the app does not confirm receipt by us.", recovery: "Message did not open?", restore: "Restore inquiry", failure: "The message could not be prepared or the cart cleared. Your details have been kept. Please try again.", legal: "Non-binding inquiry with no payment obligation.", privacy: "Privacy", terms: "Terms", rights: "Withdrawal" },
};

type Handoff = { items: CartItem[]; message: string; createdAt: number };
const BACKUP_KEY = "caro-cart-handoff";
const BACKUP_TTL = 15 * 60 * 1000;

export default function CartPage() {
  const { language, dir } = useLanguage();
  const t = text[language];
  const [items, setItems] = useState<CartItem[]>([]);
  const [handoff, setHandoff] = useState<Handoff | null>(null);
  const [error, setError] = useState("");
  const message = useMemo(() => items.length ? buildCartMessage(items, services, language) : handoff?.message || "", [items, language, handoff]);

  useEffect(() => {
    const refresh = () => setItems(getCart());
    startTransition(() => {
      refresh();
      try {
        const backup = JSON.parse(sessionStorage.getItem(BACKUP_KEY) || "null") as Handoff | null;
        if (backup && Array.isArray(backup.items) && typeof backup.message === "string" &&
            typeof backup.createdAt === "number" && Date.now() - backup.createdAt < BACKUP_TTL && backup.createdAt <= Date.now()) {
          setHandoff(backup);
        } else sessionStorage.removeItem(BACKUP_KEY);
      } catch { /* A session-only recovery copy is optional; the in-memory copy remains available. */ }
    });
    window.addEventListener("cart-updated", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("cart-updated", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  useEffect(() => {
    if (!handoff) return;
    const timer = window.setTimeout(() => {
      setHandoff(null);
      try { sessionStorage.removeItem(BACKUP_KEY); } catch { /* Best-effort removal of the temporary recovery copy. */ }
    }, Math.max(0, BACKUP_TTL - (Date.now() - handoff.createdAt)));
    return () => window.clearTimeout(timer);
  }, [handoff]);

  const handOff = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!items.length) { event.preventDefault(); return; }
    try {
      // Keep both links and their exact message stable during the browser's default navigation.
      const backup = { items, message, createdAt: Date.now() };
      saveCart([]);
      setHandoff(backup);
      setItems([]);
      setError("");
      try { sessionStorage.setItem(BACKUP_KEY, JSON.stringify(backup)); } catch { /* Memory recovery still works. */ }
    } catch {
      event.preventDefault();
      setError(t.failure);
    }
  };

  const restore = () => {
    if (!handoff) return;
    try {
      const current = getCart();
      saveCart([...current, ...handoff.items.filter(item => !current.some(existing => existing.id === item.id))]);
      setItems(getCart());
      setHandoff(null);
      setError("");
      try { sessionStorage.removeItem(BACKUP_KEY); } catch { /* No persistent backup is required. */ }
    } catch { setError(t.failure); }
  };

  const remove = (id: string) => {
    try { removeCartItem(id); setItems(getCart()); setError(""); }
    catch { setError(t.failure); }
  };

  return <div className={styles.page} dir={dir}>
    <Header />
    <main className={styles.main}>
      <h1>{t.title}</h1>
      {error && <p className={styles.error} role="alert">{error}</p>}
      {!items.length && handoff && <div className={styles.status} role="status">
        <p>{t.prepared}</p><p>{t.next}</p>
        <details><summary>{t.recovery}</summary><button type="button" onClick={restore}>{t.restore}</button></details>
      </div>}
      {items.length ? <section className={styles.panel} aria-label={t.title}>
        {items.map(item => {
          const summary = summarizeCartItem(item, services.find(service => service.id === item.serviceId), language);
          return <article className={styles.item} key={item.id}>
            <div className={styles.row}><h2>{summary.title}</h2><button className={styles.remove} type="button" onClick={() => remove(item.id)} aria-label={`${t.remove}: ${summary.title}`}><X size={16} aria-hidden="true" /></button></div>
            <p className={styles.quantity}>{t.quantity}: {summary.quantity}</p>
            {!!summary.fields.length && <details className={styles.details}><summary>{t.details}</summary>
              {summary.fields.map(field => <p className={styles.field} key={field.id}><strong>{field.label}:</strong> <bdi>{field.value}</bdi></p>)}
            </details>}
          </article>;
        })}
      </section> : !handoff && <p className={styles.empty}>{t.empty} <a href="/request">{t.add}</a></p>}
      {(items.length > 0 || handoff) && <>
        <div className={styles.actions}>
          <a className={styles.action} href={`https://wa.me/4917621105086?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer" onClick={handOff} aria-disabled={!items.length}><MessageCircle size={18} aria-hidden="true" />{t.whatsapp}</a>
          <a className={styles.action} href={`mailto:${LEGAL_COMPANY.email}?subject=${encodeURIComponent(({ar:"استفسار - Caro Bara",de:"Anfrage - Caro Bara",en:"Inquiry - Caro Bara"})[language])}&body=${encodeURIComponent(message)}`} onClick={handOff} aria-disabled={!items.length}><Mail size={18} aria-hidden="true" />{t.email}</a>
        </div>
        {!!items.length && <p className={styles.hint}>{t.hint}</p>}
      </>}
      <aside className={styles.notice}>
        <p>{t.legal}</p>
        <a href="/datenschutz">{t.privacy}</a>{" · "}<a href="/agb">{t.terms}</a>{" · "}<a href="/widerruf">{t.rights}</a>
      </aside>
    </main>
  </div>;
}
