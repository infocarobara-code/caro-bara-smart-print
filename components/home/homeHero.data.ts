export const heroLayoutFix = {
  container: {
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
    boxSizing: "border-box" as const,
  },

  inner: (isMobile: boolean) => ({
    maxWidth: "1240px",
    margin: "0 auto",
    padding: isMobile ? "0 14px" : "0 20px",
    width: "100%",
    boxSizing: "border-box" as const,
  }),

  grid: (isMobile: boolean) => ({
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
    gap: isMobile ? "24px" : "40px",
    alignItems: "center",
    width: "100%",
  }),

  textBlock: {
    width: "100%",
    minWidth: 0,
  },

  title: (isMobile: boolean) => ({
    fontSize: isMobile ? "28px" : "clamp(34px, 5vw, 54px)",
    lineHeight: 1.25,
    wordBreak: "break-word" as const,
  }),

  description: (isMobile: boolean) => ({
    fontSize: isMobile ? "15px" : "17px",
    lineHeight: 1.9,
    color: "#5f4d3d",
  }),

  badgesWrap: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
    maxWidth: "100%",
  },

  badge: {
    padding: "6px 10px",
    fontSize: "11px",
    borderRadius: "999px",
    background: "#ede0cf",
    border: "1px solid #dcc8af",
    whiteSpace: "nowrap" as const,
  },

  visualBlock: {
    width: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
};