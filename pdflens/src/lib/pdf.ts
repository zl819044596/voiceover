import * as pdfjsLib from "pdfjs-dist";

// P0 fix: Use locally hosted worker, no CDN dependency
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
}

export interface PDFExtractResult {
  text: string;
  pageCount: number;
}

/**
 * Extract text from a PDF file using pdfjs-dist.
 * Throws if the PDF has no extractable text (likely image-based).
 */
export async function extractPDFText(file: File): Promise<PDFExtractResult> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const pageCount = pdf.numPages;
  const pageTexts: string[] = [];

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pageTexts.push(pageText);
  }

  const fullText = pageTexts.join("\n\n").trim();

  if (!fullText) {
    throw new Error(
      "This PDF appears to be image-based. Text extraction failed."
    );
  }

  return { text: fullText, pageCount };
}
