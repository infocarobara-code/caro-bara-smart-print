import { revalidateTag } from "next/cache";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { assertOrigin,BookingError,database,parseBody } from "@/lib/appointments/store";
import { fail,ok } from "@/lib/appointments/http";
import { categoryState } from "@/lib/catalog/server";
import { defaultDocument,validDocument } from "@/lib/catalog/model";
function draft(value:unknown){const d=value as {version:number;entries:unknown[]};return d?.version===1&&Array.isArray(d.entries)&&!d.entries.length?defaultDocument():value}
export async function GET(){try{if(!(await isAdminAuthenticated()))throw new BookingError("UNAUTHORIZED",401);const state=await categoryState();return ok({...state,draft:draft(state.draft)})}catch(e){return fail(e)}}
export async function POST(request:Request){try{
 if(!(await isAdminAuthenticated()))throw new BookingError("UNAUTHORIZED",401);
 assertOrigin(request);const body=await parseBody(request);
 if(!Number.isSafeInteger(body.revision)||Number(body.revision)<0||!["save","publish"].includes(String(body.action)))throw new BookingError("INVALID_INPUT",400);
 const state=await categoryState();if(state.revision!==body.revision)throw new BookingError("STATE_CONFLICT",409);
 const document=body.action==="publish"?draft(state.draft):body.document;
 if(!validDocument(document,body.action==="publish"))throw new BookingError("INVALID_INPUT",400);
 const patch=body.action==="publish"?{published:document,published_at:new Date().toISOString(),revision:state.revision+1}:{draft:document,revision:state.revision+1};
 const rows=await database<unknown[]>(`cb_category_content?id=eq.true&revision=eq.${state.revision}`,"PATCH",patch);
 if(!rows.length)throw new BookingError("STATE_CONFLICT",409);
 if(body.action==="publish")revalidateTag("category-content",{expire:0});
 return ok({revision:state.revision+1,published:body.action==="publish"});
}catch(e){return fail(e)}}
