import { useResumeStore } from "@/store/resumeStore";
import { ResumeDocument } from "@/components/preview/ResumeDocument";
import { CoverLetterDocument } from "@/components/preview/CoverLetterDocument";

/**
 * Always-mounted full-size document used as the PDF/print source.
 * Keeps #document-root in the DOM on mobile even when the Preview tab is hidden.
 */
export function PrintDocumentSource() {
  const { documentType } = useResumeStore();
  const isCoverLetter = documentType === "cover-letter";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 -z-50"
      style={{ visibility: "hidden", width: "max-content", height: "max-content" }}
    >
      {isCoverLetter ? (
        <CoverLetterDocument rootId="document-root" />
      ) : (
        <ResumeDocument rootId="document-root" />
      )}
    </div>
  );
}
