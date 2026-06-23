import { getPaperSize } from "./paperSizes";

const SECTION_HEADING_RULE_GAP = "8px";

function waitForImages(root) {
  const images = [...root.querySelectorAll("img")];
  if (images.length === 0) return Promise.resolve();
  return Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        })
    )
  );
}

function prepareClone(element) {
  const clone = element.cloneNode(true);
  clone.removeAttribute("id");
  clone.querySelectorAll(
    ".signature-resize-ui, .signature-move-ui, .signature-highlight-ui"
  ).forEach((el) => {
    el.remove();
  });
  normalizeCloneForCapture(clone);
  return clone;
}

/** html2canvas re-clones the DOM — enforce heading/rule spacing on every clone. */
export function normalizeCloneForCapture(root) {
  root.querySelectorAll(".resume-section-heading:not(.resume-section-heading--inline)").forEach(
    (heading) => {
      const text = heading.querySelector(".resume-section-heading-text");
      let gap = heading.querySelector(".resume-section-heading-gap");
      const rule = heading.querySelector(".resume-section-heading-rule");
      if (!text || !rule) return;

      if (!gap) {
        gap = document.createElement("div");
        gap.className = "resume-section-heading-gap";
        gap.setAttribute("aria-hidden", "true");
        text.insertAdjacentElement("afterend", gap);
      }

      text.style.margin = "0";
      text.style.padding = "0";
      text.style.lineHeight = "1.2";
      text.style.display = "block";

      gap.style.display = "block";
      gap.style.height = SECTION_HEADING_RULE_GAP;
      gap.style.minHeight = SECTION_HEADING_RULE_GAP;
      gap.style.width = "100%";

      rule.style.display = "block";
      rule.style.margin = "0";
      rule.style.minHeight = rule.style.height || "1px";
    }
  );

  root.querySelectorAll(".resume-section-heading--inline").forEach((heading) => {
    const text = heading.querySelector(".resume-section-heading-text");
    const rule = heading.querySelector(".resume-section-heading-rule");
    if (!text || !rule) return;
    text.style.margin = "0";
    rule.style.marginLeft = "8px";
    rule.style.flex = "1";
  });

  root.querySelectorAll(".cover-letter-recipient-row").forEach((row) => {
    const rule = row.querySelector(".cover-letter-recipient-rule");
    if (rule) rule.style.marginLeft = "10px";
  });
}

/** Phones/tablets — native print often captures the app UI instead of the document. */
export function prefersDirectPdfDownload() {
  if (typeof window === "undefined") return false;
  const mobileUa = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry/i.test(
    navigator.userAgent
  );
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 1024px)").matches;
  return mobileUa || (coarsePointer && narrow);
}

function attachCloneForCapture(clone, paper) {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("aria-hidden", "true");
  Object.assign(clone.style, {
    visibility: "visible",
    opacity: "1",
  });
  Object.assign(wrapper.style, {
    position: "fixed",
    left: "-9999px",
    top: "0",
    width: `${paper.widthPx}px`,
    minHeight: `${paper.heightPx}px`,
    background: "#fff",
    visibility: "visible",
    opacity: "1",
    pointerEvents: "none",
    overflow: "visible",
  });
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);
  return wrapper;
}

/**
 * @param {{ fullName?: string, isCoverLetter?: boolean }} opts
 * @returns {string} e.g. "Jane Doe - Resume"
 */
export function buildExportFilename({ fullName, isCoverLetter = false } = {}) {
  const name = (fullName || "Applicant").trim() || "Applicant";
  const label = isCoverLetter ? "Cover Letter" : "Resume";
  return `${name} - ${label}`;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function withExportDocumentTitle(title, run) {
  const previousTitle = document.title;
  document.title = title;
  try {
    return await run();
  } finally {
    document.title = previousTitle;
  }
}
function sanitizePdfFilename(filename) {
  return (
    String(filename)
      .replace(/[\\/:*?"<>|]/g, "")
      .replace(/\s+/g, " ")
      .trim() || "Document"
  );
}

async function exportViaHtml2Pdf(clone, paper, filename) {
  const wrapper = attachCloneForCapture(clone, paper);

  try {
    await waitForImages(clone);
    await new Promise((resolve) => setTimeout(resolve, 150));

    const html2pdf = (await import("html2pdf.js")).default;
    const pdfFilename = `${filename}.pdf`;
    await html2pdf()
      .set({
        margin: 0,
        filename: pdfFilename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          width: paper.widthPx,
          windowWidth: paper.widthPx,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
            normalizeCloneForCapture(clonedDoc.body);
          },
        },
        jsPDF: {
          unit: "mm",
          format: paper.jsPdfFormat || [paper.widthMm, paper.heightMm],
          orientation: "portrait",
        },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(clone)
      .toPdf()
      .get("pdf")
      .then((pdf) => {
        pdf.save(pdfFilename);
      });
  } finally {
    wrapper.remove();
  }
}

function buildPrintHtml(clone, paper, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: ${paper.widthMm}mm ${paper.heightMm}mm; margin: 0; }
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
  </style>
</head>
<body>${clone.outerHTML}</body>
</html>`;
}

/** Desktop: print an isolated iframe so only the document is sent to the printer. */
async function exportViaIframePrint(clone, paper, title) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  Object.assign(iframe.style, {
    position: "fixed",
    left: "-9999px",
    top: "0",
    width: "1px",
    height: "1px",
    border: "0",
    opacity: "0",
    pointerEvents: "none",
  });
  document.body.appendChild(iframe);

  const iframeWin = iframe.contentWindow;
  const iframeDoc = iframe.contentDocument;
  if (!iframeWin || !iframeDoc) {
    iframe.remove();
    throw new Error("Could not prepare print frame.");
  }

  iframeDoc.open();
  iframeDoc.write(buildPrintHtml(clone, paper, title));
  iframeDoc.close();
  iframeDoc.title = title;

  await waitForImages(iframeDoc);
  await new Promise((resolve) => setTimeout(resolve, 100));

  await new Promise((resolve) => {
    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      iframe.remove();
      resolve();
    };

    iframeWin.addEventListener("afterprint", cleanup, { once: true });
    iframeWin.focus();
    iframeWin.print();
    setTimeout(cleanup, 120000);
  });
}

export async function exportDocumentToPdf({
  elementId = "document-root",
  filename = "Document",
  paperSizeId = "letter",
} = {}) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(
      "Document not ready for export. Wait a moment and try again."
    );
  }

  const paper = getPaperSize(paperSizeId);
  const title = sanitizePdfFilename(filename);
  const clone = prepareClone(element);

  return withExportDocumentTitle(title, async () => {
    if (prefersDirectPdfDownload()) {
      await exportViaHtml2Pdf(clone, paper, title);
      return { method: "download" };
    }

    await exportViaIframePrint(clone, paper, title);
    return { method: "print" };
  });
}

/** @deprecated use exportDocumentToPdf */
export async function exportResumeToPdf(fullName = "Applicant", paperSizeId = "letter") {
  return exportDocumentToPdf({
    filename: buildExportFilename({ fullName, isCoverLetter: false }),
    paperSizeId,
  });
}
