import { FileJson, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ImportDraftDialog({
  open,
  onOpenChange,
  documentType = "resume",
  onChooseFile,
}) {
  const isCoverLetter = documentType === "cover-letter";
  const docLabel = isCoverLetter ? "cover letter" : "resume";

  function handleChooseFile() {
    onOpenChange(false);
    onChooseFile?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            Import {docLabel} draft
          </DialogTitle>
          <DialogDescription>
            Only JSON backup files from HireMePo can be imported.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <FolderOpen className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Use a .json file</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Choose a <strong>.json</strong> file you previously saved with{" "}
              <strong>Save Draft</strong>. It restores your {docLabel} content
              and settings — other formats (PDF, Word, images) won&apos;t work.
            </p>
            <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
              {isCoverLetter
                ? "Cover letter drafts are saved as cover-letter-draft.json."
                : "Resume drafts are saved as resume-draft.json."}
            </p>
          </div>

          {!isCoverLetter && (
            <p className="text-xs text-muted-foreground">
              <strong>Classic + Photo tip:</strong> pick that template first, then
              import a Classic draft — your content loads and you only add a photo.
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleChooseFile}>Choose JSON file</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
