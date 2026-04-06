"use client";

import {
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Camera,
  Music2,
  Clock3,
  User,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { contactInfo, pageText } from "@/components/home/home.data";

type Props = {
  language: "ar" | "de" | "en";
};

export default function HomeFooter({ language }: Props) {
  return (
    <footer
      id="contact"
      style={{
        background: "#f1ebe2",
        borderTop: "1px solid #e2d7c8",
        marginTop: "44px",
      }}
    >
      <div
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          padding: "52px 20px 24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "22px",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.42)",
              border: "1px solid #e2d7c8",
              borderRadius: "26px",
              padding: "26px",
              boxShadow: "0 10px 30px rgba(70, 49, 29, 0.04)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px",
                fontSize: "24px",
                lineHeight: 1.2,
                color: "#2f2419",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {pageText.footerTitle[language]}
            </h3>

            <p
              style={{
                margin: "0 0 22px",
                fontSize: "14px",
                lineHeight: 1.9,
                color: "#665443",
                maxWidth: "420px",
              }}
            >
              {pageText.footerDescription[language]}
            </p>

            <a
              href={contactInfo.mapsHref}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                padding: "16px 16px",
                borderRadius: "18px",
                background: "#fbf8f4",
                border: "1px solid #e6dbcd",
                marginBottom: "20px",
              }}
            >
              <MapPin size={18} style={{ marginTop: "3px", flexShrink: 0 }} />
              <div>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    lineHeight: 1.6,
                    color: "#2f2419",
                    marginBottom: "4px",
                  }}
                >
                  {contactInfo.address}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#7a6856",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>{pageText.mapsAction[language]}</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </a>

            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  color: "#5d4a39",
                  fontSize: "14px",
                  lineHeight: 1.75,
                }}
              >
                <User size={16} style={{ marginTop: "3px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>
                    {pageText.responsibleLabel[language]}
                  </div>
                  <div>{contactInfo.responsibleName}</div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  color: "#5d4a39",
                  fontSize: "14px",
                  lineHeight: 1.75,
                }}
              >
                <Clock3 size={16} style={{ marginTop: "3px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "2px" }}>
                    {pageText.hoursLabel[language]}
                  </div>
                  <div>{pageText.aroundClock[language]}</div>
                  <div>{pageText.directHours[language]}</div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.42)",
              border: "1px solid #e2d7c8",
              borderRadius: "26px",
              padding: "26px",
              boxShadow: "0 10px 30px rgba(70, 49, 29, 0.04)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4
              style={{
                margin: "0 0 20px",
                fontSize: "16px",
                color: "#2f2419",
                fontWeight: 700,
              }}
            >
              {pageText.contactTitle[language]}
            </h4>

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              <a
                href={`tel:${contactInfo.phone.replace(/\s+/g, "")}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#2f2419",
                  fontSize: "15px",
                  textDecoration: "none",
                  padding: "14px 14px",
                  borderRadius: "16px",
                  background: "#fbf8f4",
                  border: "1px solid #e6dbcd",
                  fontWeight: 600,
                }}
              >
                <Phone size={17} />
                <span>{contactInfo.phone}</span>
              </a>

              <a
                href={contactInfo.whatsappHref}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "#2f2419",
                  fontSize: "15px",
                  textDecoration: "none",
                  padding: "14px 14px",
                  borderRadius: "16px",
                  background: "#fbf8f4",
                  border: "1px solid #e6dbcd",
                  fontWeight: 600,
                }}
              >
                <MessageCircle size={17} />
                <span>{contactInfo.whatsappNumber}</span>
              </a>

              <a
                href={`mailto:${contactInfo.inquiryEmail}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  color: "#5d4a39",
                  fontSize: "14px",
                  textDecoration: "none",
                  padding: "14px 14px",
                  borderRadius: "16px",
                  background: "#fbf8f4",
                  border: "1px solid #e6dbcd",
                }}
              >
                <Mail size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "12px", marginBottom: "3px" }}>
                    {pageText.inquiryLabel[language]}
                  </div>
                  <div>{contactInfo.inquiryEmail}</div>
                </div>
              </a>

              <a
                href={`mailto:${contactInfo.servicesEmail}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  color: "#5d4a39",
                  fontSize: "14px",
                  textDecoration: "none",
                  padding: "14px 14px",
                  borderRadius: "16px",
                  background: "#fbf8f4",
                  border: "1px solid #e6dbcd",
                }}
              >
                <Mail size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "12px", marginBottom: "3px" }}>
                    {pageText.servicesLabel[language]}
                  </div>
                  <div>{contactInfo.servicesEmail}</div>
                </div>
              </a>

              <a
                href={`mailto:${contactInfo.supportEmail}`}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  color: "#5d4a39",
                  fontSize: "14px",
                  textDecoration: "none",
                  padding: "14px 14px",
                  borderRadius: "16px",
                  background: "#fbf8f4",
                  border: "1px solid #e6dbcd",
                }}
              >
                <Mail size={17} style={{ marginTop: "2px", flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: "12px", marginBottom: "3px" }}>
                    {pageText.supportLabel[language]}
                  </div>
                  <div>{contactInfo.supportEmail}</div>
                </div>
              </a>
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.42)",
              border: "1px solid #e2d7c8",
              borderRadius: "26px",
              padding: "26px",
              boxShadow: "0 10px 30px rgba(70, 49, 29, 0.04)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h4
              style={{
                margin: "0 0 18px",
                fontSize: "16px",
                color: "#2f2419",
                fontWeight: 700,
              }}
            >
              {pageText.socialTitle[language]}
            </h4>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "22px",
              }}
            >
              {[
                {
                  href: contactInfo.whatsappHref,
                  label: "WhatsApp",
                  icon: MessageCircle,
                },
                {
                  href: contactInfo.facebookHref,
                  label: "Facebook",
                  icon: Globe,
                },
                {
                  href: contactInfo.instagramHref,
                  label: "Instagram",
                  icon: Camera,
                },
                {
                  href: contactInfo.tiktokHref,
                  label: "TikTok",
                  icon: Music2,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "16px",
                      border: "1px solid #dfd2c1",
                      background: "#fbf8f4",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#3b2f24",
                      textDecoration: "none",
                      transition:
                        "transform 0.18s ease, border-color 0.18s ease, background 0.18s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.borderColor = "#cdb89e";
                      e.currentTarget.style.background = "#f3ece3";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "#dfd2c1";
                      e.currentTarget.style.background = "#fbf8f4";
                    }}
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>

            <a
              href={contactInfo.reviewsHref}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
                color: "inherit",
                display: "block",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  padding: "18px 18px",
                  borderRadius: "18px",
                  background: "#fbf8f4",
                  border: "1px solid #e6dbcd",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#2f2419",
                    marginBottom: "10px",
                  }}
                >
                  <Star size={17} />
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                    }}
                  >
                    {pageText.reviewsTitle[language]}
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    lineHeight: 1.8,
                    color: "#6b5847",
                    marginBottom: "10px",
                  }}
                >
                  {pageText.reviewsText[language]}
                </div>

                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#3f3125",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  <span>{pageText.reviewsAction[language]}</span>
                  <ArrowUpRight size={14} />
                </div>
              </div>
            </a>

            <a
              href={contactInfo.websiteHref}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#5d4a39",
                fontSize: "14px",
                textDecoration: "none",
                padding: "16px 16px",
                borderRadius: "18px",
                background: "#fbf8f4",
                border: "1px solid #e6dbcd",
              }}
            >
              <Globe size={17} />
              <span>{contactInfo.website}</span>
            </a>
          </div>
        </div>

        <div
          style={{
            marginTop: "28px",
            paddingTop: "18px",
            borderTop: "1px solid #e2d7c8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            color: "#7a6856",
            fontSize: "13px",
          }}
        >
          <span>
            © 2026 {pageText.footerTitle[language]} — {pageText.rights[language]}
          </span>
          <span>{contactInfo.responsibleName}</span>
        </div>
      </div>
    </footer>
  );
}