"use client";

import { useReducer, useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Download, Moon, Plus, RotateCcw, SlidersHorizontal, SplitSquareHorizontal, Sun, Upload, WandSparkles, X } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import { addToCart } from "@/lib/cart";
import { initialStudioHistory, studioHistoryReducer, construction, changeFamily, familyOptions, fontOptions, validConstruction, colorContrast, defaultSign, improveDesign, palettes, parseDimension, signInquiry, type StudioEdit, type SignDesign } from "@/lib/sign-studio";
import { studioCopy } from "./copy";
import EngineeringScene, { defaultView, type SignPart } from "./EngineeringScene";
import { engineeringCopy } from "./engineering-copy";
import styles from "./SignStudio.module.css";

const blobData = (blob: Blob) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(blob); });
const imageFrom = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; });

export default function SignStudio() {
  const { language, dir } = useLanguage(), t = studioCopy[language], e = engineeringCopy[language];
  const [view, setView] = useState(defaultView);
  const [history, dispatch] = useReducer(studioHistoryReducer, undefined, initialStudioHistory);
  const { design, width, height, logo } = history.present;
  const [selected, setSelected] = useState<SignPart>("text");
  const [baseline, setBaseline] = useState({ design: { ...defaultSign, textScale: 32 }, logo: "" });
  const [comparing, setComparing] = useState(false), [night, setNight] = useState(false);
  const [notice, setNotice] = useState<keyof typeof t | "">(""), [error, setError] = useState<keyof typeof t | "">("");
  const [busy, setBusy] = useState(false), [added, setAdded] = useState(false);
  const svg = useRef<SVGSVGElement>(null), logoSequence = useRef(0);
  const w = parseDimension(width, 80, 480), h = parseDimension(height, 20, 120);
  const current = { ...design, widthCm: w ?? design.widthCm, heightCm: h ?? design.heightCm };
  const valid = w !== null && h !== null && !!design.name.trim() && validConstruction(current);
  const build = construction(current);
  const contrast = colorContrast(current.background, current.foreground);
  const edit = (patch: StudioEdit) => { dispatch({type:"edit",patch}); setAdded(false); setNotice(""); setError(""); };
  const selectPart = (part: SignPart) => {
    setSelected(part);
    if (part !== "logo" && window.matchMedia("(max-width: 760px)").matches) {
      document.getElementById("studio-edit-title")?.scrollIntoView({behavior:"auto",block:"start"});
    }
  };
  const update = (patch: Partial<SignDesign>) => {
    edit({design:patch});
    if (patch.background || patch.foreground || patch.lighting) setView(v=>({...v,wireframe:false}));
  };
  const dimensions = (value: string, field: "width" | "height") => edit({[field]:value});
  const travelHistory = (type: "undo" | "redo") => { ++logoSequence.current; dispatch({type}); setAdded(false); setNotice(""); setError(""); };
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    const seq = ++logoSequence.current;
    try {
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 4 * 1024 * 1024) throw new Error();
      const data = await blobData(file), image = await imageFrom(data);
      if (image.naturalWidth * image.naturalHeight > 16_000_000 || !image.naturalWidth) throw new Error();
      if (seq === logoSequence.current) { edit({logo:data}); }
    } catch { if (seq === logoSequence.current) setError("logoError"); }
  };
  const remember = () => { setBaseline({ design: { ...current }, logo }); setComparing(true); setNotice("remembered"); };
  const optimize = () => { setBaseline({ design: { ...current }, logo }); update(improveDesign(current)); setComparing(true); setNotice("optimized"); };
  const reset = () => { ++logoSequence.current; edit({design:{...defaultSign,logoX:0,logoY:50},width:"240",height:"60",logo:""}); setView(defaultView); setNight(false); setComparing(false); setSelected("text"); };
  const add = () => { if (!valid || added) return; try { addToCart(signInquiry(current, language, !!logo)); setAdded(true); setNotice("added"); setError(""); } catch { setError("storageError"); } };
  const download = async () => {
    if (!svg.current || busy || !valid) return;
    setBusy(true); setError("");
    let url = "";
    try {
      const clone = svg.current.cloneNode(true) as SVGSVGElement;
      await document.fonts.ready;
      clone.querySelectorAll('[data-editor-only]').forEach(node=>node.remove());
      if (build.font === "cairo") {
        const response = await fetch("/fonts/Cairo-Bold.ttf"); if (!response.ok) throw new Error();
        const fontData = await blobData(await response.blob());
        const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
        style.textContent = `@font-face{font-family:CaroStudioCairo;src:url(${fontData});font-weight:100 900;}`;
        clone.prepend(style);
      }
      clone.setAttribute("width", "1800"); clone.setAttribute("height", "1200");
      const markup = new XMLSerializer().serializeToString(clone);
      const drawing = await imageFrom("data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup));
      const canvas = document.createElement("canvas"); canvas.width = 1800; canvas.height = 1200;
      const ctx = canvas.getContext("2d"); if (!ctx) throw new Error();
      ctx.drawImage(drawing, 0, 0, 1800, 1200);
      // Bake provenance into the downloaded image, not just the surrounding UI.
      ctx.fillStyle = "#102f35"; ctx.fillRect(0, 1130, 1800, 70);
      ctx.fillStyle = "#ffffff"; ctx.font = "22px Arial"; ctx.textAlign = "center";
      ctx.fillText(`CARO BARA · ${e.concept} · ${current.widthCm} × ${current.heightCm} cm`, 900, 1172);
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error()), "image/png"));
      url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `carobara-sign-${current.widthCm}x${current.heightCm}.png`; a.click(); setNotice("downloaded");
      const cleanupUrl = url; window.setTimeout(() => URL.revokeObjectURL(cleanupUrl), 5000); url = "";
    } catch { setError("exportError"); } finally { if (url) URL.revokeObjectURL(url); setBusy(false); }
  };
  const lighting = build.family === "panel" ? ["none"] as const : ["none", "face"] as const;
  return <main className={styles.studio} dir={dir}>
    <header className={styles.intro}>
      <Link href="/request/category/signage" className={styles.back}>{t.back}<ArrowUpRight size={15} aria-hidden="true" /></Link>
      <p className={styles.eyebrow}>{t.eyebrow}</p><h1>{t.title}</h1><p className={styles.lead}>{t.intro}</p>
    </header>
    <div className={styles.workspace}>
      <section className={styles.preview} aria-label={t.live}>
        <div className={styles.previewBar}><span className={styles.live}><i />{t.live}</span><div className={styles.segment} aria-label={`${t.day} / ${t.night}`}>
          <button type="button" aria-pressed={!night} onClick={() => setNight(false)}><Sun size={15} aria-hidden="true" />{t.day}</button>
          <button type="button" aria-pressed={night} onClick={() => setNight(true)}><Moon size={15} aria-hidden="true" />{t.night}</button>
        </div></div>
        <div className={comparing ? styles.scenesCompare : styles.scenes}>
          {comparing && <figure><figcaption>{t.before}<span dir="ltr">{baseline.design.widthCm} × {baseline.design.heightCm} cm</span></figcaption><EngineeringScene design={baseline.design} logo={baseline.logo} night={night} view={view} label={e.concept} /></figure>}
          <figure><figcaption>{t.current}<span dir="ltr">{current.widthCm} × {current.heightCm} cm</span></figcaption><EngineeringScene design={current} logo={logo} night={night} view={view} label={e.concept} svgRef={svg} selected={selected} partLabels={{body:e.body,face:e.face,text:e.text,logo:e.logo}} onSelect={selectPart} onLogoMove={position=>update(position)} onGesture={type=>dispatch({type})} /></figure>
        </div>
        <div className={styles.previewFoot}><span>{e.concept}</span><span>{t.proportions}</span></div>
        <div className={styles.viewControls}>
          <div className={styles.compareActions}>
            <button type="button" aria-pressed={view.wireframe} onClick={() => setView(v => ({...v, wireframe: true}))}>{e.sketch}</button>
            <button type="button" aria-pressed={!view.wireframe} onClick={() => setView(v => ({...v, wireframe: false}))}>{e.material}</button>
            <button type="button" onClick={() => setView(v => ({...v, yaw:0,pitch:0}))}>{e.front}</button>
            <button type="button" onClick={() => setView(v => ({...v, yaw:90,pitch:0}))}>{e.side}</button>
            <button type="button" onClick={() => setView(v => ({...v, yaw:28,pitch:18}))}>{e.angle}</button>
          </div>
          <label htmlFor="studio-yaw">{e.yaw}<bdi>{view.yaw}°</bdi></label>
          <input id="studio-yaw" type="range" min="-90" max="90" value={view.yaw} onChange={event => setView(v=>({...v,yaw:Number(event.target.value)}))} />
          <label htmlFor="studio-pitch">{e.pitch}<bdi>{view.pitch}°</bdi></label>
          <input id="studio-pitch" type="range" min="0" max="45" value={view.pitch} onChange={event => setView(v=>({...v,pitch:Number(event.target.value)}))} />
          {build.family !== "panel" && <><label htmlFor="studio-explode">{e.explode}<bdi>{view.explode}%</bdi></label>
          <input id="studio-explode" type="range" min="0" max="100" value={view.explode} onChange={event => setView(v=>({...v,explode:Number(event.target.value)}))} /><p>{e.openHint}</p></>}
          <p>{e.parts}: {build.family === "panel" ? e.panelPart : `${e.body} · ${e.face}`}{build.family === "blade" ? ` · ${e.bracket}` : ""}</p>
          <div className={styles.compareActions}><button type="button" aria-pressed={comparing} onClick={() => setComparing(!comparing)}><SplitSquareHorizontal size={16} aria-hidden="true" />{comparing ? t.single : t.compare}</button><button type="button" disabled={!valid} onClick={remember}>{t.remember}</button></div>
        </div>
        <details className={styles.analysis}>
          <summary><SlidersHorizontal size={17} aria-hidden="true" />{t.check}</summary>
          <div className={styles.metrics}><div><span>{t.ratio}</span><strong dir="ltr">{(current.widthCm / current.heightCm).toFixed(2)} : 1</strong></div><div><span>{t.contrast}</span><strong dir="ltr">{contrast.toFixed(1)} : 1</strong></div></div>
          <p className={contrast < 4.5 ? styles.warning : styles.insight}>{contrast < 4.5 ? t.low : t.clear}</p>
          {current.name.length > 18 && <p className={styles.warning}>{t.long}</p>}
          <p className={styles.small}>{t.contrastHint}</p>
          <button type="button" disabled={!valid} onClick={optimize} className={styles.improve}><WandSparkles size={17} aria-hidden="true" />{t.enhance}</button><p className={styles.small}>{t.optimizeHint}</p>
        </details>
      </section>
      <section className={styles.editor} aria-labelledby="studio-edit-title" onFocusCapture={event=>{if (event.target instanceof HTMLInputElement && event.target.type !== "file") dispatch({type:"begin"});}} onBlurCapture={()=>dispatch({type:"end"})}>
        <header><h2 id="studio-edit-title">{t.edit}</h2><button type="button" onClick={reset} aria-label={t.reset} title={t.reset}><RotateCcw size={17} /></button></header>
        <div className={styles.historyActions}>
          <button type="button" disabled={!history.past.length && !history.transaction} onClick={()=>travelHistory("undo")}>{e.undo}</button>
          <button type="button" disabled={!history.future.length} onClick={()=>travelHistory("redo")}>{e.redo}</button>
        </div>
        <p className={styles.small}>{e.pick}</p>
        <div className={styles.partTabs} role="group" aria-label={e.selection}>
          {(["text","logo","body","face"] as const).map(part=><button type="button" key={part} aria-pressed={selected===part} aria-controls="studio-part-options" onClick={()=>setSelected(part)}>{e[part]}</button>)}
        </div>
        <div id="studio-part-options">
        {selected === "body" && <fieldset><legend>{e.title}</legend>
          <div className={styles.familyChoices}>{familyOptions.map(family=><button key={family} type="button" aria-pressed={build.family===family} onClick={()=>{update(changeFamily(current,family));setView(v=>({...v,explode:0}));}}>{e[family]}</button>)}</div>
          <div className={styles.dimensions}>
            <label>{t.width}<input inputMode="decimal" value={width} onChange={event=>dimensions(event.target.value,"width")} maxLength={6} dir="ltr" aria-invalid={w===null} /></label>
            <label>{t.height}<input inputMode="decimal" value={height} onChange={event=>dimensions(event.target.value,"height")} maxLength={6} dir="ltr" aria-invalid={h===null} /></label>
          </div><p className={styles.small}>{t.bounds}</p>
          <label className={styles.sliderLabel}>{e.depth}<bdi>{build.depthCm}</bdi><input type="range" min={build.family==="panel"?.2:4} max={build.family==="panel"?2:30} step={build.family==="panel"?.1:1} value={build.depthCm} onChange={event=>update({depthCm:event.target.valueAsNumber})} /></label>
          <p className={styles.small}>{e.bounds}</p>
          {build.family==="blade" && <p className={styles.small}>{e.backFace}</p>}
        </fieldset>}
        {selected === "text" && <fieldset><legend>{e.text}</legend>
          <label>{t.name}<input value={design.name} maxLength={48} onChange={event=>update({name:event.target.value})} dir="auto" autoComplete="off" aria-invalid={!design.name.trim()} /></label>
          <label>{t.subtitle}<input value={design.subtitle} maxLength={80} onChange={event=>update({subtitle:event.target.value})} dir="auto" autoComplete="off" /></label>
          <label>{e.font}<select value={build.font} onChange={event=>update({font:event.target.value as typeof build.font})}>{fontOptions.map(font=><option key={font} value={font}>{e[font]}</option>)}</select></label>
          <label className={styles.sliderLabel}>{t.size}<bdi>{design.textScale}%</bdi><input type="range" min="25" max="100" value={design.textScale} onChange={event=>update({textScale:Number(event.target.value)})} /></label>
          <label className={styles.color}>{t.foreground}<input type="color" value={design.foreground} onChange={event=>update({foreground:event.target.value})} /><code>{design.foreground}</code></label>
        </fieldset>}
        {selected === "logo" && <fieldset><legend>{e.logo}</legend>
          <label className={styles.upload}><Upload size={16} aria-hidden="true" />{t.logo}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} /></label>
          <p className={styles.small}>{t.logoHint}</p>
          {logo && <>
            <p className={styles.small}>{e.dragHint}</p>
            <label className={styles.sliderLabel}>{e.logoScale}<bdi>{build.logoScale}%</bdi><input type="range" min="40" max="140" value={build.logoScale} onChange={event=>update({logoScale:Number(event.target.value)})} /></label>
            <label className={styles.sliderLabel}>{e.positionX}<bdi>{build.logoX}%</bdi><input type="range" min="0" max="100" step=".1" value={build.logoX} onChange={event=>update({logoX:Number(event.target.value)})} /></label>
            <label className={styles.sliderLabel}>{e.positionY}<bdi>{build.logoY}%</bdi><input type="range" min="0" max="100" step=".1" value={build.logoY} onChange={event=>update({logoY:Number(event.target.value)})} /></label>
            <p className={styles.small}>{e.scaleHint}</p>
            <button type="button" className={styles.remove} onClick={()=>{++logoSequence.current;edit({logo:""});}}><X size={14} />{t.removeLogo}</button>
          </>}
        </fieldset>}
        {selected === "face" && <fieldset><legend>{e.face}</legend>
          <div className={styles.palettes} aria-label={t.palettes}>{palettes.map((palette,i)=><button key={palette.background} type="button" aria-label={`${t.palette} ${i+1}`} aria-pressed={design.background===palette.background && design.foreground===palette.foreground} onClick={()=>update(palette)} style={{background:palette.background,color:palette.foreground}}>Aa</button>)}</div>
          <div className={styles.dimensions}>
            <label className={styles.color}>{t.background}<input type="color" value={design.background} onChange={event=>update({background:event.target.value})} /><code>{design.background}</code></label>
            <label className={styles.color}>{t.foreground}<input type="color" value={design.foreground} onChange={event=>update({foreground:event.target.value})} /><code>{design.foreground}</code></label>
          </div>
          <p>{e.light}</p><div className={styles.lightChoices}>{lighting.map(value=><button type="button" key={value} aria-pressed={design.lighting===value} onClick={()=>{update({lighting:value});if(value!=="none")setNight(true);}}>{t[value]}</button>)}</div>
          <p className={styles.small}>{t.lightingHint}</p>
        </fieldset>}
        </div>
        {(w===null || h===null) && <p className={styles.warning} role="alert">{t.dimensionError}</p>}
        {!design.name.trim() && <p className={styles.warning} role="alert">{t.nameError}</p>}
        <p className={styles.small}>{e.localHint}</p>
        {error && <p className={styles.error} role="alert">{t[error]}</p>}
        {notice && <p className={styles.success} role="status">{t[notice]}</p>}
        <div className={styles.primaryActions}><button type="button" className={styles.primary} disabled={!valid || added} onClick={add}>{added ? <Check size={18} /> : <Plus size={18} />}{added ? t.added : t.add}</button>{added && <Link className={styles.open} href="/cart">{t.open}<ArrowUpRight size={17} /></Link>}<button type="button" disabled={!valid || busy} onClick={download}><Download size={17} />{busy ? t.downloading : t.download}</button></div>
        <p className={styles.small}>{t.attach}</p><p className={styles.nonBinding}>{t.noOrder}</p>
      </section>
    </div>
    <p className={styles.limit}>{e.review}</p>
  </main>;
}
