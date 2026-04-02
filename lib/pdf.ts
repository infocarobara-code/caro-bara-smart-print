import { PDFDocument, rgb, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export type PdfCartItem = {
  serviceTitle: string;
  data: Record<string, string>;
};

type GenerateRequestPdfParams = {
  items: PdfCartItem[];
  companyName?: string;
};

export async function generateRequestPdf({
  items,
  companyName = "Caro Bara Werbeagentur",
}: GenerateRequestPdfParams) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const fontBytes = await fetch("/fonts/ScheherazadeNew-Regular.ttf").then((res) => {
    if (!res.ok) {
      throw new Error("Schriftdatei wurde nicht gefunden");
    }
    return res.arrayBuffer();
  });

  const fontRegular = await pdfDoc.embedFont(fontBytes);
  const fontBold = fontRegular;

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 40;
  const topMargin = 50;
  const bottomMargin = 50;
  const contentWidth = pageWidth - marginX * 2;
  const lineHeight = 16;

  const colors = {
    black: rgb(0, 0, 0),
    darkGray: rgb(0.25, 0.25, 0.25),
    lightGray: rgb(0.93, 0.93, 0.93),
    white: rgb(1, 1, 1),
  };

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let currentY = pageHeight - topMargin;

  const wrapText = (text: string, maxWidth: number, size: number) => {
    const safeText = String(text || "-").replace(/\s+/g, " ").trim() || "-";
    const words = safeText.split(" ");
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = fontRegular.widthOfTextAtSize(testLine, size);

      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }

    if (currentLine) lines.push(currentLine);
    return lines.length ? lines : ["-"];
  };

  const drawFooter = (page: PDFPage, pageNumber: number, totalPages: number) => {
    page.drawLine({
      start: { x: marginX, y: 28 },
      end: { x: pageWidth - marginX, y: 28 },
      thickness: 1,
      color: colors.lightGray,
    });

    page.drawText(`${companyName} • Seite ${pageNumber} von ${totalPages}`, {
      x: marginX,
      y: 14,
      size: 9,
      font: fontRegular,
      color: colors.darkGray,
    });
  };

  const drawHeader = (firstPage = false) => {
    currentPage.drawRectangle({
      x: marginX,
      y: pageHeight - 75,
      width: contentWidth,
      height: 36,
      color: colors.lightGray,
    });

    currentPage.drawText(companyName, {
      x: marginX + 12,
      y: pageHeight - 58,
      size: 16,
      font: fontBold,
      color: colors.black,
    });

    currentPage.drawText(
      firstPage ? "Kundenanfrage – Übersicht" : "Anfrageübersicht",
      {
        x: marginX + 12,
        y: pageHeight - 70,
        size: 9,
        font: fontRegular,
        color: colors.darkGray,
      }
    );

    currentY = pageHeight - 105;
  };

  const addNewPage = () => {
    currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    drawHeader(false);
  };

  const ensureSpace = (neededHeight: number) => {
    if (currentY - neededHeight < bottomMargin) {
      addNewPage();
    }
  };

  const drawWrappedText = (
    text: string,
    size = 10,
    bold = false,
    extraBottom = 0
  ) => {
    const lines = wrapText(text, contentWidth - 16, size);

    ensureSpace(lines.length * lineHeight + extraBottom + 6);

    for (const line of lines) {
      currentPage.drawText(line, {
        x: marginX + 8,
        y: currentY,
        size,
        font: bold ? fontBold : fontRegular,
        color: bold ? colors.black : colors.darkGray,
      });
      currentY -= lineHeight;
    }

    currentY -= extraBottom;
  };

  const drawSectionTitle = (title: string) => {
    ensureSpace(34);

    currentPage.drawRectangle({
      x: marginX,
      y: currentY - 18,
      width: contentWidth,
      height: 22,
      color: colors.black,
    });

    currentPage.drawText(title, {
      x: marginX + 10,
      y: currentY - 11,
      size: 11,
      font: fontBold,
      color: colors.white,
    });

    currentY -= 34;
  };

  const drawLabelValue = (label: string, value: string) => {
    drawWrappedText(label, 10, true, 0);
    drawWrappedText(value || "-", 10, false, 6);
  };

  const customerFieldOrder = [
    "Kundenname",
    "Telefonnummer",
    "E-Mail-Adresse",
    "Customer Name",
    "Phone Number",
    "Email Address",
    "اسم العميل",
    "رقم الهاتف",
    "البريد الإلكتروني",
  ];

  drawHeader(true);

  currentPage.drawText("Anfrage-PDF", {
    x: marginX,
    y: currentY,
    size: 22,
    font: fontBold,
    color: colors.black,
  });
  currentY -= 24;

  currentPage.drawText(
    `Erstellt am: ${new Date().toLocaleDateString("de-DE")}`,
    {
      x: marginX,
      y: currentY,
      size: 10,
      font: fontRegular,
      color: colors.darkGray,
    }
  );
  currentY -= 28;

  items.forEach((item, index) => {
    drawSectionTitle(`Anfrage ${index + 1}`);
    drawLabelValue("Service", item.serviceTitle || "-");

    const entries = Object.entries(item.data);

    const customerEntries = entries.filter(([key]) => customerFieldOrder.includes(key));
    const detailEntries = entries.filter(([key]) => !customerFieldOrder.includes(key));

    if (customerEntries.length > 0) {
      drawWrappedText("Kundendaten", 12, true, 6);
      customerEntries.forEach(([key, value]) => {
        drawLabelValue(key, value);
      });
    }

    if (detailEntries.length > 0) {
      drawWrappedText("Anfragedetails", 12, true, 6);
      detailEntries.forEach(([key, value]) => {
        drawLabelValue(key, value);
      });
    }

    currentY -= 10;
  });

  const pages = pdfDoc.getPages();
  pages.forEach((page, index) => {
    drawFooter(page, index + 1, pages.length);
  });

  return await pdfDoc.save();
}