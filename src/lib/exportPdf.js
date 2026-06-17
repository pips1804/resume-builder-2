import { getPaperSize } from "./paperSizes";

/*
 * Export strategy: NATIVE BROWSER PRINT.
 *
 * Rasterizing the preview with html2canvas never matched the live preview
 * (blurry text, layout drift, blank pages). Instead we let the browser's own
 * print engine render the resume — it uses the exact same CSS, real fonts and
 * vector text, so the PDF is pixel-faithful to what the user sees.
 *
 * We clone #resume-root into a dedicated #print-root attached to <body>. The
 * clone is free of the preview's `transform: scale()` wrapper, so it renders
 * at its true paper size. During print we hide the app (#root) and show only
 * #print-root, with an @page rule matching the selected paper size.
 */
export async function exportResumeToPdf(fullName = "resume", paperSizeId = "a4") {
  const element = document.getElementById("resume-root");
  if (!element) throw new Error("Resume element not found");

  const paper = getPaperSize(paperSizeId);

  // Clone the resume at natural size, stripped of preview-only styling.
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

  // Suggest a sensible filename in the print dialog via the document title.
  const prevTitle = document.title;
  document.title = fullName
    ? `${fullName.replace(/\s+/g, "-")}-Resume`
    : "Resume";

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

  // Let the browser apply the injected styles before opening the dialog.
  await new Promise((resolve) => setTimeout(resolve, 60));
  window.print();

  // Safety net: some browsers don't fire `afterprint` reliably.
  setTimeout(cleanup, 60000);
}
