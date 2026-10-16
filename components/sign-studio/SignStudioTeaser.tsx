"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Language } from "@/lib/i18n";
import { defaultSign } from "@/lib/sign-studio";
import { studioCopy } from "./copy";
import SignScene from "./SignScene";
import styles from "./SignStudio.module.css";

export default function SignStudioTeaser({ language }: { language: Language }) {
  const t = studioCopy[language];
  return <section className={styles.teaser} dir={language === "ar" ? "rtl" : "ltr"} aria-labelledby="sign-studio-teaser-title">
    <div className={styles.teaserText}><span>{t.eyebrow}</span><h2 id="sign-studio-teaser-title">{t.teaserTitle}</h2><p>{t.teaserText}</p><Link href="/sign-studio">{t.launch}<ArrowUpRight size={17} aria-hidden="true" /></Link><small>{t.free}</small></div>
    <div className={styles.teaserVisual}><SignScene design={defaultSign} night logo="" distance={10} label={t.imageLabel} /><span>{t.concept}</span></div>
  </section>;
}
