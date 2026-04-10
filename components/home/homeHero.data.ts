export const heroLayoutFix = {
  container: {
    width: "100%",
    maxWidth: "100%",
    overflowX: "clip" as const,
    overflowY: "visible" as const,
    boxSizing: "border-box" as const,
  },

  inner: (isMobile: boolean) => ({
    width: "100%",
    maxWidth: "1240px",
    marginInline: "auto",
    paddingInline: isMobile ? "14px" : "20px",
    boxSizing: "border-box" as const,
    overflowX: "clip" as const,
  }),

  grid: (isMobile: boolean) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "minmax(0, 1fr)" : "minmax(0, 1.1fr) minmax(0, 0.9fr)",
    gap: isMobile ? "24px" : "40px",
    alignItems: "center",
    width: "100%",
    minWidth: 0,
  }),

  textBlock: {
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    overflowWrap: "anywhere" as const,
  },

  title: (isMobile: boolean) => ({
    fontSize: isMobile ? "28px" : "clamp(34px, 5vw, 54px)",
    lineHeight: 1.25,
    wordBreak: "break-word" as const,
    overflowWrap: "anywhere" as const,
    maxWidth: "100%",
    minWidth: 0,
  }),

  description: (isMobile: boolean) => ({
    fontSize: isMobile ? "15px" : "17px",
    lineHeight: 1.9,
    color: "#5f4d3d",
    maxWidth: "100%",
    minWidth: 0,
    overflowWrap: "anywhere" as const,
  }),

  badgesWrap: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
    width: "100%",
    maxWidth: "100%",
    minWidth: 0,
  },

  badge: {
    padding: "6px 10px",
    fontSize: "11px",
    borderRadius: "999px",
    background: "#ede0cf",
    border: "1px solid #dcc8af",
    whiteSpace: "normal" as const,
    wordBreak: "break-word" as const,
    overflowWrap: "anywhere" as const,
    maxWidth: "100%",
  },

  visualBlock: {
    width: "100%",
    minWidth: 0,
    maxWidth: "100%",
    overflowX: "clip" as const,
    overflowY: "visible" as const,
  },
};