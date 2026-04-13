import type { CSSProperties } from "react";

type Params = {
  isArabic: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  score: number;
};

export function createServiceFormStyles({
  isArabic,
  isDesktop,
  isMobile,
  score,
}: Params) {
  const baseFont = "Arial, sans-serif";

  const inputBase: CSSProperties = {
    width: "100%",
    minHeight: "46px",
    borderRadius: "14px",
    border: "1px solid #d1d7db",
    padding: isMobile ? "11px 12px" : "12px 14px",
    fontSize: "14px",
    outline: "none",
    background: "#ffffff",
    color: "#111b21",
    boxSizing: "border-box",
    boxShadow: "inset 0 1px 2px rgba(17, 27, 33, 0.03)",
  };

  const sectionSurface = "#f0f2f5";
  const sectionBorder = "#d1d7db";
  const textPrimary = "#111b21";
  const textSecondary = "#667781";
  const accent = "#00a884";
  const accentSoft = "#d9fdd3";

  return {
    form: {
      display: "grid",
      gap: isMobile ? "14px" : "18px",
      fontFamily: baseFont,
      width: "100%",
    },

    section: {
      border: `1px solid ${sectionBorder}`,
      borderRadius: isMobile ? "18px" : "22px",
      padding: isMobile ? "14px" : "18px",
      background: sectionSurface,
      display: "grid",
      gap: "14px",
      boxShadow: "0 2px 10px rgba(17, 27, 33, 0.04)",
      boxSizing: "border-box",
      minWidth: 0,
    },

    sectionHeader: {
      display: "grid",
      gap: "6px",
      minWidth: 0,
    },

    sectionTitle: {
      margin: 0,
      fontSize: isMobile ? "15px" : "16px",
      fontWeight: 800,
      color: textPrimary,
      textAlign: isArabic ? "right" : "left",
      lineHeight: 1.35,
      wordBreak: "break-word",
    },

    sectionDescription: {
      margin: 0,
      fontSize: "13px",
      color: textSecondary,
      textAlign: isArabic ? "right" : "left",
      lineHeight: 1.75,
      wordBreak: "break-word",
      overflowWrap: "anywhere",
    },

    fieldsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
      gap: "12px",
      minWidth: 0,
    },

    fieldWrapper: {
      display: "grid",
      gap: "6px",
      minWidth: 0,
    },

    label: {
      fontSize: "13px",
      fontWeight: 700,
      color: textPrimary,
      textAlign: isArabic ? "right" : "left",
      lineHeight: 1.45,
      wordBreak: "break-word",
    },

    input: inputBase,

    textarea: {
      ...inputBase,
      minHeight: isMobile ? "110px" : "120px",
      resize: "vertical" as const,
      paddingTop: "12px",
      paddingBottom: "12px",
    },

    optionList: {
      display: "grid",
      gap: "8px",
      minWidth: 0,
    },

    optionCard: {
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      padding: isMobile ? "11px 12px" : "12px 13px",
      borderRadius: "14px",
      cursor: "pointer",
      boxSizing: "border-box",
      minWidth: 0,
      transition:
        "border-color 0.18s ease, background 0.18s ease, box-shadow 0.18s ease, transform 0.18s ease",
    },

    optionTextWrap: {
      display: "grid",
      gap: "2px",
      fontSize: "13px",
      color: textPrimary,
      lineHeight: 1.65,
      minWidth: 0,
      wordBreak: "break-word",
      overflowWrap: "anywhere",
    },

    optionSelectedHint: {
      fontSize: "11px",
      color: accent,
      fontWeight: 700,
    },

    submitRow: {
      display: "flex",
      justifyContent: isArabic ? "flex-start" : "flex-end",
      alignItems: "center",
    },

    submitButton: {
      background: "#25d366",
      color: "#ffffff",
      border: "1px solid #25d366",
      borderRadius: "999px",
      padding: isMobile ? "12px 18px" : "13px 22px",
      fontSize: "14px",
      fontWeight: 800,
      cursor: "pointer",
      boxShadow: "0 8px 18px rgba(37, 211, 102, 0.20)",
      transition:
        "transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease",
    },

    statusBox: {
      padding: "11px 13px",
      borderRadius: "14px",
      fontSize: "13px",
      lineHeight: 1.7,
      boxSizing: "border-box",
      wordBreak: "break-word",
      overflowWrap: "anywhere",
    },

    analysisBox: {
      border: `1px solid ${sectionBorder}`,
      borderRadius: "18px",
      padding: isMobile ? "14px" : "16px",
      background: "#ffffff",
      display: "grid",
      gap: "10px",
      boxSizing: "border-box",
      minWidth: 0,
      boxShadow: "0 1px 3px rgba(17, 27, 33, 0.03)",
    },

    analysisTitle: {
      margin: 0,
      fontSize: "15px",
      fontWeight: 800,
      color: textPrimary,
      lineHeight: 1.4,
    },

    analysisHelper: {
      margin: 0,
      fontSize: "12px",
      color: textSecondary,
      lineHeight: 1.75,
    },

    analysisRowTitle: {
      margin: 0,
      fontSize: "13px",
      fontWeight: 700,
      color: textPrimary,
      lineHeight: 1.45,
    },

    analysisText: {
      margin: 0,
      fontSize: "12px",
      color: textSecondary,
      lineHeight: 1.75,
      wordBreak: "break-word",
      overflowWrap: "anywhere",
    },

    analysisSection: {
      display: "grid",
      gap: "6px",
      minWidth: 0,
    },

    analysisList: {
      margin: 0,
      paddingInlineStart: "18px",
      fontSize: "12px",
      lineHeight: 1.75,
    },

    scoreWrap: {
      display: "grid",
      gap: "6px",
    },

    scoreValue: {
      fontSize: "18px",
      fontWeight: 800,
      color: score >= 70 ? accent : score >= 40 ? "#f59e0b" : "#ef4444",
    },

    scoreBarTrack: {
      height: "7px",
      borderRadius: "999px",
      background: "#e9edef",
      overflow: "hidden",
    },

    scoreBarFill: {
      height: "100%",
      background: score >= 70 ? accent : score >= 40 ? "#f59e0b" : "#ef4444",
      borderRadius: "999px",
    },

    helperInputWrap: {
      display: "grid",
      gap: "6px",
      marginTop: "6px",
      minWidth: 0,
    },

    guidanceWrap: {
      display: "grid",
      gap: "6px",
      minWidth: 0,
    },

    guidanceList: {
      margin: 0,
      paddingInlineStart: "18px",
      fontSize: "12px",
      color: textSecondary,
      lineHeight: 1.75,
    },
  };
}