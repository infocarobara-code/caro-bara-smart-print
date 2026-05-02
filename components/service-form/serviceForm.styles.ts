import type { CSSProperties } from "react";

type CreateStylesArgs = {
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
}: CreateStylesArgs) {
  const scoreColor =
    score >= 80 ? "#16794a" : score >= 50 ? "#9a6a18" : "#b42318";

  const styles = {
    shell: {
      display: isDesktop ? "grid" : "block",
      gridTemplateColumns: isDesktop
        ? isArabic
          ? "340px minmax(0, 1fr)"
          : "minmax(0, 1fr) 340px"
        : undefined,
      gap: isMobile ? "14px" : "18px",
      alignItems: "start",
      paddingBottom: 0,
    } satisfies CSSProperties,

    form: {
      marginTop: 0,
      padding: isMobile ? "14px" : "20px",
      border: "1px solid rgba(24,119,242,0.12)",
      borderRadius: isMobile ? "22px" : "28px",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,251,255,0.96) 100%)",
      boxShadow: "0 18px 42px rgba(24,119,242,0.08)",
      backdropFilter: "blur(6px)",
      minWidth: 0,
    } satisfies CSSProperties,

    introBox: {
      marginBottom: "14px",
      padding: isMobile ? "14px" : "16px",
      borderRadius: "20px",
      border: "1px solid rgba(24,119,242,0.12)",
      background:
        "linear-gradient(135deg, rgba(231,243,255,0.85), rgba(255,255,255,0.98))",
      boxShadow: "0 10px 24px rgba(24,119,242,0.06)",
    } satisfies CSSProperties,

    introTitle: {
      margin: 0,
      fontSize: isMobile ? "14px" : "15px",
      fontWeight: 900,
      color: "#111827",
    } satisfies CSSProperties,

    introText: {
      margin: "8px 0 0",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.85,
      color: "#4b5563",
    } satisfies CSSProperties,

    guidanceWrap: {
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid rgba(24,119,242,0.10)",
    } satisfies CSSProperties,

    guidanceTitle: {
      margin: 0,
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 900,
      color: "#111827",
    } satisfies CSSProperties,

    guidanceList: {
      margin: "8px 0 0",
      paddingInlineStart: "18px",
      color: "#4b5563",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.85,
    } satisfies CSSProperties,

    statusBox: {
      marginBottom: "14px",
      padding: "12px 14px",
      borderRadius: "16px",
      fontSize: "13px",
      lineHeight: 1.7,
      fontWeight: 700,
    } satisfies CSSProperties,

    analysisColumn: {
      position: isDesktop ? "sticky" : "static",
      top: isDesktop ? "92px" : undefined,
      alignSelf: "start",
    } satisfies CSSProperties,

    analysisBox: {
      marginBottom: isDesktop ? 0 : "14px",
      padding: isMobile ? "14px" : "16px",
      borderRadius: "22px",
      border: "1px solid rgba(24,119,242,0.12)",
      background: "#ffffff",
      boxShadow: "0 12px 28px rgba(24,119,242,0.07)",
    } satisfies CSSProperties,

    analysisTitle: {
      margin: "0 0 6px",
      fontSize: isMobile ? "15px" : "16px",
      fontWeight: 900,
      color: "#111827",
    } satisfies CSSProperties,

    analysisHelper: {
      margin: "0 0 12px",
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.75,
      color: "#6b7280",
    } satisfies CSSProperties,

    analysisSection: {
      paddingTop: "12px",
      marginTop: "12px",
      borderTop: "1px solid #eef2f7",
    } satisfies CSSProperties,

    analysisRowTitle: {
      margin: "0 0 6px",
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 900,
      color: "#111827",
    } satisfies CSSProperties,

    analysisText: {
      margin: 0,
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.8,
      color: "#4b5563",
      wordBreak: "break-word",
    } satisfies CSSProperties,

    analysisList: {
      margin: 0,
      paddingInlineStart: "18px",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.8,
    } satisfies CSSProperties,

    scoreWrap: {
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid #eef2f7",
    } satisfies CSSProperties,

    scoreValue: {
      fontSize: isMobile ? "20px" : "24px",
      fontWeight: 900,
      color: scoreColor,
      lineHeight: 1.1,
      margin: "4px 0 8px",
    } satisfies CSSProperties,

    scoreBarTrack: {
      width: "100%",
      height: "10px",
      borderRadius: "999px",
      background: "#e5e7eb",
      overflow: "hidden",
      marginTop: "4px",
    } satisfies CSSProperties,

    scoreBarFill: {
      height: "100%",
      borderRadius: "999px",
      background:
        score >= 80
          ? "linear-gradient(90deg, #22c55e 0%, #16794a 100%)"
          : score >= 50
            ? "linear-gradient(90deg, #f59e0b 0%, #9a6a18 100%)"
            : "linear-gradient(90deg, #ef4444 0%, #b42318 100%)",
      transition: "width 0.2s ease",
    } satisfies CSSProperties,

    section: {
      marginTop: "16px",
      padding: isMobile ? "14px" : "18px",
      borderRadius: isMobile ? "20px" : "24px",
      border: "1px solid rgba(24,119,242,0.12)",
      background: "#ffffff",
      boxShadow: "0 10px 28px rgba(17,24,39,0.045)",
    } satisfies CSSProperties,

    sectionHeader: {
      marginBottom: "16px",
    } satisfies CSSProperties,

    sectionTitle: {
      margin: 0,
      fontSize: isMobile ? "14px" : "16px",
      lineHeight: 1.35,
      fontWeight: 900,
      color: "#111827",
    } satisfies CSSProperties,

    sectionDescription: {
      margin: "7px 0 0",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.75,
      color: "#6b7280",
    } satisfies CSSProperties,

    fieldsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile
        ? "1fr"
        : "repeat(auto-fit, minmax(260px, 1fr))",
      gap: isMobile ? "12px" : "14px",
      alignItems: "start",
    } satisfies CSSProperties,

    fieldWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: "7px",
      minWidth: 0,
    } satisfies CSSProperties,

    label: {
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.45,
      fontWeight: 800,
      color: "#1f2937",
    } satisfies CSSProperties,

    input: {
      width: "100%",
      minHeight: isMobile ? "46px" : "50px",
      padding: isMobile ? "11px 13px" : "12px 14px",
      border: "1px solid #d7dee8",
      borderRadius: "16px",
      fontSize: isMobile ? "14px" : "15px",
      color: "#111827",
      background: "#ffffff",
      outline: "none",
      boxSizing: "border-box",
      boxShadow: "0 1px 0 rgba(17,24,39,0.02)",
    } satisfies CSSProperties,

    textarea: {
      width: "100%",
      minHeight: isMobile ? "110px" : "120px",
      padding: isMobile ? "12px 13px" : "14px",
      border: "1px solid #d7dee8",
      borderRadius: "18px",
      fontSize: isMobile ? "14px" : "15px",
      color: "#111827",
      background: "#ffffff",
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      lineHeight: 1.75,
      boxShadow: "0 1px 0 rgba(17,24,39,0.02)",
    } satisfies CSSProperties,

    optionList: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
      gap: "10px",
    } satisfies CSSProperties,

    optionCard: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: isMobile ? "11px 12px" : "12px 14px",
      borderRadius: "16px",
      background: "#ffffff",
      cursor: "pointer",
      lineHeight: 1.6,
      color: "#1f2937",
      fontSize: isMobile ? "13px" : "14px",
      transition: "all 0.18s ease",
      minWidth: 0,
      border: "1px solid #d7dee8",
      minHeight: "48px",
      boxShadow: "0 1px 0 rgba(17,24,39,0.02)",
    } satisfies CSSProperties,

    optionTextWrap: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      minWidth: 0,
      flex: 1,
    } satisfies CSSProperties,

    optionSelectedHint: {
      fontSize: "11px",
      lineHeight: 1.4,
      color: "#1877f2",
      fontWeight: 800,
    } satisfies CSSProperties,

    fileInputWrap: {
      padding: "12px",
      borderRadius: "18px",
      border: "1px dashed #b8c7db",
      background: "rgba(231,243,255,0.45)",
    } satisfies CSSProperties,

    fileHint: {
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.6,
      color: "#6b7280",
      marginBottom: "8px",
    } satisfies CSSProperties,

    attachmentDescription: {
      margin: "0 0 8px",
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.65,
      color: "#6b7280",
    } satisfies CSSProperties,

    submitRow: {
      marginTop: "18px",
      display: "flex",
      justifyContent: isMobile ? "stretch" : isArabic ? "flex-start" : "flex-end",
    } satisfies CSSProperties,

    submitButton: {
      width: "100%",
      maxWidth: isMobile ? "100%" : "280px",
      minHeight: isMobile ? "50px" : "52px",
      padding: isMobile ? "12px 18px" : "13px 20px",
      borderRadius: "18px",
      border: "1px solid #111827",
      background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
      color: "#ffffff",
      cursor: "pointer",
      fontSize: isMobile ? "14px" : "15px",
      fontWeight: 900,
      boxShadow: "0 14px 28px rgba(17,24,39,0.18)",
    } satisfies CSSProperties,

    mobileAnalysisToggle: {
      width: "100%",
      minHeight: "46px",
      padding: "11px 13px",
      borderRadius: "18px",
      border: "1px solid rgba(24,119,242,0.14)",
      background: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      cursor: "pointer",
      color: "#111827",
      fontSize: "12px",
      fontWeight: 900,
      boxShadow: "0 8px 20px rgba(24,119,242,0.06)",
    } satisfies CSSProperties,

    mobileAnalysisToggleLeft: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      minWidth: 0,
      flex: 1,
    } satisfies CSSProperties,

    mobileAnalysisDot: {
      width: "8px",
      height: "8px",
      borderRadius: "999px",
      background: scoreColor,
      flexShrink: 0,
    } satisfies CSSProperties,

    mobileAnalysisToggleText: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    } satisfies CSSProperties,

    mobileAnalysisScore: {
      color: scoreColor,
      fontSize: "13px",
      fontWeight: 900,
      flexShrink: 0,
    } satisfies CSSProperties,

    helperInputWrap: {
      marginTop: "10px",
    } satisfies CSSProperties,
  };

  return styles;
}