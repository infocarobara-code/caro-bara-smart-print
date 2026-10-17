import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import InquiryWorkspace from './workspace';
export const dynamic='force-dynamic';
export const metadata={title:'Caro Bara · Anfrage-Assistent Test',robots:{index:false,follow:false}};
export default async function Page(){
  if(!await isAdminAuthenticated())redirect('/admin/login');
  return <InquiryWorkspace/>;
}
