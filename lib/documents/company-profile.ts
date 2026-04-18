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
  legalName: "Caro Bara Smart Print GmbH",

  // بيانات قانونية
  taxNumber: "DE123456789",
  vatId: "DE123456789",
  registrationNumber: "HRB 123456",

  // تواصل
  phone: "+49 176 21105086",
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