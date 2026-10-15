import { categories as defaults, type Category } from "@/data/categories";
export type CategoryEntry = {id:string;title:Category["title"];description:Category["description"];image:string;order:number};
export type CategoryDocument = {version:1;entries:CategoryEntry[]};
export const defaultDocument = ():CategoryDocument=>({version:1,entries:defaults.map((c,order)=>({id:c.id,title:{...c.title},description:{...c.description},image:c.image,order}))});
export function validDocument(value:unknown,publish=false):value is CategoryDocument {
 if(!value||typeof value!=="object")return false;
 const d=value as CategoryDocument;
 if(d.version!==1||!Array.isArray(d.entries)||d.entries.length!==defaults.length)return false;
 const known=new Set(defaults.map(c=>c.id)),seen=new Set<string>(),orders=new Set<number>();
 return d.entries.every(e=>{
  if(!e||!known.has(e.id)||seen.has(e.id)||!Number.isInteger(e.order)||e.order<0||e.order>=defaults.length||orders.has(e.order))return false;
  seen.add(e.id);orders.add(e.order);
  // Existing local category assets only: no remote fetches or arbitrary filesystem paths.
  if(!defaults.some(c=>c.image===e.image))return false;
  return [e.title,e.description].every(text=>text&&typeof text==="object"&&["ar","de","en"].every(lang=>typeof text[lang]==="string"&&text[lang].length<=2500&&(!publish||text[lang].trim().length>0)));
 });
}
export function publicCategories(document:CategoryDocument):Category[] {
 return [...document.entries].sort((a,b)=>a.order-b.order).map(e=>({...defaults.find(c=>c.id===e.id)!,title:e.title,description:e.description,image:e.image}));
}
export function hydrateDocument(value:unknown):CategoryDocument {
 const d=value as CategoryDocument;
 if(d?.version===1&&Array.isArray(d.entries)&&!d.entries.length)return defaultDocument();
 if(!validDocument(value,true))throw new Error("CATALOG_INVALID");
 return value;
}
