import Header from "@/components/Header";
import Link from "next/link";
export default function LegalPage({title,summary,sections}:{title:string;summary:string;sections:readonly (readonly [string,string])[]}){
 return <><Header/><main style={{maxWidth:900,margin:"30px auto",padding:"0 22px 45px",lineHeight:1.85,color:"#222"}}>
 <h1 lang="de">{title}</h1><p lang="ar" dir="rtl" style={{padding:16,background:"#f3fafb",borderRadius:12}}>{summary}</p>
 <p>Stand: 14. Oktober 2026 · <Link href="/">Caro Bara</Link></p>
 <article lang="de" dir="ltr">{sections.map(([heading,body])=><section key={heading} style={{marginTop:28}}><h2 style={{fontSize:22}}>{heading}</h2><p style={{whiteSpace:"pre-line"}}>{body}</p></section>)}</article>
 <p><Link href="mailto:info@carobara.com">info@carobara.com</Link>{" · "}<Link href="/impressum">Impressum</Link>{" · "}<Link href="/datenschutz">Datenschutz</Link></p>
 </main></>;
}
