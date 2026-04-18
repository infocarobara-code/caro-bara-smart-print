import QRCode from "qrcode";
import type { NormalizedOperationIdentity } from "./operation-identity";

export type QrCodeResult = {
  dataUrl: string;
  svg: string;
};

export type QrCodeOptions = {
  size?: number;
  margin?: number;
};

const DEFAULT_QR_SIZE = 256;
const DEFAULT_QR_MARGIN = 1;

export async function generateQrFromString(
  value: string,
  options?: QrCodeOptions
): Promise<QrCodeResult> {
  const size = options?.size || DEFAULT_QR_SIZE;
  const margin = options?.margin ?? DEFAULT_QR_MARGIN;

  const dataUrl = await QRCode.toDataURL(value, {
    width: size,
    margin,
    errorCorrectionLevel: "M",
  });

  const svg = await QRCode.toString(value, {
    type: "svg",
    margin,
  });

  return {
    dataUrl,
    svg,
  };
}

export async function generateQrFromOperationIdentity(
  identity: NormalizedOperationIdentity,
  options?: QrCodeOptions
): Promise<QrCodeResult> {
  const payload = buildCompactQrPayload(identity);
  return generateQrFromString(payload, options);
}

export function buildCompactQrPayload(
  identity: NormalizedOperationIdentity
): string {
  const typeLabel = identity.kind === "appointment" ? "Appointment" : "Request";
  const operationId =
    identity.ids.requestId ||
    identity.ids.appointmentId ||
    identity.ids.referenceNumber ||
    "N/A";

  const customerNumber = identity.ids.customerId || "N/A";
  const customerName = identity.customer.fullName || "N/A";
  const status = identity.operation.status || "N/A";
  const date = identity.schedule.date || "N/A";
  const startTime = identity.schedule.startTime || "";
  const endTime = identity.schedule.endTime || "";
  const serviceType = identity.operation.serviceType || "N/A";

  const timeWindow =
    startTime && endTime
      ? `${startTime} - ${endTime}`
      : startTime || endTime || "N/A";

  return [
    "Caro Bara Smart Print",
    `Type: ${typeLabel}`,
    `Reference: ${identity.ids.referenceNumber || operationId}`,
    `Operation ID: ${operationId}`,
    `Customer No: ${customerNumber}`,
    `Customer: ${customerName}`,
    `Status: ${status}`,
    `Service: ${serviceType}`,
    `Date: ${date}`,
    `Time: ${timeWindow}`,
    `Generated: ${identity.meta.generatedAt}`,
  ].join("\n");
}

export async function generateCompactQr(
  identity: NormalizedOperationIdentity,
  options?: QrCodeOptions
): Promise<QrCodeResult> {
  const compact = buildCompactQrPayload(identity);
  return generateQrFromString(compact, options);
}