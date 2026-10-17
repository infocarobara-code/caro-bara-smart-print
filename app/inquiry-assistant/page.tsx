import { redirect } from 'next/navigation';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import HandsFree from './hands-free';
export const dynamic='force-dynamic';
export const metadata={title:'Caro Bara · Sprachassistent',robots:{index:false,follow:false}};
export default async function Page(){
 if(!await isAdminAuthenticated())redirect('/admin/login?next=%2Finquiry-assistant');
 return <HandsFree/>;
}
