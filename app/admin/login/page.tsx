import Link from "next/link";
import { adminLoginReturn } from "@/lib/admin-login-return";
import { loginAction } from "./actions";
import styles from "../admin.module.css";
const copy={ar:{title:"تسجيل دخول الإدارة",user:"اسم المستخدم",password:"كلمة المرور",login:"دخول",error:"تعذر تسجيل الدخول. تحقق من البيانات وحاول مجددًا."},de:{title:"Anmeldung zur Verwaltung",user:"Benutzername",password:"Passwort",login:"Anmelden",error:"Anmeldung fehlgeschlagen. Bitte Zugangsdaten prüfen."},en:{title:"Administration sign-in",user:"Username",password:"Password",login:"Sign in",error:"Sign-in failed. Check your credentials and try again."}};
export default async function AdminLoginPage({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
 const params=await searchParams;const lang=params.lang==="ar"||params.lang==="en"?params.lang:"de";const t=copy[lang];
 const next=adminLoginReturn(params.next);const returnQuery=next?`&next=${encodeURIComponent(next)}`:"";
 return <main className={styles.main} dir={lang==="ar"?"rtl":"ltr"}><section className={styles.panel} style={{maxWidth:440,margin:"8vh auto"}}><strong>Caro Bara</strong><h1>{t.title}</h1><nav className={styles.links}>{(["ar","de","en"] as const).map(l=><Link key={l} href={`/admin/login?lang=${l}${returnQuery}`} aria-current={lang===l?"page":undefined}>{l==="ar"?"عربي":l==="de"?"Deutsch":"English"}</Link>)}</nav>{params.error&&<p role="alert" className={styles.error}>{t.error}</p>}<form action={loginAction}><input type="hidden" name="next" value={next}/><input type="hidden" name="lang" value={lang}/><label className={styles.field}>{t.user}<input name="username" required autoComplete="username" dir="ltr"/></label><label className={styles.field}>{t.password}<input type="password" name="password" required autoComplete="current-password" dir="ltr"/></label><button className={styles.button}>{t.login}</button></form></section></main>;
}
