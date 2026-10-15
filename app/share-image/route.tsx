import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";
export const dynamic = "force-static";

export async function GET() {
  const asset = async (file: string, type: string) =>
    `data:image/${type};base64,${(await readFile(path.join(process.cwd(), "public", file))).toString("base64")}`;
  const [logo, print, signs] = await Promise.all([
    asset("logo.png", "png"),
    asset("hero/hero-main.jpg", "jpeg"),
    asset("hero/hero-side-2.jpg", "jpeg"),
  ]);
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#f5f7f5", color: "#123c43", padding: 42, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", flexDirection: "column", width: 620, paddingRight: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Local assets are embedded so crawlers never depend on a remote image fetch. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={70} height={70} alt="" style={{ objectFit: "contain" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 30, fontWeight: 700 }}>CARO BARA</span>
            <span style={{ fontSize: 18, color: "#527075", marginTop: 4 }}>SMART PRINT · BERLIN</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 65, lineHeight: 1.06, fontWeight: 700, marginTop: 44, letterSpacing: -2 }}>
          <span>Deine Idee.</span><span>Unser Handwerk.</span><span style={{ color: "#087e94" }}>Starker Auftritt.</span>
        </div>
        <div style={{ fontSize: 23, marginTop: 26, display: "flex", color: "#446167" }}>Druck · Lichtwerbung · Werbetechnik</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingRight: 30 }}>
          <span style={{ fontSize: 20, fontWeight: 700 }}>www.carobara.com</span>
          <span style={{ fontSize: 18, color: "#087e94" }}>Entdecken & anfragen →</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", width: 454, gap: 16 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={print} alt="" width={454} height={340} style={{ objectFit: "cover", borderRadius: 24 }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={signs} alt="" width={454} height={190} style={{ objectFit: "cover", borderRadius: 24 }} />
      </div>
    </div>,
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400" } },
  );
}
