import {termsSections} from "@/lib/legal/terms";
export async function generateCaroBaraAgbPdf(): Promise<Buffer> {
  const html = buildCaroBaraAgbHtml();
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "18mm",
        right: "18mm",
        bottom: "18mm",
        left: "18mm",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}

async function launchBrowser() {
  const isServerless = Boolean(
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
  );

  if (isServerless) {
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteerCore = (await import("puppeteer-core")).default;

    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  const puppeteer = (await import("puppeteer")).default;

  return puppeteer.launch({
    headless: true,
  });
}

export function buildCaroBaraAgbHtml(): string {
 const sections = termsSections.map(([heading, body]) => `<section><h2>${heading}</h2><p>${body}</p></section>`).join("");
 return `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8"/><title>AGB – Caro Bara</title><style>body{font:12px/1.6 Arial;color:#222}h1{font-size:23px}h2{font-size:15px}section{break-inside:avoid}footer{margin-top:24px}</style></head><body><h1>Allgemeine Geschäftsbedingungen</h1><p>Mohammad Refat Alyoussef · Caro Bara Werbeagentur<br/>Fanningerstraße 20 · 10365 Berlin · info@carobara.de</p><p>Stand: 14. Oktober 2026</p>${sections}<footer>Website-Anfragen sind unverbindlich. Dieses Dokument ist keine Auftragsannahme.<br/>Datenschutzinformationen: https://caro-bara-smart-print.vercel.app/datenschutz</footer></body></html>`;
}
