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
    score >= 80 ? "#2f6b3d" : score >= 50 ? "#8a673b" : "#8b2f25";

  const styles = {
    shell: {
      display: isDesktop ? "grid" : "block",
      gridTemplateColumns: isDesktop
        ? isArabic
          ? "340px minmax(0, 1fr)"
          : "minmax(0, 1fr) 340px"
        : undefined,
      gap: isMobile ? "12px" : "16px",
      alignItems: "start",
      paddingBottom: 0,
    } satisfies CSSProperties,

    form: {
      marginTop: 0,
      padding: isMobile ? "12px" : "14px",
      border: "1px solid #e7dacb",
      borderRadius: isMobile ? "16px" : "18px",
      background: "rgba(255,255,255,0.95)",
      boxShadow: "0 8px 22px rgba(89, 68, 41, 0.05)",
      backdropFilter: "blur(4px)",
      minWidth: 0,
    } satisfies CSSProperties,

    introBox: {
      marginBottom: "12px",
      padding: isMobile ? "12px" : "14px",
      borderRadius: isMobile ? "14px" : "16px",
      border: "1px solid #eadccc",
      background: "linear-gradient(180deg, #fffaf4 0%, #fffdf9 100%)",
      boxShadow: "0 4px 14px rgba(89, 68, 41, 0.04)",
    } satisfies CSSProperties,

    introTitle: {
      margin: 0,
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: 800,
      color: "#33271d",
    } satisfies CSSProperties,

    introText: {
      margin: "8px 0 0",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.8,
      color: "#5f4d3d",
    } satisfies CSSProperties,

    guidanceWrap: {
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid #efe3d6",
    } satisfies CSSProperties,

    guidanceTitle: {
      margin: 0,
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 800,
      color: "#3a2d22",
    } satisfies CSSProperties,

    guidanceList: {
      margin: "8px 0 0",
      paddingInlineStart: "18px",
      color: "#6d5846",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.8,
    } satisfies CSSProperties,

    statusBox: {
      marginBottom: "12px",
      padding: "11px 13px",
      borderRadius: "12px",
      fontSize: "13px",
      lineHeight: 1.65,
      fontWeight: 600,
    } satisfies CSSProperties,

    analysisColumn: {
      position: isDesktop ? "sticky" : "static",
      top: isDesktop ? "92px" : undefined,
      alignSelf: "start",
    } satisfies CSSProperties,

    analysisBox: {
      marginBottom: isDesktop ? 0 : "12px",
      padding: isMobile ? "14px" : "16px",
      borderRadius: isMobile ? "16px" : "18px",
      border: "1px solid #e7dacb",
      background: "#fffaf4",
      boxShadow: "0 6px 18px rgba(89, 68, 41, 0.04)",
    } satisfies CSSProperties,

    analysisTitle: {
      margin: "0 0 6px",
      fontSize: isMobile ? "15px" : "16px",
      fontWeight: 800,
      color: "#2f2419",
    } satisfies CSSProperties,

    analysisHelper: {
      margin: "0 0 12px",
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.7,
      color: "#7b6551",
    } satisfies CSSProperties,

    analysisSection: {
      paddingTop: "12px",
      marginTop: "12px",
      borderTop: "1px solid #eee2d3",
    } satisfies CSSProperties,

    analysisRowTitle: {
      margin: "0 0 6px",
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 800,
      color: "#3a2d22",
    } satisfies CSSProperties,

    analysisText: {
      margin: 0,
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.75,
      color: "#5f4d3d",
      wordBreak: "break-word",
    } satisfies CSSProperties,

    analysisList: {
      margin: 0,
      paddingInlineStart: "18px",
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.75,
    } satisfies CSSProperties,

    scoreWrap: {
      marginTop: "12px",
      paddingTop: "12px",
      borderTop: "1px solid #eee2d3",
    } satisfies CSSProperties,

    scoreValue: {
      fontSize: isMobile ? "20px" : "22px",
      fontWeight: 800,
      color: scoreColor,
      lineHeight: 1.1,
      margin: "4px 0 8px",
    } satisfies CSSProperties,

    scoreBarTrack: {
      width: "100%",
      height: "10px",
      borderRadius: "999px",
      background: "#eadfd3",
      overflow: "hidden",
      marginTop: "4px",
    } satisfies CSSProperties,

    scoreBarFill: {
      height: "100%",
      borderRadius: "999px",
      background:
        score >= 80
          ? "linear-gradient(90deg, #3d7b4f 0%, #245a30 100%)"
          : score >= 50
            ? "linear-gradient(90deg, #a07a49 0%, #7f5d35 100%)"
            : "linear-gradient(90deg, #b34c40 0%, #8b2f25 100%)",
      transition: "width 0.2s ease",
    } satisfies CSSProperties,

    section: {
      marginTop: "10px",
      padding: isMobile ? "11px" : "12px",
      borderRadius: isMobile ? "14px" : "15px",
      border: "1px solid #eadfd3",
      background: "#fffdfa",
    } satisfies CSSProperties,

    sectionHeader: {
      marginBottom: "10px",
    } satisfies CSSProperties,

    sectionTitle: {
      margin: 0,
      fontSize: isMobile ? "13px" : "14px",
      lineHeight: 1.35,
      fontWeight: 800,
      color: "#33271d",
    } satisfies CSSProperties,

    sectionDescription: {
      margin: "5px 0 0",
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.65,
      color: "#6e5947",
    } satisfies CSSProperties,

    fieldsGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))",
      gap: isMobile ? "9px" : "10px",
    } satisfies CSSProperties,

    fieldWrapper: {
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      minWidth: 0,
    } satisfies CSSProperties,

    label: {
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.45,
      fontWeight: 700,
      color: "#34281e",
    } satisfies CSSProperties,

    input: {
      width: "100%",
      minHeight: isMobile ? "40px" : "42px",
      padding: isMobile ? "9px 10px" : "10px 11px",
      border: "1px solid #dbc9b5",
      borderRadius: "11px",
      fontSize: isMobile ? "13px" : "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      boxSizing: "border-box",
    } satisfies CSSProperties,

    textarea: {
      width: "100%",
      minHeight: isMobile ? "90px" : "96px",
      padding: isMobile ? "10px" : "11px",
      border: "1px solid #dbc9b5",
      borderRadius: "12px",
      fontSize: isMobile ? "13px" : "14px",
      color: "#2f2419",
      background: "#fffdfa",
      outline: "none",
      resize: "vertical",
      boxSizing: "border-box",
      lineHeight: 1.7,
    } satisfies CSSProperties,

    optionList: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))",
      gap: "7px",
    } satisfies CSSProperties,

    optionCard: {
      display: "flex",
      alignItems: "flex-start",
      gap: "9px",
      padding: isMobile ? "8px 9px" : "9px 10px",
      borderRadius: "11px",
      background: "#fffdfa",
      cursor: "pointer",
      lineHeight: 1.6,
      color: "#3b2f24",
      fontSize: isMobile ? "12px" : "13px",
      transition: "all 0.18s ease",
      minWidth: 0,
      border: "1px solid #e6d9ca",
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
      color: "#9b6d3d",
      fontWeight: 700,
    } satisfies CSSProperties,

    fileInputWrap: {
      padding: "10px",
      borderRadius: "12px",
      border: "1px dashed #d8c2a8",
      background: "#fff9f2",
    } satisfies CSSProperties,

    fileHint: {
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.5,
      color: "#8b7156",
      marginBottom: "7px",
    } satisfies CSSProperties,

    attachmentDescription: {
      margin: "0 0 8px",
      fontSize: isMobile ? "11px" : "12px",
      lineHeight: 1.6,
      color: "#7a6350",
    } satisfies CSSProperties,

    submitRow: {
      marginTop: "14px",
      display: "flex",
      justifyContent: isMobile ? "stretch" : isArabic ? "flex-start" : "flex-end",
    } satisfies CSSProperties,

    submitButton: {
      width: "100%",
      maxWidth: isMobile ? "100%" : "260px",
      minHeight: isMobile ? "44px" : "46px",
      padding: isMobile ? "10px 16px" : "11px 18px",
      borderRadius: "14px",
      border: "1px solid #241a12",
      background: "#1f1711",
      color: "#ffffff",
      cursor: "pointer",
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: 800,
      boxShadow: "0 8px 18px rgba(34, 23, 16, 0.12)",
    } satisfies CSSProperties,

    mobileAnalysisToggle: {
      width: "100%",
      minHeight: "44px",
      padding: "10px 12px",
      borderRadius: "14px",
      border: "1px solid #ddcfbe",
      background: "#fffaf4",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "10px",
      cursor: "pointer",
      color: "#2f2419",
      fontSize: "12px",
      fontWeight: 800,
      boxShadow: "0 4px 12px rgba(55, 40, 24, 0.05)",
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
      marginTop: "8px",
    } satisfies CSSProperties,
  };

  return styles;
}