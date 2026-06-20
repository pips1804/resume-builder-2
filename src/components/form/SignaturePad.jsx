import { useRef, useEffect, useState, useCallback } from "react";
import { Eraser, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SIGNATURE_WIDTH,
  SIGNATURE_HEIGHT,
} from "@/lib/signatureConstants";

const DEFAULT_DISPLAY_W = SIGNATURE_WIDTH;
const DEFAULT_DISPLAY_H = SIGNATURE_HEIGHT;

export function SignaturePad({
  onSave,
  initialImage,
  variant = "inline",
  displayWidth = DEFAULT_DISPLAY_W,
  displayHeight = DEFAULT_DISPLAY_H,
}) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const [hasInk, setHasInk] = useState(false);

  const canvasW = displayWidth * 2;
  const canvasH = displayHeight * 2;
  const lineWidth = variant === "modal" ? 8 : 5;
  const isModal = variant === "modal";

  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "#1a1a1a";
    return ctx;
  }, [lineWidth]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasInk(false);
  }, [getContext]);

  useEffect(() => {
    clearCanvas();
    if (!initialImage) return;
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvasW, canvasH);
      setHasInk(true);
    };
    img.src = initialImage;
  }, [initialImage, clearCanvas, getContext, canvasW, canvasH]);

  function getPoint(e) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e) {
    e.preventDefault();
    drawing.current = true;
    lastPoint.current = getPoint(e);
  }

  function draw(e) {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = getContext();
    if (!ctx) return;
    const point = getPoint(e);
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint.current = point;
    setHasInk(true);
  }

  function endDraw() {
    drawing.current = false;
  }

  function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas || !hasInk) return;
    onSave(canvas.toDataURL("image/png"));
  }

  return (
    <div className="space-y-3">
      {!isModal && (
        <p className="text-xs text-muted-foreground">
          Draw with your mouse or finger. The background stays transparent so your
          signature can overlap your printed name.
        </p>
      )}
      <canvas
        ref={canvasRef}
        width={canvasW}
        height={canvasH}
        style={{ width: `${displayWidth}px`, height: `${displayHeight}px` }}
        className={`border border-border rounded-md bg-white touch-none cursor-crosshair shadow-inner ${
          isModal ? "mx-auto block w-full max-w-full" : ""
        }`}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
      <div className={`flex flex-wrap gap-2 ${isModal ? "justify-end" : ""}`}>
        <Button type="button" variant="outline" size="sm" onClick={clearCanvas}>
          <Eraser className="h-4 w-4 mr-1" />
          Clear
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={handleSave}
          disabled={!hasInk}
        >
          <Check className="h-4 w-4 mr-1" />
          Use this signature
        </Button>
      </div>
    </div>
  );
}
