import { useRef, useEffect, useState } from "react";
import { ResumeDocument } from "./ResumeDocument";
import { CoverLetterDocument } from "./CoverLetterDocument";
import { useResumeStore } from "@/store/resumeStore";
import { getPaperSize } from "@/lib/paperSizes";
import { FileText, Mail } from "lucide-react";

export function PreviewPanel() {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const { documentType, resume, coverLetter } = useResumeStore();
  const isCoverLetter = documentType === "cover-letter";
  const meta = isCoverLetter ? coverLetter.meta : resume.meta;
  const paper = getPaperSize(meta.paperSize || "letter");

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return;
      const available = containerRef.current.clientWidth - 32;
      const ratio = available / paper.widthPx;
      setScale(Math.min(ratio, 1));
    }

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [paper.widthPx]);

  const scaledWidth = Math.floor(paper.widthPx * scale);
  const scaledHeight = Math.floor(paper.heightPx * scale);
  const DocIcon = isCoverLetter ? Mail : FileText;
  const docLabel = isCoverLetter ? "Cover Letter" : "Resume";
  const hasResizableSignature =
    isCoverLetter && Boolean(coverLetter.letter.signature);

  return (
    <div
      ref={containerRef}
      className="h-full overflow-y-auto bg-muted/40 flex flex-col items-center py-4 px-4"
    >
      <div className="flex flex-col items-center gap-1 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <DocIcon className="h-3.5 w-3.5" />
          <span>
            {docLabel} · {paper.label} — {paper.widthMm} × {paper.heightMm} mm
          </span>
        </div>
        {hasResizableSignature && (
          <p className="text-xs text-primary/80">
            Drag your signature to move it · drag the blue corner to resize
          </p>
        )}
      </div>

      <div
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          position: "relative",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: `${paper.widthPx}px`,
            height: `${paper.heightPx}px`,
            transformOrigin: "top left",
            transform: `scale(${scale})`,
            position: "absolute",
            top: 0,
            left: 0,
          }}
          className="shadow-xl ring-1 ring-black/10 transition-shadow duration-300"
        >
          {isCoverLetter ? (
            <CoverLetterDocument
              interactiveSignature
              documentScale={scale}
            />
          ) : (
            <ResumeDocument />
          )}
        </div>
      </div>

      <div style={{ height: "24px", flexShrink: 0 }} />
    </div>
  );
}
