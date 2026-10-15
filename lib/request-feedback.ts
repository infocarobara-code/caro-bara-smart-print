import type { Language } from "@/lib/i18n";

const failure = {
  ar: "تعذر تأكيد استلام الاستفسار الآن. احتفظنا ببياناتك؛ يرجى المحاولة لاحقًا أو التواصل معنا قبل إعادة الإرسال.",
  de: "Der Eingang konnte gerade nicht bestätigt werden. Deine Angaben bleiben erhalten. Bitte versuche es später erneut oder kontaktiere uns vor einem erneuten Versand.",
  en: "We could not confirm receipt right now. Your details have been kept. Please try later or contact us before submitting again.",
};

export function requestErrorMessage(error: unknown, language: Language): string {
  const message = typeof error === "string" ? error.toLowerCase() : "";
  if (["fetch failed", "failed to fetch", "networkerror", "load failed", "timeout", "abort"].some(value => message.includes(value))) {
    return {
      ar: "تعذر الاتصال لإتمام الاستفسار. بياناتك ما زالت موجودة. إذا سبق أن ضغطت إرسال، تواصل معنا للتحقق من الاستلام قبل إعادة المحاولة.",
      de: "Die Verbindung wurde unterbrochen. Deine Angaben bleiben erhalten. Falls du bereits gesendet hast, kontaktiere uns bitte zur Prüfung des Eingangs, bevor du es erneut versuchst.",
      en: "The connection was interrupted. Your details remain available. If you already submitted, please contact us to check receipt before trying again.",
    }[language];
  }
  return failure[language];
}

export function hasRequestReceipt(value: unknown): value is {
  success: true; savedToDatabase: true; requestId: string; notificationPending?: boolean;
} {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return data.success === true && data.savedToDatabase === true &&
    typeof data.requestId === "string" && /^RRMF88-\d{2}-\d{2}-\d{4}-\d{8}$/.test(data.requestId);
}
