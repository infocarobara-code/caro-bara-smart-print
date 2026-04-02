"use client";

import { useEffect, useMemo, useState } from "react";
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
    ar: "هنا تتم مراجعة جميع الطلبات المضافة، ثم إدخال بيانات العميل مرة واحدة فقط قبل الإرسال النهائي.",
    de: "Hier werden alle hinzugefügten Anfragen geprüft, danach werden die Kundendaten einmalig vor dem finalen Versand eingegeben.",
    en: "Here all added requests are reviewed, then the customer details are entered once before final submission.",
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
    ar: "إرسال الطلبات",
    de: "Anfragen senden",
    en: "Send Requests",
  },
  sending: {
    ar: "جارٍ الإرسال...",
    de: "Wird gesendet...",
    en: "Sending...",
  },
  service: {
    ar: "الخدمة",
    de: "Service",
    en: "Service",
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
    ar: "أدخل بيانات العميل مرة واحدة فقط ليتم إرفاقها مع جميع الطلبات. البريد الإلكتروني إلزامي لإرسال رسالة التأكيد.",
    de: "Gib die Kundendaten nur einmal ein, damit sie allen Anfragen beigefügt werden. Die E-Mail ist erforderlich, damit eine Bestätigung gesendet werden kann.",
    en: "Enter the customer details only once so they are included with all requests. Email is required so a confirmation can be sent.",
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
    ar: "تم إرسال الطلب بنجاح، وتم تفريغ السلة تلقائيًا.",
    de: "Die Anfrage wurde erfolgreich gesendet und der Warenkorb wurde automatisch geleert.",
    en: "The request was sent successfully and the cart was cleared automatically.",
  },
  sendFailed: {
    ar: "فشل إرسال الطلب. تحقق من إعدادات البريد ثم حاول مرة أخرى.",
    de: "Das Senden der Anfrage ist fehlgeschlagen. Prüfe die E-Mail-Einstellungen und versuche es erneut.",
    en: "Failed to send the request. Check the email configuration and try again.",
  },
};

export default function CartPage() {
  const { language, dir } = useLanguage();
  const lang = language as Language;

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

    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorage);
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

  const getField = (item: CartItem, fieldId: string) => {
    const service = servicesMap.get(item.serviceId);
    return service?.fields.find((field) => field.id === fieldId);
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
    const option = field?.options?.find((opt) => opt.value === optionValue);

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
  };

  const handleCustomerChange = (key: keyof CustomerData, value: string) => {
    setCustomerData((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (errorMessage) {
      setErrorMessage("");
    }

    if (successMessage) {
      setSuccessMessage("");
    }
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

      const response = await fetch("/api/submit-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerData,
          generalNotes,
          items: items.map((item) => ({
            id: item.id,
            serviceId: item.serviceId,
            data: item.data,
          })),
          lang,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || result?.message || cartText.sendFailed[lang]);
      }

      clearCart();
      refreshCart();

      setCustomerData({
        fullName: "",
        email: "",
        phone: "",
        street: "",
        houseNumber: "",
        postalCode: "",
        city: "",
      });
      setGeneralNotes("");
      setErrorMessage("");
      setSuccessMessage(cartText.sentSuccess[lang]);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : cartText.sendFailed[lang]
      );
      setSuccessMessage("");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      dir={dir}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f7f1e8 0%, #f3eadf 100%)",
        padding: "0 16px 80px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Header showBackHome />

      <div
        style={{
          maxWidth: "1180px",
          margin: "22px auto 0",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #fffaf4 0%, #f8efe3 100%)",
            border: "1px solid #e3d3bf",
            borderRadius: "28px",
            padding: "28px 20px",
            boxShadow: "0 14px 40px rgba(96, 73, 46, 0.10)",
            marginBottom: "28px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              marginBottom: "14px",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "#efe1cf",
              color: "#6d5338",
              fontSize: "13px",
              fontWeight: 700,
              border: "1px solid #ddc8af",
            }}
          >
            {cartText.badge[lang]}
          </div>

          <h1
            style={{
              margin: "0 0 12px",
              fontSize: "clamp(28px, 4vw, 42px)",
              lineHeight: 1.25,
              color: "#2f2419",
            }}
          >
            {cartText.title[lang]}
          </h1>

          <p
            style={{
              margin: "0 auto",
              maxWidth: "820px",
              color: "#5b4b3c",
              lineHeight: 1.9,
              fontSize: "15px",
            }}
          >
            {cartText.subtitle[lang]}
          </p>
        </div>

        {(errorMessage || successMessage) && (
          <div
            style={{
              marginBottom: "18px",
              padding: "14px 16px",
              borderRadius: "16px",
              border: errorMessage ? "1px solid #efc4bf" : "1px solid #b9dcc1",
              background: errorMessage ? "#fff2f1" : "#edf8f0",
              color: errorMessage ? "#8b2f25" : "#245a30",
              fontSize: "14px",
              lineHeight: 1.8,
              fontWeight: 700,
            }}
          >
            {errorMessage || successMessage}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.08fr 0.92fr",
            gap: "24px",
          }}
        >
          <section
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1px solid #e7d9c8",
              borderRadius: "24px",
              padding: "22px 18px",
              boxShadow: "0 8px 28px rgba(90, 70, 40, 0.07)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                margin: "0 0 8px",
                color: "#35281d",
              }}
            >
              {cartText.customerInfo[lang]}
            </h2>

            <p
              style={{
                margin: "0 0 18px",
                color: "#6d5b49",
                lineHeight: 1.8,
                fontSize: "14px",
              }}
            >
              {cartText.customerSectionDescription[lang]}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "14px",
              }}
            >
              <input
                type="text"
                placeholder={cartText.fullName[lang]}
                value={customerData.fullName}
                onChange={(e) => handleCustomerChange("fullName", e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "48px",
                  padding: "12px 14px",
                  border: "1px solid #dbc9b5",
                  borderRadius: "14px",
                  fontSize: "14px",
                  color: "#2f2419",
                  background: "#fffdfa",
                  outline: "none",
                  boxSizing: "border-box",
                  gridColumn: "1 / -1",
                }}
              />

              <input
                type="email"
                placeholder="name@example.com"
                value={customerData.email}
                onChange={(e) => handleCustomerChange("email", e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "48px",
                  padding: "12px 14px",
                  border: "1px solid #dbc9b5",
                  borderRadius: "14px",
                  fontSize: "14px",
                  color: "#2f2419",
                  background: "#fffdfa",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              <input
                type="tel"
                placeholder={cartText.phone[lang]}
                value={customerData.phone}
                onChange={(e) => handleCustomerChange("phone", e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "48px",
                  padding: "12px 14px",
                  border: "1px solid #dbc9b5",
                  borderRadius: "14px",
                  fontSize: "14px",
                  color: "#2f2419",
                  background: "#fffdfa",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              <input
                type="text"
                placeholder={cartText.street[lang]}
                value={customerData.street}
                onChange={(e) => handleCustomerChange("street", e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "48px",
                  padding: "12px 14px",
                  border: "1px solid #dbc9b5",
                  borderRadius: "14px",
                  fontSize: "14px",
                  color: "#2f2419",
                  background: "#fffdfa",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              <input
                type="text"
                placeholder={cartText.houseNumber[lang]}
                value={customerData.houseNumber}
                onChange={(e) => handleCustomerChange("houseNumber", e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "48px",
                  padding: "12px 14px",
                  border: "1px solid #dbc9b5",
                  borderRadius: "14px",
                  fontSize: "14px",
                  color: "#2f2419",
                  background: "#fffdfa",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              <input
                type="text"
                placeholder={cartText.postalCode[lang]}
                value={customerData.postalCode}
                onChange={(e) => handleCustomerChange("postalCode", e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "48px",
                  padding: "12px 14px",
                  border: "1px solid #dbc9b5",
                  borderRadius: "14px",
                  fontSize: "14px",
                  color: "#2f2419",
                  background: "#fffdfa",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              <input
                type="text"
                placeholder={cartText.city[lang]}
                value={customerData.city}
                onChange={(e) => handleCustomerChange("city", e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "48px",
                  padding: "12px 14px",
                  border: "1px solid #dbc9b5",
                  borderRadius: "14px",
                  fontSize: "14px",
                  color: "#2f2419",
                  background: "#fffdfa",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />

              <textarea
                placeholder={`${cartText.generalNotes[lang]} — Optional`}
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "110px",
                  padding: "14px",
                  border: "1px solid #dbc9b5",
                  borderRadius: "16px",
                  fontSize: "14px",
                  color: "#2f2419",
                  background: "#fffdfa",
                  outline: "none",
                  resize: "vertical",
                  boxSizing: "border-box",
                  lineHeight: 1.8,
                  gridColumn: "1 / -1",
                }}
              />
            </div>
          </section>

          <section
            style={{
              background: "rgba(255,255,255,0.88)",
              border: "1px solid #e7d9c8",
              borderRadius: "24px",
              padding: "22px 18px",
              boxShadow: "0 8px 28px rgba(90, 70, 40, 0.07)",
            }}
          >
            <h2
              style={{
                fontSize: "24px",
                margin: "0 0 8px",
                color: "#35281d",
              }}
            >
              {cartText.cartTitle[lang]}
            </h2>

            <p
              style={{
                margin: "0 0 8px",
                color: "#6d5b49",
                lineHeight: 1.8,
                fontSize: "14px",
              }}
            >
              {cartText.requestsSectionDescription[lang]}
            </p>

            <div
              style={{
                fontSize: "13px",
                color: "#7b6654",
                marginBottom: "16px",
              }}
            >
              {cartText.count[lang]}: {items.length}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {items.length === 0 && (
                <div
                  style={{
                    border: "1px dashed #d9c4ab",
                    borderRadius: "14px",
                    padding: "14px",
                    color: "#6f5b48",
                    background: "#fffaf4",
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
                    style={{
                      border: "1px solid #e8dacc",
                      borderRadius: "16px",
                      padding: "14px",
                      background: "#fffdf9",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "10px",
                        alignItems: "flex-start",
                        marginBottom: "10px",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          lineHeight: 1.6,
                          color: "#2f2419",
                          fontSize: "15px",
                        }}
                      >
                        {getServiceTitle(item)}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#b63a31",
                          cursor: "pointer",
                          fontSize: "13px",
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {cartText.remove[lang]}
                      </button>
                    </div>

                    {previewEntries.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        }}
                      >
                        {previewEntries.map(([fieldId, rawValue]) => (
                          <div
                            key={fieldId}
                            style={{
                              fontSize: "13px",
                              color: "#4f4032",
                              lineHeight: 1.6,
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

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "16px",
              }}
            >
              <button
                type="button"
                onClick={handleSend}
                disabled={items.length === 0 || isSending}
                style={{
                  flex: 1,
                  padding: "13px",
                  background: "#1f1711",
                  color: "white",
                  border: "1px solid #241a12",
                  borderRadius: "14px",
                  cursor:
                    items.length === 0 || isSending ? "not-allowed" : "pointer",
                  fontWeight: 800,
                  fontSize: "14px",
                  opacity: items.length === 0 || isSending ? 0.6 : 1,
                }}
              >
                {isSending ? cartText.sending[lang] : cartText.sendAll[lang]}
              </button>
            </div>

            <button
              type="button"
              onClick={handleClear}
              disabled={items.length === 0 || isSending}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "13px",
                background: "#f2e7da",
                color: "#2f2419",
                border: "1px solid #e0cfbd",
                borderRadius: "14px",
                cursor:
                  items.length === 0 || isSending ? "not-allowed" : "pointer",
                fontWeight: 800,
                fontSize: "14px",
                opacity: items.length === 0 || isSending ? 0.6 : 1,
              }}
            >
              {cartText.clear[lang]}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}