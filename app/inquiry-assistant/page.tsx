import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import InquiryWorkspace from '../admin/inquiry-assistant/workspace';
export const dynamic='force-dynamic';
export const metadata={title:'Caro Bara · Sprachassistent',robots:{index:false,follow:false}};
export default async function Page(){
 if(!await isAdminAuthenticated())redirect('/admin/login');
 return <InquiryWorkspace/>;
}
