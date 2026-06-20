import { getPaperSize } from "./paperSizes";

/*
 * Native browser print — clones #document-root at true paper size.
 */
export async function exportDocumentToPdf({
  elementId = "document-root",
  filename = "Document",
  paperSizeId = "letter",
} = {}) {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Document element not found");

  const paper = getPaperSize(paperSizeId);

  const clone = element.cloneNode(true);
  clone.removeAttribute("id");
  Object.assign(clone.style, {
    transform: "none",
    margin: "0",
    boxShadow: "none",
    width: `${paper.widthPx}px`,
  });

  const printRoot = document.createElement("div");
  printRoot.id = "print-root";
  printRoot.appendChild(clone);
  document.body.appendChild(printRoot);

  const prevTitle = document.title;
  document.title = filename.replace(/\s+/g, "-");

  const style = document.createElement("style");
  style.id = "print-style";
  style.textContent = `
    @media screen {
      #print-root { display: none !important; }
    }
    @media print {
      @page { size: ${paper.widthMm}mm ${paper.heightMm}mm; margin: 0; }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        background: #fff !important;
      }
      body > #root { display: none !important; }
      body > #print-root {
        display: block !important;
        position: absolute;
        top: 0;
        left: 0;
      }
      .signature-resize-ui { display: none !important; }
      .signature-move-ui { display: none !important; }
    }
  `;
  document.head.appendChild(style);

  let cleaned = false;
  const cleanup = () => {
    if (cleaned) return;
    cleaned = true;
    document.title = prevTitle;
    printRoot.remove();
    style.remove();
    window.removeEventListener("afterprint", cleanup);
  };
  window.addEventListener("afterprint", cleanup);

  await new Promise((resolve) => setTimeout(resolve, 60));
  window.print();
  setTimeout(cleanup, 60000);
}

/** @deprecated use exportDocumentToPdf */
export async function exportResumeToPdf(fullName = "resume", paperSizeId = "letter") {
  const filename = fullName
    ? `${fullName.replace(/\s+/g, "-")}-Resume`
    : "Resume";
  return exportDocumentToPdf({ filename, paperSizeId });
}
