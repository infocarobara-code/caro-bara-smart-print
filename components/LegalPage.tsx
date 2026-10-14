"use client";

import {useEffect} from "react";
import Header from "@/components/Header";
import Link from "next/link";
import {useLanguage} from "@/lib/languageContext";
import {legalContent, legalLabels, type LegalPageId} from "@/lib/legal/content";

export default function LegalPage({pageId}:{pageId:LegalPageId}) {
 const {language,dir} = useLanguage();
 const content = legalContent[pageId][language];
 const labels = legalLabels[language];
 const updated = new Intl.DateTimeFormat(language === "ar" ? "ar-DE" : language === "de" ? "de-DE" : "en-GB", {day:"numeric",month:"long",year:"numeric",timeZone:"UTC"}).format(new Date("2026-10-14T12:00:00Z"));
 useEffect(()=>{document.title = `${content.title} | Caro Bara Smart Print`;},[content.title]);
 return <><Header/><main lang={language} dir={dir} style={{maxWidth:900,margin:"30px auto",padding:"0 22px 45px",lineHeight:1.85,color:"#222",textAlign:"start",overflowWrap:"anywhere"}}>
 <h1 style={{fontSize:32,fontWeight:700,lineHeight:1.3}}>{content.title}</h1>
 <p style={{padding:16,background:"#f3fafb",borderRadius:12}}>{content.summary}</p>
 <p>{labels.updated}: <time dateTime="2026-10-14">{updated}</time>{" · "}<Link href="/">{labels.home}</Link></p>
 <article>{content.sections.map(([heading,body])=><section key={heading} style={{marginTop:28}}><h2 style={{fontSize:22}}>{heading}</h2><p style={{whiteSpace:"pre-line",unicodeBidi:"plaintext"}}>{body}</p></section>)}</article>
 <p><Link href="mailto:info@carobara.de"><bdi>info@carobara.de</bdi></Link>{" · "}<Link href="/impressum">{labels.notice}</Link>{" · "}<Link href="/datenschutz">{labels.privacy}</Link></p>
 </main></>;
}
