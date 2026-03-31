import nodemailer from "nodemailer";

type SendEmailParams = {
  customerName?: string;
  phone?: string;
  email?: string;
  serviceTitle?: string;
  serviceId?: string;
  contactMethod?: string;
  formData: Record<string, unknown>;
};

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

export async function sendEmail({
  customerName,
  phone,
  email,
  serviceTitle,
  serviceId,
  contactMethod,
  formData,
}: SendEmailParams) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const details = Object.entries(formData)
    .map(([key, value]) => `${key}: ${formatValue(value)}`)
    .join("\n");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: `New Request - ${serviceTitle || serviceId || "Service Request"}`,
    text: `
New request received

Customer Name: ${customerName || "-"}
Phone: ${phone || "-"}
Email: ${email || "-"}
Preferred Contact: ${contactMethod || "-"}
Service Title: ${serviceTitle || "-"}
Service ID: ${serviceId || "-"}

-------------------------
FORM DETAILS
-------------------------
${details}
    `,
  };

  await transporter.sendMail(mailOptions);
}