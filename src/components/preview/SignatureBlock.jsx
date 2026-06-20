import { useCallback, useRef } from "react";
import {
  SIGNATURE_WIDTH,
  SIGNATURE_HEIGHT,
  SIGNATURE_NAME_OVERLAP,
  SIGNATURE_MIN_WIDTH,
  SIGNATURE_MAX_WIDTH,
  SIGNATURE_MIN_HEIGHT,
  SIGNATURE_MAX_HEIGHT,
} from "@/lib/signatureConstants";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getPointerClientXY(e) {
  return { x: e.clientX, y: e.clientY };
}

/**
 * Signature + printed name block. The image overlaps the name when present
 * (works best with transparent PNGs or drawn signatures).
 */
export function SignatureBlock({
  signature,
  fullName,
  signedNameStyle = {},
  width = SIGNATURE_WIDTH,
  height = SIGNATURE_HEIGHT,
  offsetX = 0,
  offsetY = 0,
  resizable = false,
  movable = false,
  documentScale = 1,
  onResize,
  onMove,
}) {
  const hasSig = Boolean(signature);
  const interactive = Boolean(resizable || movable);
  const overlap = hasSig
    ? Math.round(SIGNATURE_NAME_OVERLAP * (height / SIGNATURE_HEIGHT))
    : 0;

  const wrapperRef = useRef(null);

  const startMove = useCallback(
    (e) => {
      if (!onMove) return;
      e.preventDefault();
      e.stopPropagation();

      const wrapper = wrapperRef.current;
      if (!wrapper) return;

      const { x: startX, y: startY } = getPointerClientXY(e);
      const startOffX = offsetX;
      const startOffY = offsetY;
      const scale = documentScale || 1;

      function onMovePointer(ev) {
        const { x: mx, y: my } = getPointerClientXY(ev);
        const dx = (mx - startX) / scale;
        const dy = (my - startY) / scale;

        // Let users place the signature naturally:
        // - bounds are the FULL available document width (this wrapper is 100%)
        // - allow a bit of negative movement so they can tuck it left/up
        const minX = -Math.round(width * 0.6);
        const minY = -Math.round(height * 0.6);
        const maxX = Math.max(0, wrapper.clientWidth - Math.round(width * 0.2));
        const maxY = Math.max(0, height + 120);

        const nextX = clamp(Math.round(startOffX + dx), minX, maxX);
        const nextY = clamp(Math.round(startOffY + dy), minY, maxY);
        onMove(nextX, nextY);
      }

      function onUp() {
        window.removeEventListener("pointermove", onMovePointer);
        window.removeEventListener("pointerup", onUp);
      }

      window.addEventListener("pointermove", onMovePointer);
      window.addEventListener("pointerup", onUp);
    },
    [onMove, offsetX, offsetY, width, height, documentScale]
  );

  const startResize = useCallback(
    (e) => {
      if (!onResize) return;
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = width;
      const startH = height;
      const aspect = startW / startH;
      const scale = documentScale || 1;

      function onMove(ev) {
        const dx = (ev.clientX - startX) / scale;
        const dy = (ev.clientY - startY) / scale;
        const delta = Math.max(dx, dy);
        const nextW = clamp(
          Math.round(startW + delta),
          SIGNATURE_MIN_WIDTH,
          SIGNATURE_MAX_WIDTH
        );
        const nextH = clamp(
          Math.round(nextW / aspect),
          SIGNATURE_MIN_HEIGHT,
          SIGNATURE_MAX_HEIGHT
        );
        const adjustedW = Math.round(nextH * aspect);
        onResize(adjustedW, nextH);
      }

      function onUp() {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [width, height, documentScale, onResize]
  );

  return (
    <div
      ref={wrapperRef}
      style={{
        width: interactive ? "100%" : `${width}px`,
        marginTop: "8px",
      }}
    >
      {!hasSig && (
        <div
          style={{
            width: `${width}px`,
            height: `${height}px`,
            borderBottom: "1px solid #ccc",
            marginBottom: "6px",
            boxSizing: "border-box",
          }}
          aria-hidden
        />
      )}

      <div
        style={{
          position: "relative",
          width: interactive ? "100%" : `${width}px`,
          minHeight: hasSig ? `${height + 24 - overlap}px` : undefined,
        }}
      >
        {hasSig && (
          <div
            style={{
              position: "absolute",
              top: `${offsetY}px`,
              left: `${offsetX}px`,
              width: `${width}px`,
              height: `${height}px`,
              zIndex: 2,
            }}
          >
            <img
              src={signature}
              alt="Signature"
              draggable={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                objectPosition: "left bottom",
                pointerEvents: "none",
              }}
            />
            {movable && (
              <button
                type="button"
                className="signature-move-ui"
                aria-label="Move signature"
                onPointerDown={startMove}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "move",
                }}
              />
            )}
            {resizable && (
              <>
                <div
                  className="signature-resize-ui"
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: "1px dashed rgba(59, 130, 246, 0.65)",
                    borderRadius: "2px",
                    pointerEvents: "none",
                  }}
                  aria-hidden
                />
                <button
                  type="button"
                  className="signature-resize-ui"
                  aria-label="Resize signature"
                  onPointerDown={startResize}
                  style={{
                    position: "absolute",
                    right: "-5px",
                    bottom: "-5px",
                    width: "14px",
                    height: "14px",
                    padding: 0,
                    border: "2px solid #fff",
                    borderRadius: "2px",
                    background: "#3b82f6",
                    cursor: "nwse-resize",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                    zIndex: 3,
                  }}
                />
              </>
            )}
          </div>
        )}
        <p
          style={{
            margin: 0,
            paddingTop: hasSig ? `${height - overlap}px` : 0,
            position: "relative",
            zIndex: 1,
            fontWeight: 600,
            fontSize: "inherit",
            ...signedNameStyle,
          }}
        >
          {fullName}
        </p>
      </div>
    </div>
  );
}
