"use client";

import { useRef, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Download, Moon, Plus, RotateCcw, SlidersHorizontal, SplitSquareHorizontal, Sun, Upload, WandSparkles, X } from "lucide-react";
import { useLanguage } from "@/lib/languageContext";
import { addToCart } from "@/lib/cart";
import { colorContrast, defaultSign, improveDesign, palettes, parseDimension, signInquiry, type SignDesign } from "@/lib/sign-studio";
import { studioCopy } from "./copy";
import SignScene from "./SignScene";
import styles from "./SignStudio.module.css";

const blobData = (blob: Blob) => new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = reject; reader.readAsDataURL(blob); });
const imageFrom = (src: string) => new Promise<HTMLImageElement>((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; });

export default function SignStudio() {
  const { language, dir } = useLanguage(), t = studioCopy[language];
  const [design, setDesign] = useState<SignDesign>({ ...defaultSign });
  const [width, setWidth] = useState("240"), [height, setHeight] = useState("60");
  const [logo, setLogo] = useState("");
  const [baseline, setBaseline] = useState({ design: { ...defaultSign, textScale: 32 }, logo: "" });
  const [comparing, setComparing] = useState(false), [night, setNight] = useState(false), [distance, setDistance] = useState(10);
  const [notice, setNotice] = useState<keyof typeof t | "">(""), [error, setError] = useState<keyof typeof t | "">("");
  const [busy, setBusy] = useState(false), [added, setAdded] = useState(false);
  const svg = useRef<SVGSVGElement>(null), logoSequence = useRef(0);
  const w = parseDimension(width, 80, 480), h = parseDimension(height, 20, 120);
  const current = { ...design, widthCm: w ?? design.widthCm, heightCm: h ?? design.heightCm };
  const valid = w !== null && h !== null && !!design.name.trim();
  const contrast = colorContrast(current.background, current.foreground);
  const update = (patch: Partial<SignDesign>) => { setDesign(v => ({ ...v, ...patch })); setAdded(false); setNotice(""); setError(""); };
  const dimensions = (value: string, field: "width" | "height") => { (field === "width" ? setWidth : setHeight)(value); setAdded(false); setNotice(""); };
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    const seq = ++logoSequence.current;
    try {
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 4 * 1024 * 1024) throw new Error();
      const data = await blobData(file), image = await imageFrom(data);
      if (image.naturalWidth * image.naturalHeight > 16_000_000 || !image.naturalWidth) throw new Error();
      if (seq === logoSequence.current) { setLogo(data); setAdded(false); setNotice(""); setError(""); }
    } catch { if (seq === logoSequence.current) setError("logoError"); }
  };
  const remember = () => { setBaseline({ design: { ...current }, logo }); setComparing(true); setNotice("remembered"); };
  const optimize = () => { setBaseline({ design: { ...current }, logo }); update(improveDesign(current)); setComparing(true); setNotice("optimized"); };
  const reset = () => { ++logoSequence.current; setDesign({ ...defaultSign }); setWidth("240"); setHeight("60"); setLogo(""); setDistance(10); setNight(false); setComparing(false); setBaseline({ design: { ...defaultSign, textScale: 32 }, logo: "" }); setNotice(""); setError(""); setAdded(false); };
  const add = () => { if (!valid || added) return; try { addToCart(signInquiry(current, language, !!logo)); setAdded(true); setNotice("added"); setError(""); } catch { setError("storageError"); } };
  const download = async () => {
    if (!svg.current || busy || !valid) return;
    setBusy(true); setError("");
    let url = "";
    try {
      const clone = svg.current.cloneNode(true) as SVGSVGElement;
      const response = await fetch("/sign-studio/storefront.webp"); if (!response.ok) throw new Error();
      const backdrop = await blobData(await response.blob());
      clone.querySelector('image[href="/sign-studio/storefront.webp"]')?.setAttribute("href", backdrop);
      clone.setAttribute("width", "1800"); clone.setAttribute("height", "1200");
      const markup = new XMLSerializer().serializeToString(clone);
      const drawing = await imageFrom("data:image/svg+xml;charset=utf-8," + encodeURIComponent(markup));
      const canvas = document.createElement("canvas"); canvas.width = 1800; canvas.height = 1200;
      const ctx = canvas.getContext("2d"); if (!ctx) throw new Error();
      ctx.drawImage(drawing, 0, 0, 1800, 1200);
      // Bake provenance into the downloaded image, not just the surrounding UI.
      ctx.fillStyle = "#102f35"; ctx.fillRect(0, 1130, 1800, 70);
      ctx.fillStyle = "#ffffff"; ctx.font = "22px Arial"; ctx.textAlign = "center";
      ctx.fillText(`CARO BARA · ${t.concept} · ${current.widthCm} × ${current.heightCm} cm`, 900, 1172);
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error()), "image/png"));
      url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `carobara-sign-${current.widthCm}x${current.heightCm}.png`; a.click(); setNotice("downloaded");
      const cleanupUrl = url; window.setTimeout(() => URL.revokeObjectURL(cleanupUrl), 5000); url = "";
    } catch { setError("exportError"); } finally { if (url) URL.revokeObjectURL(url); setBusy(false); }
  };
  const lighting = ["none", "face", "halo"] as const;
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
          {comparing && <figure><figcaption>{t.before}<span dir="ltr">{baseline.design.widthCm} × {baseline.design.heightCm} cm</span></figcaption><SignScene design={baseline.design} logo={baseline.logo} night={night} distance={distance} label={`${t.before}: ${baseline.design.name}`} /></figure>}
          <figure><figcaption>{t.current}<span dir="ltr">{current.widthCm} × {current.heightCm} cm</span></figcaption><SignScene design={current} logo={logo} night={night} distance={distance} label={`${t.imageLabel}: ${current.name}`} svgRef={svg} /></figure>
        </div>
        <div className={styles.previewFoot}><span>{t.concept}</span><span>{t.proportions}</span></div>
        <div className={styles.viewControls}>
          <label htmlFor="studio-distance">{t.distance}<strong><bdi>{distance} {t.meter}</bdi></strong></label>
          <input id="studio-distance" type="range" min="8" max="25" step="1" value={distance} onChange={e => setDistance(Number(e.target.value))} aria-describedby="studio-distance-hint" />
          <div className={styles.rangeEnds}><span>8 {t.meter}</span><span>25 {t.meter}</span></div>
          <p id="studio-distance-hint">{t.distanceHint}</p>
          <div className={styles.compareActions}><button type="button" aria-pressed={comparing} onClick={() => setComparing(!comparing)}><SplitSquareHorizontal size={16} aria-hidden="true" />{comparing ? t.single : t.compare}</button><button type="button" disabled={!valid} onClick={remember}>{t.remember}</button></div>
        </div>
        <section className={styles.analysis} aria-labelledby="studio-analysis-title">
          <h2 id="studio-analysis-title"><SlidersHorizontal size={17} aria-hidden="true" />{t.check}</h2>
          <div className={styles.metrics}><div><span>{t.ratio}</span><strong dir="ltr">{(current.widthCm / current.heightCm).toFixed(2)} : 1</strong></div><div><span>{t.contrast}</span><strong dir="ltr">{contrast.toFixed(1)} : 1</strong></div></div>
          <p className={contrast < 4.5 ? styles.warning : styles.insight}>{contrast < 4.5 ? t.low : t.clear}</p>
          {current.name.length > 18 && <p className={styles.warning}>{t.long}</p>}
          <p className={styles.small}>{t.contrastHint}</p>
          <button type="button" disabled={!valid} onClick={optimize} className={styles.improve}><WandSparkles size={17} aria-hidden="true" />{t.enhance}</button><p className={styles.small}>{t.optimizeHint}</p>
        </section>
      </section>
      <section className={styles.editor} aria-labelledby="studio-edit-title">
        <header><h2 id="studio-edit-title">{t.edit}</h2><button type="button" onClick={reset} aria-label={t.reset} title={t.reset}><RotateCcw size={17} /></button></header>
        <fieldset><legend>{t.step1}</legend>
          <label>{t.name}<input value={design.name} maxLength={48} onChange={e => update({ name: e.target.value })} dir="auto" autoComplete="off" aria-invalid={!design.name.trim()} /></label>
          {!design.name.trim() && <p className={styles.warning}>{t.nameError}</p>}
          <label>{t.subtitle}<input value={design.subtitle} maxLength={80} onChange={e => update({ subtitle: e.target.value })} dir="auto" autoComplete="off" /></label>
          <label className={styles.sliderLabel}>{t.size}<bdi>{design.textScale}%</bdi><input type="range" min="25" max="100" value={design.textScale} onChange={e => update({ textScale: Number(e.target.value) })} /></label>
          <label className={styles.upload}><Upload size={16} aria-hidden="true" />{t.logo}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={upload} /></label>
          <p className={styles.small}>{t.logoHint}</p>
          {logo && <button type="button" className={styles.remove} onClick={() => { ++logoSequence.current; setLogo(""); setAdded(false); setNotice(""); }}><X size={14} />{t.removeLogo}</button>}
        </fieldset>
        <fieldset><legend>{t.step2}</legend><div className={styles.dimensions}>
          <label>{t.width}<input inputMode="decimal" value={width} onChange={e => dimensions(e.target.value, "width")} maxLength={6} dir="ltr" aria-invalid={w === null} aria-describedby="studio-bounds" /></label>
          <label>{t.height}<input inputMode="decimal" value={height} onChange={e => dimensions(e.target.value, "height")} maxLength={6} dir="ltr" aria-invalid={h === null} aria-describedby="studio-bounds" /></label>
        </div><p id="studio-bounds" className={styles.small}>{t.bounds}</p>{(w === null || h === null) && <p className={styles.warning} role="alert">{t.dimensionError}</p>}
          <div className={styles.palettes} aria-label={t.palettes}>{palettes.map((p, i) => <button key={p.background} type="button" aria-label={`${t.palette} ${i + 1}`} aria-pressed={design.background === p.background && design.foreground === p.foreground} onClick={() => update(p)} style={{ background: p.background, color: p.foreground }}><span>Aa</span>{design.background === p.background && design.foreground === p.foreground && <Check size={12} aria-hidden="true" />}</button>)}</div>
          <div className={styles.dimensions}><label className={styles.color}>{t.background}<input type="color" value={design.background} onChange={e => update({ background: e.target.value })} /><code>{design.background}</code></label><label className={styles.color}>{t.foreground}<input type="color" value={design.foreground} onChange={e => update({ foreground: e.target.value })} /><code>{design.foreground}</code></label></div>
        </fieldset>
        <fieldset><legend>{t.step3}</legend><div className={styles.lightChoices}>{lighting.map(value => <button type="button" key={value} aria-pressed={design.lighting === value} onClick={() => { update({ lighting: value }); if (value !== "none") setNight(true); }}>{t[value]}</button>)}</div><p className={styles.small}>{t.lightingHint}</p></fieldset>
        {error && <p className={styles.error} role="alert">{t[error]}</p>}
        {notice && <p className={styles.success} role="status">{t[notice]}</p>}
        <div className={styles.primaryActions}><button type="button" className={styles.primary} disabled={!valid || added} onClick={add}>{added ? <Check size={18} /> : <Plus size={18} />}{added ? t.added : t.add}</button>{added && <Link className={styles.open} href="/cart">{t.open}<ArrowUpRight size={17} /></Link>}<button type="button" disabled={!valid || busy} onClick={download}><Download size={17} />{busy ? t.downloading : t.download}</button></div>
        <p className={styles.small}>{t.attach}</p><p className={styles.nonBinding}>{t.noOrder}</p>
      </section>
    </div>
    <p className={styles.limit}>{t.limits}</p>
  </main>;
}
