"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Header from "@/components/Header";
import { services } from "@/data/services";
import {
  clearCart,
  getCart,
  removeCartItem,
  type CartItem,
} from "@/lib/cart";
import type { Language } from "@/lib/i18n";
import { useLanguage } from "@/lib/languageContext";
import type { ServiceField } from "@/types/service";

type CustomerData = {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
};

const cartText = {
  badge: {
    ar: "مرحلة المراجعة والإرسال",
    de: "Prüfung & Versand",
    en: "Review & Submit",
  },
  title: {
    ar: "راجع طلباتك وأرسلها باحتراف",
    de: "Prüfe deine Anfragen und sende sie professionell ab",
    en: "Review your requests and send them professionally",
  },
  subtitle: {
    ar: "راجع الطلبات المضافة، ثم أدخل بيانات العميل مرة واحدة فقط قبل الإرسال النهائي.",
    de: "Prüfe die hinzugefügten Anfragen und gib die Kundendaten nur einmal vor dem finalen Versand ein.",
    en: "Review the added requests, then enter the customer details once before final submission.",
  },
  cartTitle: {
    ar: "الطلبات الحالية",
    de: "Aktuelle Anfragen",
    en: "Current Requests",
  },
  count: {
    ar: "عدد الطلبات",
    de: "Anzahl der Anfragen",
    en: "Number of requests",
  },
  empty: {
    ar: "لا توجد طلبات في السلة حاليًا.",
    de: "Der Warenkorb enthält aktuell keine Anfragen.",
    en: "There are currently no requests in the cart.",
  },
  remove: {
    ar: "حذف",
    de: "Löschen",
    en: "Remove",
  },
  clear: {
    ar: "تفريغ السلة",
    de: "Warenkorb leeren",
    en: "Clear cart",
  },
  sendAll: {
    ar: "إرسال الطلبات عبر واتساب",
    de: "Anfragen per WhatsApp senden",
    en: "Send Requests via WhatsApp",
  },
  sending: {
    ar: "جارٍ التحضير...",
    de: "Wird vorbereitet...",
    en: "Preparing...",
  },
  customerInfo: {
    ar: "بيانات العميل",
    de: "Kundendaten",
    en: "Customer Information",
  },
  fullName: {
    ar: "الاسم الكامل",
    de: "Vollständiger Name",
    en: "Full Name",
  },
  phone: {
    ar: "رقم الهاتف",
    de: "Telefonnummer",
    en: "Phone Number",
  },
  email: {
    ar: "البريد الإلكتروني",
    de: "E-Mail",
    en: "Email",
  },
  street: {
    ar: "الشارع",
    de: "Straße",
    en: "Street",
  },
  houseNumber: {
    ar: "رقم المنزل / الشقة",
    de: "Hausnummer / Wohnung",
    en: "House Number / Apartment",
  },
  postalCode: {
    ar: "الرمز البريدي",
    de: "Postleitzahl",
    en: "Postal Code",
  },
  city: {
    ar: "المدينة",
    de: "Stadt",
    en: "City",
  },
  generalNotes: {
    ar: "ملاحظات عامة",
    de: "Allgemeine Hinweise",
    en: "General Notes",
  },
  customerSectionDescription: {
    ar: "أدخل بيانات العميل مرة واحدة فقط ليتم إرفاقها مع جميع الطلبات.",
    de: "Gib die Kundendaten nur einmal ein, damit sie allen Anfragen beigefügt werden.",
    en: "Enter the customer details only once so they are included with all requests.",
  },
  requestsSectionDescription: {
    ar: "راجع الخدمات المضافة واحذف ما لا تحتاجه قبل الإرسال النهائي.",
    de: "Prüfe die hinzugefügten Services und entferne nicht benötigte Einträge vor dem finalen Versand.",
    en: "Review the added services and remove anything you do not need before final submission.",
  },
  requiredCustomerInfo: {
    ar: "يرجى إدخال الاسم الكامل، البريد الإلكتروني، رقم الهاتف، الشارع، رقم المنزل أو الشقة، الرمز البريدي، والمدينة قبل الإرسال.",
    de: "Bitte gib vor dem Senden den vollständigen Namen, die E-Mail, Telefonnummer, Straße, Hausnummer/Wohnung, Postleitzahl und Stadt ein.",
    en: "Please enter the full name, email, phone number, street, house number/apartment, postal code, and city before sending.",
  },
  sentSuccess: {
    ar: "تم فتح واتساب بالطلب الجاهز. يمكنك الآن إرسال الرسالة مباشرة.",
    de: "WhatsApp wurde mit der vorbereiteten Anfrage geöffnet. Du kannst die Nachricht jetzt direkt senden.",
    en: "WhatsApp was opened with the prepared request. You can now send the message directly.",
  },
  sendFailed: {
    ar: "تعذر فتح واتساب. تحقق من المتصفح أو حاول مرة أخرى.",
    de: "WhatsApp konnte nicht geöffnet werden. Prüfe den Browser oder versuche es erneut.",
    en: "Failed to open WhatsApp. Check the browser or try again.",
  },
};

export default function CartPage() {
  const { language, dir } = useLanguage();
  const lang = language as Language;
  const isArabic = lang === "ar";

  const [items, setItems] = useState<CartItem[]>([]);
  const [customerData, setCustomerData] = useState<CustomerData>({
    fullName: "",
    email: "",
    phone: "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
  });
  const [generalNotes, setGeneralNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const refreshCart = () => {
    setItems(getCart());
  };

  useEffect(() => {
    refreshCart();

    const handleFocus = () => refreshCart();
    const handleStorage = () => refreshCart();
    const handleCartUpdated = () => refreshCart();

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cart-updated", handleCartUpdated);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cart-updated", handleCartUpdated);
    };
  }, []);

  const servicesMap = useMemo(() => {
    return new Map(services.map((service) => [service.id, service]));
  }, []);

  const getServiceTitle = (item: CartItem) => {
    const service = servicesMap.get(item.serviceId);

    return (
      service?.title?.[lang] ||
      service?.title?.en ||
      service?.title?.de ||
      service?.title?.ar ||
      item.serviceId
    );
  };

  const getField = (
    item: CartItem,
    fieldId: string
  ): ServiceField | undefined => {
    const service = servicesMap.get(item.serviceId);

    return service?.fields?.find((field: ServiceField) => field.id === fieldId);
  };

  const getFieldLabel = (item: CartItem, fieldId: string) => {
    const field = getField(item, fieldId);

    return (
      field?.label?.[lang] ||
      field?.label?.en ||
      field?.label?.de ||
      field?.label?.ar ||
      fieldId
    );
  };

  const getOptionLabel = (
    item: CartItem,
    fieldId: string,
    optionValue: string
  ) => {
    const field = getField(item, fieldId);
    const option = field?.options?.find(
      (opt: NonNullable<ServiceField["options"]>[number]) =>
        opt.value === optionValue
    );

    return (
      option?.label?.[lang] ||
      option?.label?.en ||
      option?.label?.de ||
      option?.label?.ar ||
      optionValue
    );
  };

  const getFieldValue = (item: CartItem, fieldId: string, rawValue: string) => {
    const field = getField(item, fieldId);

    if (!field || !field.options?.length) {
      return rawValue;
    }

    if (field.type === "checkbox") {
      return rawValue
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean)
        .map((value) => getOptionLabel(item, fieldId, value))
        .join(", ");
    }

    return getOptionLabel(item, fieldId, rawValue);
  };

  const handleRemove = (itemId: string) => {
    removeCartItem(itemId);
    refreshCart();
  };

  const handleClear = () => {
    clearCart();
    refreshCart();
    setSuccessMessage("");
    setErrorMessage("");
    window.dispatchEvent(new Event("cart-updated"));
  };

  const handleCustomerChange = (key: keyof CustomerData, value: string) => {
    setCustomerData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (errorMessage) setErrorMessage("");
    if (successMessage) setSuccessMessage("");
  };

  const handleSend = async () => {
    if (items.length === 0) return;

    if (
      !customerData.fullName.trim() ||
      !customerData.email.trim() ||
      !customerData.phone.trim() ||
      !customerData.street.trim() ||
      !customerData.houseNumber.trim() ||
      !customerData.postalCode.trim() ||
      !customerData.city.trim()
    ) {
      setErrorMessage(cartText.requiredCustomerInfo[lang]);
      setSuccessMessage("");
      return;
    }

    try {
      setIsSending(true);
      setErrorMessage("");
      setSuccessMessage("");

      const phoneNumber = "4917621105086";

      const requestLines = items
        .map((item, index) => {
          const previewEntries = Object.entries(item.data).filter(
            ([_, value]) => String(value).trim() !== ""
          );

          const details =
            previewEntries.length > 0
              ? previewEntries
                  .map(
                    ([fieldId, rawValue]) =>
                      `- ${getFieldLabel(item, fieldId)}: ${getFieldValue(
                        item,
                        fieldId,
                        String(rawValue)
                      )}`
                  )
                  .join("\n")
              : "- No details";

          return `${index + 1}) ${getServiceTitle(item)}\n${details}`;
        })
        .join("\n\n");

      const message =
        lang === "ar"
          ? `طلب جديد - Caro Bara

بيانات العميل:
الاسم: ${customerData.fullName}
الهاتف: ${customerData.phone}
الإيميل: ${customerData.email}

العنوان:
${customerData.street} ${customerData.houseNumber}
${customerData.postalCode} ${customerData.city}

الطلبات:
${requestLines}

ملاحظات عامة:
${generalNotes.trim() || "-"}`

          : lang === "de"
            ? `Neue Anfrage - Caro Bara

Kundendaten:
Name: ${customerData.fullName}
Telefon: ${customerData.phone}
E-Mail: ${customerData.email}

Adresse:
${customerData.street} ${customerData.houseNumber}
${customerData.postalCode} ${customerData.city}

Anfragen:
${requestLines}

Allgemeine Hinweise:
${generalNotes.trim() || "-"}`

            : `New Request - Caro Bara

Customer:
Name: ${customerData.fullName}
Phone: ${customerData.phone}
Email: ${customerData.email}

Address:
${customerData.street} ${customerData.houseNumber}
${customerData.postalCode} ${customerData.city}

Requests:
${requestLines}

General Notes:
${generalNotes.trim() || "-"}`;

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

      window.open(whatsappUrl, "_blank");

      setSuccessMessage(cartText.sentSuccess[lang]);
      setErrorMessage("");
    } catch {
      setErrorMessage(cartText.sendFailed[lang]);
      setSuccessMessage("");
    } finally {
      setIsSending(false);
    }
  };

  const styles: Record<string, CSSProperties> = {
    page: {
      minHeight: "100vh",
      background: "linear-gradient(180deg, #f7f1e8 0%, #f3eadf 100%)",
      padding: "0 12px 72px",
      fontFamily: "Arial, sans-serif",
    },

    container: {
      maxWidth: "1180px",
      margin: "14px auto 0",
    },

    hero: {
      background: "linear-gradient(135deg, #fffaf4 0%, #f8efe3 100%)",
      border: "1px solid #e3d3bf",
      borderRadius: "22px",
      padding: "22px 16px 18px",
      boxShadow: "0 10px 28px rgba(96, 73, 46, 0.08)",
      marginBottom: "14px",
      textAlign: "center",
    },

    badge: {
      display: "inline-block",
      marginBottom: "10px",
      padding: "6px 12px",
      borderRadius: "999px",
      background: "#efe1cf",
      color: "#6d5338",
      fontSize: "12px",
      fontWeight: 700,
      border: "1px solid #ddc8af",
      letterSpacing: "0.2px",
    },

    title: {
      margin: "0 0 10px",
      fontSize: "clamp(24px, 6vw, 38px)",
      lineHeight: 1.2,
      color: "#2f2419",
      fontWeight: 800,
    },

    subtitle: {
      margin: "0 auto",
      maxWidth: "760px",
      color: "#5b4b3c",
      lineHeight: 1.75,
      fontSize: "14px",
    },

    layoutGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      gap: "14px",
      alignItems: "start",
    },

    panel: {
      background: "rgba(255,255,255,0.88)",
      border: "1px solid #e7d9c8",
      borderRadius: "20px",
      padding: "16px 14px",
      boxShadow: "0 6px 20px rgba(90, 70, 40, 0.06)",
      minWidth: 0,
    },

    panelTitle: {
      fontSize: "18px",
      margin: "0 0 8px",
      color: "#35281d",
      fontWeight: 800,
      lineHeight: 1.3,
    },

    panelDescription: {
      margin: "0 0 12px",
      color: "#6d5b49",
      lineHeight: 1.7,
      fontSize: "13px",
    },

    countText: {
      fontSize: "12px",
      color: "#7b6654",
      marginBottom: "12px",
      fontWeight: 700,
    },

    customerGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      gap: "10px",
    },

    input: {
      width: "100%",
      minHeight: "44px",
      padding: "10px 12px",
      border: "1px solid #dbc9b5",
      borderRadius: "12px",
      fontSize: "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      boxSizing: "border-box",
    },

    textarea: {
      width: "100%",
      minHeight: "100px",
      padding: "12px",
      border: "1px solid #dbc9b5",
      borderRadius: "14px",
      fontSize: "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      lineHeight: 1.7,
    },

    emptyBox: {
      border: "1px dashed #d9c4ab",
      borderRadius: "14px",
      padding: "14px",
      color: "#6f5b48",
      background: "#fffaf4",
      fontSize: "13px",
      lineHeight: 1.7,
    },

    itemsList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },

    itemCard: {
      border: "1px solid #e8dacc",
      borderRadius: "14px",
      padding: "12px",
      background: "#fffdf9",
    },

    itemHeader: {
      display: "flex",
      justifyContent: "space-between",
      gap: "10px",
      alignItems: "flex-start",
      marginBottom: "8px",
    },

    itemTitle: {
      fontWeight: 800,
      lineHeight: 1.55,
      color: "#2f2419",
      fontSize: "14px",
      minWidth: 0,
      flex: 1,
    },

    removeButton: {
      border: "none",
      background: "transparent",
      color: "#b63a31",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: 800,
      flexShrink: 0,
      padding: 0,
    },

    previewList: {
      display: "flex",
      flexDirection: "column",
      gap: "5px",
    },

    previewRow: {
      fontSize: "12px",
      color: "#4f4032",
      lineHeight: 1.6,
      wordBreak: "break-word",
    },

    actionsWrap: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginTop: "14px",
    },

    inlineMessageBox: {
      padding: "12px 14px",
      borderRadius: "14px",
      fontSize: "13px",
      lineHeight: 1.7,
      fontWeight: 700,
    },

    primaryButton: {
      width: "100%",
      minHeight: "46px",
      padding: "12px 14px",
      background: "#1f1711",
      color: "#ffffff",
      border: "1px solid #241a12",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: 800,
      fontSize: "14px",
    },

    secondaryButton: {
      width: "100%",
      minHeight: "46px",
      padding: "12px 14px",
      background: "#f2e7da",
      color: "#2f2419",
      border: "1px solid #e0cfbd",
      borderRadius: "14px",
      cursor: "pointer",
      fontWeight: 800,
      fontSize: "14px",
    },
  };

  return (
    <div dir={dir} style={styles.page}>
      <Header showBackHome />

      <div style={styles.container}>
        <section style={styles.hero}>
          <div style={styles.badge}>{cartText.badge[lang]}</div>
          <h1 style={styles.title}>{cartText.title[lang]}</h1>
          <p style={styles.subtitle}>{cartText.subtitle[lang]}</p>
        </section>

        <div style={styles.layoutGrid}>
          <section style={styles.panel}>
            <h2
              style={{
                ...styles.panelTitle,
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {cartText.cartTitle[lang]}
            </h2>

            <p
              style={{
                ...styles.panelDescription,
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {cartText.requestsSectionDescription[lang]}
            </p>

            <div
              style={{
                ...styles.countText,
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {cartText.count[lang]}: {items.length}
            </div>

            <div style={styles.itemsList}>
              {items.length === 0 && (
                <div
                  style={{
                    ...styles.emptyBox,
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {cartText.empty[lang]}
                </div>
              )}

              {items.map((item, index) => {
                const previewEntries = Object.entries(item.data)
                  .filter(([_, value]) => String(value).trim() !== "")
                  .slice(0, 6);

                return (
                  <div
                    key={item.id || `${item.serviceId}-${index}`}
                    style={styles.itemCard}
                  >
                    <div style={styles.itemHeader}>
                      <div
                        style={{
                          ...styles.itemTitle,
                          textAlign: isArabic ? "right" : "left",
                        }}
                      >
                        {getServiceTitle(item)}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        style={styles.removeButton}
                      >
                        {cartText.remove[lang]}
                      </button>
                    </div>

                    {previewEntries.length > 0 && (
                      <div style={styles.previewList}>
                        {previewEntries.map(([fieldId, rawValue]) => (
                          <div
                            key={fieldId}
                            style={{
                              ...styles.previewRow,
                              textAlign: isArabic ? "right" : "left",
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>
                              {getFieldLabel(item, fieldId)}:
                            </span>{" "}
                            {getFieldValue(item, fieldId, String(rawValue))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={styles.actionsWrap}>
              {(errorMessage || successMessage) && (
                <div
                  style={{
                    ...styles.inlineMessageBox,
                    border: errorMessage ? "1px solid #efc4bf" : "1px solid #b9dcc1",
                    background: errorMessage ? "#fff2f1" : "#edf8f0",
                    color: errorMessage ? "#8b2f25" : "#245a30",
                    textAlign: isArabic ? "right" : "left",
                  }}
                >
                  {errorMessage || successMessage}
                </div>
              )}

              <button
                type="button"
                onClick={handleSend}
                disabled={items.length === 0 || isSending}
                style={{
                  ...styles.primaryButton,
                  opacity: items.length === 0 || isSending ? 0.6 : 1,
                  cursor:
                    items.length === 0 || isSending ? "not-allowed" : "pointer",
                }}
              >
                {isSending ? cartText.sending[lang] : cartText.sendAll[lang]}
              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={items.length === 0 || isSending}
                style={{
                  ...styles.secondaryButton,
                  opacity: items.length === 0 || isSending ? 0.6 : 1,
                  cursor:
                    items.length === 0 || isSending ? "not-allowed" : "pointer",
                }}
              >
                {cartText.clear[lang]}
              </button>
            </div>
          </section>

          <section style={styles.panel}>
            <h2
              style={{
                ...styles.panelTitle,
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {cartText.customerInfo[lang]}
            </h2>

            <p
              style={{
                ...styles.panelDescription,
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {cartText.customerSectionDescription[lang]}
            </p>

            <div style={styles.customerGrid}>
              <input
                type="text"
                placeholder={cartText.fullName[lang]}
                value={customerData.fullName}
                onChange={(e) => handleCustomerChange("fullName", e.target.value)}
                style={{
                  ...styles.input,
                  gridColumn: "1 / -1",
                }}
              />

              <input
                type="email"
                placeholder="name@example.com"
                value={customerData.email}
                onChange={(e) => handleCustomerChange("email", e.target.value)}
                style={styles.input}
              />

              <input
                type="tel"
                placeholder={cartText.phone[lang]}
                value={customerData.phone}
                onChange={(e) => handleCustomerChange("phone", e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                placeholder={cartText.street[lang]}
                value={customerData.street}
                onChange={(e) => handleCustomerChange("street", e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                placeholder={cartText.houseNumber[lang]}
                value={customerData.houseNumber}
                onChange={(e) => handleCustomerChange("houseNumber", e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                placeholder={cartText.postalCode[lang]}
                value={customerData.postalCode}
                onChange={(e) => handleCustomerChange("postalCode", e.target.value)}
                style={styles.input}
              />

              <input
                type="text"
                placeholder={cartText.city[lang]}
                value={customerData.city}
                onChange={(e) => handleCustomerChange("city", e.target.value)}
                style={styles.input}
              />

              <textarea
                placeholder={`${cartText.generalNotes[lang]} — Optional`}
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                style={{
                  ...styles.textarea,
                  gridColumn: "1 / -1",
                }}
              />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}