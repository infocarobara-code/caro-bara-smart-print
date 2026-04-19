import type { NormalizedOperationIdentity } from "./operation-identity";
import { buildOperationIdentity } from "./operation-identity";
import { generateQrFromOperationIdentity } from "./qr-code";
import { generateOperationPdfBuffer } from "./pdf-generator";
import { getCompanyProfile } from "./company-profile";

export type EmailAssetsResult = {
  identity: NormalizedOperationIdentity;
  qrDataUrl: string;
  pdfBuffer: Buffer;
  pdfFileName: string;
};

/**
 * القاعدة النهائية:
 * - الإيميل: لغة العميل
 * - PDF: ألماني فقط
 * - QR: ألماني فقط
 *
 * مهم:
 * لا يكفي تغيير identity.language فقط بعد البناء،
 * لأن بعض القيم تكون قد تم توليدها أصلًا بحسب لغة العميل داخل buildOperationIdentity.
 * لذلك نبني هويتين منفصلتين من نفس input:
 * 1) هوية أصلية للإيميل بلغة العميل
 * 2) هوية ألمانية كاملة للـ QR والـ PDF
 */
export async function buildEmailAssets(input: {
  identityInput: Parameters<typeof buildOperationIdentity>[0];
}): Promise<EmailAssetsResult> {
  // 1) الهوية الأصلية للإيميل كما هي بلغة العميل
  const identity = buildOperationIdentity(input.identityInput);

  // 2) بناء هوية ألمانية جديدة بالكامل للـ QR والـ PDF
  const germanIdentityInput = {
    ...input.identityInput,
    language: "de" as const,
    lang: "de" as const,
  };

  const germanIdentity = buildOperationIdentity(germanIdentityInput);

  // 3) توليد QR من الهوية الألمانية
  const qr = await generateQrFromOperationIdentity(germanIdentity);

  // 4) بيانات الشركة
  const company = getCompanyProfile();

  // 5) توليد PDF من الهوية الألمانية
  const pdfBuffer = await generateOperationPdfBuffer({
    identity: germanIdentity,
    qrCodeDataUrl: qr.dataUrl,
    company,
  });

  // 6) اسم الملف
  const pdfFileName = buildPdfFileName(germanIdentity);

  return {
    identity, // للإيميل فقط، تبقى بلغة العميل
    qrDataUrl: qr.dataUrl, // ألماني
    pdfBuffer, // ألماني
    pdfFileName,
  };
}

function buildPdfFileName(identity: NormalizedOperationIdentity): string {
  const base =
    identity.ids.referenceNumber ||
    identity.ids.requestId ||
    identity.ids.appointmentId ||
    "document";

  const clean = base.replace(/[^A-Za-z0-9_-]/g, "-");

  const prefix = identity.kind === "appointment" ? "appointment" : "request";

  return `${prefix}-${clean}.pdf`;
}