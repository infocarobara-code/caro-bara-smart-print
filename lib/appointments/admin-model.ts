import type { Appointment } from "./store";
export type AdminAppointment = Omit<Appointment, "idempotency_key" | "payload_hash">;
export type MailRecord = { id:string; appointment_id:string; reference:string|null; revision:number; event:string; recipient:string; attempts:number; last_error:string|null; sent_at:string|null; created_at:string };
export type WorkFilter = "pending" | "confirmed" | "cancelled" | "rejected" | "late" | "unresolved" | "today";
export function berlinDay(value:string|number) {
  return new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Berlin",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(value));
}
export function canRetry(mail:MailRecord, now=Date.now()) {
  const age=now-Date.parse(mail.created_at);
  return !mail.sent_at && mail.attempts<5 && age>=0 && age<23*60*60*1000;
}
export function mailState(mail:MailRecord,now=Date.now()):"accepted"|"waiting"|"review" {
  return mail.sent_at ? "accepted" : mail.last_error || !canRetry(mail,now) ? "review" : "waiting";
}
export function selectAppointments(rows:AdminAppointment[],filter:WorkFilter,history:boolean,search:string,now=Date.now()) {
  const query=search.trim().toLocaleLowerCase();
  return rows.filter(a=>{
    const active=a.status==="pending" || a.status==="confirmed";
    const future=Date.parse(a.end_at)>now;
    const match=filter==="late" ? active && !!a.cancellation_requested_at : filter==="unresolved" ? a.status==="pending" && !future : filter==="today" ? active && berlinDay(a.start_at)===berlinDay(now) : a.status===filter;
    const pastAllowed=history || filter==="unresolved" || filter==="late" || filter==="today";
    return match && (pastAllowed || future) && `${a.full_name} ${a.reference}`.toLocaleLowerCase().includes(query);
  }).sort((a,b)=>Date.parse(a.start_at)-Date.parse(b.start_at));
}
export function workCounts(rows:AdminAppointment[],mails:MailRecord[],now=Date.now()) {
  return {
    pending:selectAppointments(rows,"pending",false,"",now).length,
    today:selectAppointments(rows,"today",true,"",now).length,
    late:selectAppointments(rows,"late",true,"",now).length,
    unresolved:selectAppointments(rows,"unresolved",true,"",now).length,
    mail:mails.filter(m=>mailState(m,now)==="review").length,
  };
}
export function validAppointments(value:unknown):value is AdminAppointment[] {
  return Array.isArray(value) && value.every(a=>a && typeof a.id==="string" && typeof a.reference==="string" && typeof a.full_name==="string" && ["pending","confirmed","cancelled","rejected"].includes(a.status) && Number.isFinite(Date.parse(a.start_at)) && Number.isFinite(Date.parse(a.end_at)) && Number.isInteger(a.revision) && a.revision>=0);
}
export function validMail(value:unknown):value is MailRecord[] {
  return Array.isArray(value) && value.every(m=>m && typeof m.id==="string" && typeof m.appointment_id==="string" && ["owner","customer"].includes(m.recipient) && typeof m.event==="string" && Number.isInteger(m.attempts) && m.attempts>=0 && Number.isFinite(Date.parse(m.created_at)) && (m.sent_at===null || Number.isFinite(Date.parse(m.sent_at))));
}
