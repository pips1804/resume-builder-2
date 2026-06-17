import { getPaperSize } from "./paperSizes";

export async function exportResumeToPdf(fullName = "resume", paperSizeId = "a4") {
  const html2pdf = (await import("html2pdf.js")).default;
  const element = document.getElementById("resume-root");

  if (!element) {
    throw new Error("Resume element not found");
  }

  const paper = getPaperSize(paperSizeId);

  const filename = fullName
    ? `${fullName.replace(/\s+/g, "-")}-Resume.pdf`
    : "Resume.pdf";

  const options = {
    margin: 0,
    filename,
    image: { type: "jpeg", quality: 0.95 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
    },
    jsPDF: {
      unit: "mm",
      format: paper.jsPdfFormat,
      orientation: "portrait",
    },
    pagebreak: { mode: ["avoid-all", "css"] },
  };

  await html2pdf().set(options).from(element).save();
}
