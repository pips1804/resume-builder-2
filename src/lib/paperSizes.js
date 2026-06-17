// Paper dimensions at 96 DPI (px) and their jsPDF format strings
// Width × Height in pixels
export const PAPER_SIZES = {
  a4: {
    id: "a4",
    label: "A4",
    desc: "210 × 297 mm — International standard",
    widthPx: 794,
    heightPx: 1123,
    jsPdfFormat: "a4",
    widthMm: 210,
    heightMm: 297,
  },
  letter: {
    id: "letter",
    label: "US Letter",
    desc: '8.5 × 11 in — North America standard',
    widthPx: 816,
    heightPx: 1056,
    jsPdfFormat: "letter",
    widthMm: 215.9,
    heightMm: 279.4,
  },
  legal: {
    id: "legal",
    label: "US Legal",
    desc: '8.5 × 14 in — Legal documents',
    widthPx: 816,
    heightPx: 1344,
    jsPdfFormat: "legal",
    widthMm: 215.9,
    heightMm: 355.6,
  },
  a5: {
    id: "a5",
    label: "A5",
    desc: "148 × 210 mm — Compact",
    widthPx: 559,
    heightPx: 794,
    jsPdfFormat: "a5",
    widthMm: 148,
    heightMm: 210,
  },
  a3: {
    id: "a3",
    label: "A3",
    desc: "297 × 420 mm — Large format",
    widthPx: 1123,
    heightPx: 1587,
    jsPdfFormat: "a3",
    widthMm: 297,
    heightMm: 420,
  },
};

export const PAPER_SIZE_LIST = Object.values(PAPER_SIZES);

export function getPaperSize(id) {
  return PAPER_SIZES[id] ?? PAPER_SIZES.a4;
}
