import type { NormalizedOperationIdentity } from "./operation-identity";
import { buildOperationIdentity } from "./operation-identity";
import {
  generateQrFromOperationIdentity,
} from "./qr-code";
import {
  generateOperationPdfBuffer,
} from "./pdf-generator";
import { getCompanyProfile } from "./company-profile";

export type EmailAssetsResult = {
  identity: NormalizedOperationIdentity;
  qrDataUrl: string;
  pdfBuffer: Buffer;
  pdfFileName: string;
};

/**
 * هذا الملف هو الطبقة التي تربط:
 * identity → QR → PDF
 * بدون لمس أي منطق إرسال حالي
 */
export async function buildEmailAssets(input: {
  identityInput: Parameters<typeof buildOperationIdentity>[0];
}): Promise<EmailAssetsResult> {
  // 1) بناء الهوية الموحدة
  const identity = buildOperationIdentity(input.identityInput);

  // 2) توليد QR
  const qr = await generateQrFromOperationIdentity(identity);

  // 3) تحميل بيانات الشركة
  const company = getCompanyProfile();

  // 4) توليد PDF
  const pdfBuffer = await generateOperationPdfBuffer({
    identity,
    qrCodeDataUrl: qr.dataUrl,
    company,
  });

  // 5) اسم ملف PDF احترافي
  const pdfFileName = buildPdfFileName(identity);

  return {
    identity,
    qrDataUrl: qr.dataUrl,
    pdfBuffer,
    pdfFileName,
  };
}

/**
 * توليد اسم ملف PDF منظم
 */
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