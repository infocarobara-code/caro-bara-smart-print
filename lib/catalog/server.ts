import "server-only";
import { unstable_cache } from "next/cache";
import { database } from "@/lib/appointments/store";
import { defaultDocument, hydrateDocument } from "./model";
export type CategoryState={revision:number;draft:unknown;published:unknown;published_at:string|null};
export async function categoryState(){
 const rows=await database<CategoryState[]>("cb_category_content?id=eq.true&select=revision,draft,published,published_at");
 if(!rows[0]||!Number.isSafeInteger(rows[0].revision))throw new Error("CATALOG_UNAVAILABLE");
 return rows[0];
}
const cached=unstable_cache(async()=>{
 if(!process.env.SUPABASE_SERVICE_ROLE_KEY)return defaultDocument();
 return hydrateDocument((await categoryState()).published);
},["category-content-v1"],{tags:["category-content"],revalidate:60});
export async function publishedCategories(){
 try{return await cached();}catch{console.error("Published category content unavailable");return defaultDocument();}
}
