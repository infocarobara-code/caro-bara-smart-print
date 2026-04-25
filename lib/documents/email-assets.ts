import type { NormalizedOperationIdentity } from "./operation-identity";
import { buildOperationIdentity } from "./operation-identity";
import { generateQrFromOperationIdentity } from "./qr-code";
import { generateOperationPdfBufferWithPuppeteer } from "./pdf-generator";
import { generateCaroBaraAgbPdf } from "./caro-bara-agb";
import { getCompanyProfile } from "./company-profile";

export type EmailAssetsResult = {
  identity: NormalizedOperationIdentity;
  qrDataUrl: string;
  pdfBuffer: Buffer;
  pdfFileName: string;
  agbPdfBuffer: Buffer;
  agbPdfFileName: string;
};

export async function buildEmailAssets(input: {
  identityInput: Parameters<typeof buildOperationIdentity>[0];
}): Promise<EmailAssetsResult> {
  const identity = buildOperationIdentity(input.identityInput);

  const qr = await generateQrFromOperationIdentity(identity);

  const company = getCompanyProfile();

  const pdfBuffer = await generateOperationPdfBufferWithPuppeteer({
    identity,
    qrCodeDataUrl: qr.dataUrl,
    company,
  });

  const agbPdfBuffer = await generateCaroBaraAgbPdf();

  const pdfFileName = buildPdfFileName(identity);

  return {
    identity,
    qrDataUrl: qr.dataUrl,
    pdfBuffer,
    pdfFileName,
    agbPdfBuffer,
    agbPdfFileName: "caro-bara-agb.pdf",
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