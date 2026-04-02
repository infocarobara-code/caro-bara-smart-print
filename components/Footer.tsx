"use client";

import { useLanguage } from "@/lib/languageContext";
import {
  Phone,
  Mail,
  Camera,
  Facebook,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  const { language, dir } = useLanguage();

  const text = {
    contact: {
      ar: "تواصل معنا",
      de: "Kontakt",
      en: "Contact",
    },
    rights: {
      ar: "جميع الحقوق محفوظة © Caro Bara",
      de: "Alle Rechte vorbehalten © Caro Bara",
      en: "All rights reserved © Caro Bara",
    },
  };

  return (
    <footer
      dir={dir}
      style={{
        background: "#111111",
        color: "#ffffff",
        padding: "60px 20px 30px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        {/* Title */}
        <h3
          style={{
            fontSize: "22px",
            marginBottom: "20px",
            fontWeight: 600,
          }}
        >
          {text.contact[language]}
        </h3>

        {/* Contact Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "28px",
            fontSize: "14px",
            color: "#cfcfcf",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Phone size={16} /> +49 000 000000
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Mail size={16} /> info@carobara.de
          </div>
        </div>

        {/* Social Icons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "30px",
          }}
        >
          <a href="#" target="_blank" style={iconStyle}>
            <MessageCircle size={20} />
          </a>

          <a href="#" target="_blank" style={iconStyle}>
            <Camera size={20} />
          </a>

          <a href="#" target="_blank" style={iconStyle}>
            <Facebook size={20} />
          </a>
        </div>

        {/* Copyright */}
        <div
          style={{
            fontSize: "13px",
            color: "#888",
            borderTop: "1px solid #222",
            paddingTop: "18px",
          }}
        >
          {text.rights[language]}
        </div>
      </div>
    </footer>
  );
}

const iconStyle = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  background: "#1f1f1f",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ffffff",
  textDecoration: "none",
  transition: "0.2s",
};