import { getPaperSize } from "./paperSizes";
import {
  SIGNATURE_WIDTH,
  SIGNATURE_HEIGHT,
  SIGNATURE_MIN_WIDTH,
  SIGNATURE_MAX_WIDTH,
  SIGNATURE_MIN_HEIGHT,
  SIGNATURE_MAX_HEIGHT,
} from "./signatureConstants";

const marginMap = { tight: 32, normal: 48, wide: 64 };

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/** Use sliders / buttons instead of drag handles on preview. */
export function prefersTouchSignatureControls() {
  if (typeof window === "undefined") return false;
  const mobileUa = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry/i.test(
    navigator.userAgent
  );
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const narrow = window.matchMedia("(max-width: 1024px)").matches;
  return mobileUa || (coarse && narrow);
}

export function getSignaturePlacementBounds(letter, meta) {
  const width = letter.signatureWidth ?? SIGNATURE_WIDTH;
  const height = letter.signatureHeight ?? SIGNATURE_HEIGHT;
  const paper = getPaperSize(meta.paperSize || "letter");
  const padding = marginMap[meta.pageMargin] ?? 48;
  const contentWidth = paper.widthPx - padding * 2;

  return {
    minX: -Math.round(width * 0.6),
    maxX: Math.max(0, contentWidth - Math.round(width * 0.2)),
    minY: -Math.round(height * 0.6),
    maxY: Math.max(0, height + 120),
    minWidth: SIGNATURE_MIN_WIDTH,
    maxWidth: SIGNATURE_MAX_WIDTH,
  };
}

export function resizeSignatureKeepingAspect(width, height, nextWidth) {
  const aspect = width / height;
  let nextW = clamp(Math.round(nextWidth), SIGNATURE_MIN_WIDTH, SIGNATURE_MAX_WIDTH);
  let nextH = clamp(Math.round(nextW / aspect), SIGNATURE_MIN_HEIGHT, SIGNATURE_MAX_HEIGHT);
  nextW = Math.round(nextH * aspect);
  return { signatureWidth: nextW, signatureHeight: nextH };
}

export function clampSignatureOffset(x, y, letter, meta) {
  const bounds = getSignaturePlacementBounds(letter, meta);
  return {
    signatureOffsetX: clamp(Math.round(x), bounds.minX, bounds.maxX),
    signatureOffsetY: clamp(Math.round(y), bounds.minY, bounds.maxY),
  };
}

export function getDefaultSignaturePlacement() {
  return {
    signatureWidth: SIGNATURE_WIDTH,
    signatureHeight: SIGNATURE_HEIGHT,
    signatureOffsetX: 0,
    signatureOffsetY: 0,
  };
}
