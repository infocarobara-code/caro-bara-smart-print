"use client";

import { useId, useLayoutEffect, useRef, type RefObject } from "react";
import { construction, fontFamilies, initialTextSize, projectSignPoint, type SignDesign } from "@/lib/sign-studio";

export type EngineeringView = { yaw: number; pitch: number; explode: number; wireframe: boolean };
export const defaultView: EngineeringView = { yaw: 28, pitch: 18, explode: 0, wireframe: true };

export default function EngineeringScene({ design, logo, night, view, label, svgRef }: {
  design: SignDesign; logo: string; night: boolean; view: EngineeringView; label: string;
  svgRef?: RefObject<SVGSVGElement | null>;
}) {
  const id = useId().replace(/:/g, "");
  const text = useRef<SVGTextElement>(null), sub = useRef<SVGTextElement>(null);
  const c = construction(design), w = design.widthCm, h = design.heightCm, d = c.depthCm;
  const gap = c.family === "panel" ? 0 : view.explode * Math.min(w, 100) / 100;
  const logoSize = logo ? Math.min(h * .62, w * .2) * c.logoScale / 100 : 0;
  const textWidth = Math.max(1, w * .86 - (logoSize ? logoSize + w * .04 : 0));
  const center = w / 2 + (logoSize ? (logoSize + w * .04) / 2 : 0);
  const size = Math.min(initialTextSize(design, !!logo), h * .65);
  const subSize = Math.min(h * .13, textWidth / Math.max(1, design.subtitle.length * .65));
  useLayoutEffect(() => {
    let active = true;
    const fit = () => {
      if (!active) return;
      for (const [node, base] of [[text.current, size], [sub.current, subSize]] as const) {
        if (!node) continue;
        node.setAttribute("font-size", String(base));
        const length = node.getComputedTextLength();
        if (length > textWidth) node.setAttribute("font-size", String(base * textWidth / length));
      }
    };
    fit(); void document.fonts.ready.then(fit);
    return () => { active = false; };
  }, [design.name, design.subtitle, c.font, size, subSize, textWidth]);
  const point = (x: number, y: number, z: number) => projectSignPoint(x, y, z, view.yaw, view.pitch);
  const corners = [0, w].flatMap(x => [0, h].flatMap(y => [0, d + gap].map(z => point(x, y, z))));
  const minX = Math.min(...corners.map(p => p.x)) - (c.family === "blade" ? 28 : 0);
  const maxX = Math.max(...corners.map(p => p.x));
  const minY = Math.min(...corners.map(p => p.y));
  const maxY = Math.max(...corners.map(p => p.y));
  const scale = Math.min(460 / (maxX - minX), 240 / (maxY - minY));
  const tx = 300 - (maxX + minX) / 2 * scale, ty = 190 - (maxY + minY) / 2 * scale;
  const polygon = (points: number[][]) => points.map(([x,y,z]) => { const p=point(x,y,z); return `${p.x},${p.y}`; }).join(" ");
  const plane = (z: number) => {
    const p=point(0,0,z), x=point(1,0,z), y=point(0,1,z);
    return `matrix(${x.x-p.x} ${x.y-p.y} ${y.x-p.x} ${y.y-p.y} ${p.x} ${p.y})`;
  };
  const edge = night ? "#9cced5" : "#186779";
  const fill = view.wireframe ? (night ? "#18333d" : "#f8fbfc") : design.background;
  const ink = view.wireframe ? edge : design.foreground;
  const strokeWidth = 1 / scale;
  return <svg xmlns="http://www.w3.org/2000/svg" ref={svgRef} viewBox="0 0 600 400" role="img" aria-label={label} direction="ltr" style={{display:"block",width:"100%",height:"auto",background:night?"#10232e":"#f3f7fa"}}>
    <title>{label}</title>
    <defs>
      <pattern id={`${id}-grid`} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 H 0 V 20" fill="none" stroke={night?"#26424b":"#dce7ec"} strokeWidth=".5" /></pattern>
      <filter id={`${id}-glow`} x="-30%" y="-70%" width="160%" height="240%"><feDropShadow dx="0" dy="0" stdDeviation="2" floodColor={design.foreground} /></filter>
    </defs>
    <rect width="600" height="400" fill={`url(#${id}-grid)`} />
    <g transform={`translate(${tx} ${ty}) scale(${scale})`} stroke={edge} strokeWidth={strokeWidth} strokeLinejoin="round">
      {c.family === "blade" && <g fill="none" strokeWidth={3/scale}>
        {[h*.2,h*.8].map(y=><path key={y} d={`M ${point(-24,y,d/2).x} ${point(-24,y,d/2).y} L ${point(0,y,d/2).x} ${point(0,y,d/2).y}`} />)}
        <path d={`M ${point(-24,0,d/2).x} ${point(-24,0,d/2).y} L ${point(-24,h,d/2).x} ${point(-24,h,d/2).y}`} />
      </g>}
      <polygon points={polygon([[0,0,0],[w,0,0],[w,h,0],[0,h,0]])} fill={fill} />
      <polygon points={polygon([[0,0,0],[w,0,0],[w,0,d],[0,0,d]])} fill={view.wireframe?fill:"#52616a"} />
      {view.yaw >= 0 ? <polygon points={polygon([[0,0,0],[0,h,0],[0,h,d],[0,0,d]])} fill={view.wireframe?fill:"#344750"} /> : <polygon points={polygon([[w,0,0],[w,h,0],[w,h,d],[w,0,d]])} fill={view.wireframe?fill:"#344750"} />}
      {gap > 0 && <>
        <polygon points={polygon([[0,0,d],[w,0,d],[w,h,d],[0,h,d]])} fill="none" />
        {[[0,0],[w,0],[w,h],[0,h]].map(([x,y],i)=><path key={i} d={`M ${point(x,y,d).x} ${point(x,y,d).y} L ${point(x,y,d+gap).x} ${point(x,y,d+gap).y}`} strokeDasharray={`${4/scale} ${4/scale}`} />)}
      </>}
      <g transform={plane(d + gap)}>
        <rect width={w} height={h} fill={fill} />
        <g fill="none" strokeWidth={strokeWidth}>
          <path d={`M 0 -8 v -6 m 0 3 h ${w} m 0 -3 v 6`} />
          <path d={`M ${w+8} 0 h 6 m -3 0 v ${h} m -3 0 h 6`} />
        </g>
        {logo && <image href={logo} x={w*.07} y={(h-logoSize)/2} width={logoSize} height={logoSize} preserveAspectRatio="xMidYMid meet" />}
        <g stroke="none" fill={ink} fontFamily={fontFamilies[c.font]} textAnchor="middle" filter={!view.wireframe && night && design.lighting==="face"?`url(#${id}-glow)`:undefined}>
          <text ref={text} x={center} y={h * (design.subtitle ? .47 : .52)} fontSize={size} fontWeight="700" dominantBaseline="middle" direction={/[\u0600-\u06ff]/.test(design.name)?"rtl":"ltr"} style={{unicodeBidi:"plaintext"}}>{design.name || "—"}</text>
          <text ref={sub} x={center} y={h*.77} fontSize={subSize} dominantBaseline="middle" direction={/[\u0600-\u06ff]/.test(design.subtitle)?"rtl":"ltr"} style={{unicodeBidi:"plaintext"}}>{design.subtitle}</text>
        </g>
      </g>
    </g>
    <g fill={edge} fontFamily="Arial, sans-serif" fontSize="12" textAnchor="middle">
      <text x="300" y="35">{design.widthCm} × {design.heightCm} × {d} cm</text>
      <text x="300" y="365">CARO BARA · {label}</text>
    </g>
  </svg>;
}
