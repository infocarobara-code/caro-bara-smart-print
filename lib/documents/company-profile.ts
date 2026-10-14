import type { CompanyPdfProfile } from "./pdf-generator";

/**
 * الملف المركزي لتعريف معلومات الشركة المستخدمة في:
 * - PDF
 * - الإيميلات
 * - أي مستند رسمي
 *
 * أي تعديل هنا ينعكس مباشرة على كل المستندات الرسمية.
 */
export const COMPANY_PROFILE: CompanyPdfProfile = {
  companyName: "Caro Bara Smart Print",
  legalName: "Mohammad Refat Alyoussef – Caro Bara Werbeagentur",

  // بيانات قانونية
  taxNumber: "32/205/00414",
  vatId: "DE367793052",
  registrationNumber: undefined,

  // تواصل
  phone: "+49 30 43021132",
  email: "info@carobara.de",
  website: "www.carobara.de",

  // العنوان
  addressLine1: "Fanninger Straße 20",
  addressLine2: "",
  postalCode: "10365",
  city: "Berlin",
  country: "Germany",

  // الشعار داخل public
  logoSrc: "/logo.png",
};

/**
 * Helper بسيط لإرجاع نسخة آمنة
 */
export function getCompanyProfile(): CompanyPdfProfile {
  return { ...COMPANY_PROFILE };
}