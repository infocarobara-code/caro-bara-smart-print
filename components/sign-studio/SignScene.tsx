"use client";

import { useId, useLayoutEffect, useRef, type RefObject } from "react";
import { initialTextSize, signGeometry, type SignDesign } from "@/lib/sign-studio";

export default function SignScene({ design, logo, night, distance, label, svgRef }: {
  design: SignDesign; logo: string; night: boolean; distance: number; label: string;
  svgRef?: RefObject<SVGSVGElement | null>;
}) {
  const localRef = useRef<SVGSVGElement>(null);
  const mainText = useRef<SVGTextElement>(null);
  const subText = useRef<SVGTextElement>(null);
  const uid = useId().replace(/:/g, "");
  const g = signGeometry(design);
  const logoSize = logo ? Math.min(design.heightCm * .62, design.widthCm * .2) : 0;
  const textWidth = design.widthCm * .86 - (logoSize ? logoSize + design.widthCm * .04 : 0);
  const textCenter = g.x + design.widthCm / 2 + (logoSize ? (logoSize + design.widthCm * .04) / 2 : 0);
  const fontSize = initialTextSize(design, !!logo);
  const subSize = Math.min(design.heightCm * .13, textWidth / Math.max(1, [...design.subtitle].length * .65));
  useLayoutEffect(() => {
    let alive = true;
    const fit = () => {
      if (!alive) return;
      for (const [node, base] of [[mainText.current, fontSize], [subText.current, subSize]] as const) {
        if (!node) continue;
        node.setAttribute("font-size", String(base));
        const measured = node.getComputedTextLength();
        if (measured > textWidth) node.setAttribute("font-size", String(base * textWidth / measured));
      }
    };
    fit();
    void document.fonts.ready.then(fit);
    return () => { alive = false; };
  }, [design.name, design.subtitle, fontSize, subSize, textWidth]);
  const lit = night && design.lighting !== "none";
  const scale = 10 / distance;
  return <svg xmlns="http://www.w3.org/2000/svg" ref={svgRef || localRef} viewBox="0 0 600 400" role="img" aria-label={label} direction="ltr" style={{ display: "block", width: "100%", height: "auto", background: night ? "#162029" : "#e9e5dc" }}>
    <title>{label}</title>
    <defs>
      <filter id={`${uid}-night`}><feColorMatrix type="matrix" values=".42 0 0 0 0  0 .43 0 0 0  0 0 .48 0 0  0 0 0 1 0" /></filter>
      <filter id={`${uid}-shadow`} x="-30%" y="-100%" width="160%" height="300%"><feDropShadow dx="0" dy="2.3" stdDeviation="1.4" floodOpacity=".4" /></filter>
      <filter id={`${uid}-halo`} x="-40%" y="-150%" width="180%" height="400%"><feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#ffe5b1" floodOpacity=".95" /></filter>
      <filter id={`${uid}-face`} x="-30%" y="-100%" width="160%" height="300%"><feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor={design.foreground} floodOpacity=".8" /></filter>
    </defs>
    <g transform={`translate(300 190) scale(${scale}) translate(-300 -190)`}>
      <image href="/sign-studio/storefront.webp" width="600" height="400" filter={night ? `url(#${uid}-night)` : undefined} />
      <g filter={`url(#${uid}-shadow)`}>
        {lit && design.lighting === "halo" && <rect x={g.x - 1} y={g.y - 1} width={g.width + 2} height={g.height + 2} rx="3" fill="#ffe6b7" filter={`url(#${uid}-halo)`} />}
        <rect x={g.x} y={g.y} width={g.width} height={g.height} rx="2" fill={design.background} stroke={lit ? "#d4c2a1" : "#ffffff"} strokeOpacity=".3" strokeWidth=".45" />
        <path d={`M ${g.x + 2} ${g.y + g.height - 1} H ${g.x + g.width - 2}`} stroke="#000" strokeOpacity=".25" strokeWidth="1.2" />
        {logo && <image href={logo} x={g.x + design.widthCm * .07} y={g.y + (g.height - logoSize) / 2} width={logoSize} height={logoSize} preserveAspectRatio="xMidYMid meet" />}
        <g fill={design.foreground} filter={lit ? `url(#${uid}-${design.lighting === "face" ? "face" : "halo"})` : undefined} fontFamily="Arial, sans-serif" textAnchor="middle">
          <text ref={mainText} x={textCenter} y={g.y + g.height * (design.subtitle ? .47 : .52)} fontSize={fontSize} fontWeight="700" dominantBaseline="middle" direction={/[\u0600-\u06ff]/.test(design.name) ? "rtl" : "ltr"} style={{ unicodeBidi: "plaintext" }}>{design.name || "—"}</text>
          {design.subtitle && <text ref={subText} x={textCenter} y={g.y + g.height * .77} fontSize={subSize} fontWeight="500" dominantBaseline="middle" direction={/[\u0600-\u06ff]/.test(design.subtitle) ? "rtl" : "ltr"} style={{ unicodeBidi: "plaintext" }}>{design.subtitle}</text>}
        </g>
      </g>
      <g stroke={night ? "#d8e5e9" : "#314a50"} fill={night ? "#e8f0f2" : "#314a50"} strokeWidth=".45" fontFamily="Arial, sans-serif" fontSize="5.5" textAnchor="middle">
        <path d={`M ${g.x} ${g.y - 7} v -4 m 0 2 h ${g.width} m 0 -2 v 4`} fill="none" />
        <text x="300" y={g.y - 13} stroke="none">{design.widthCm} cm</text>
        <path d={`M ${g.x + g.width + 5} ${g.y} h 4 m -2 0 v ${g.height} m -2 0 h 4`} fill="none" />
        <text x={g.x + g.width + 16} y={g.y + g.height / 2} stroke="none">{design.heightCm} cm</text>
      </g>
    </g>
  </svg>;
}
