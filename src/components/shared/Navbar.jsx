import { useState, useRef } from "react";
import {
  BriefcaseBusiness, Download, Save, RotateCcw,
  Upload, MoreHorizontal, HelpCircle, FileJson,
  FolderOpen, ShieldCheck, Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { CustomizeDrawer } from "./CustomizeDrawer";
import { ImportDraftDialog } from "./ImportDraftDialog";
import { useResumeStore } from "@/store/resumeStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ── Save / Import help dialog ─────────────────────────────────────────────────
function DraftHelpDialog({ open, onClose, onShowTutorial }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5 text-primary" />
            Save Draft &amp; Import — How it works
          </DialogTitle>
          <DialogDescription>
            Your resume data explained in plain English.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Save Draft */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Save className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Save Draft</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Downloads your entire resume as a <strong>.json</strong> file to
              your device. Think of it as a <em>backup file</em> — it stores
              everything you've typed: your name, experience, education, skills,
              and all settings.
            </p>
            <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
              💡 <strong>When to use it:</strong> Before clearing your resume, switching
              devices, or sharing your data with someone else.
            </p>
          </div>

          {/* Import */}
          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <FolderOpen className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-semibold text-sm">Import Draft</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Opens a <strong>.json</strong> file you previously saved with
              "Save Draft" and restores all your resume data instantly — exactly
              as you left it, including customization settings.
            </p>
            <p className="text-xs text-muted-foreground bg-muted rounded-md px-3 py-2">
              💡 <strong>Classic + Photo tip:</strong> Choose that template first, then
              import a Classic draft — your content loads and you only need to upload
              a photo. If you&apos;re already on Classic + Photo, importing a Classic
              draft keeps that template too.
            </p>
          </div>

          {/* Auto-save note */}
          <div className="flex gap-2 items-start rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 px-3 py-2.5">
            <ShieldCheck className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
            <p className="text-xs text-green-700 dark:text-green-400 leading-relaxed">
              <strong>Auto-save is always on.</strong> Your resume is automatically
              saved in your browser as you type — no action needed. Use Save
              Draft only when you want an external backup file.
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between gap-2">
          {onShowTutorial && (
            <Button
              variant="outline"
              onClick={() => {
                onClose();
                onShowTutorial();
              }}
            >
              <Map className="h-4 w-4 mr-1.5" />
              Show app tour
            </Button>
          )}
          <Button onClick={onClose} className="sm:ml-auto">Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export function Navbar({ theme, onToggleTheme, onShowTutorial }) {
  const {
    documentType,
    resume,
    coverLetter,
    resetResume,
    importResume,
    importCoverLetter,
  } = useResumeStore();
  const isCoverLetter = documentType === "cover-letter";
  const [exporting, setExporting] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const importInputRef = useRef(null);

  async function handleExport() {
    setExporting(true);
    try {
      const { exportDocumentToPdf } = await import("@/lib/exportPdf");
      const name = isCoverLetter
        ? coverLetter.sender.fullName || "My"
        : resume.personal.fullName || "My";
      const suffix = isCoverLetter ? "Cover-Letter" : "Resume";
      const paperSize = isCoverLetter
        ? coverLetter.meta.paperSize
        : resume.meta.paperSize;
      await exportDocumentToPdf({
        filename: `${name.replace(/\s+/g, "-")}-${suffix}`,
        paperSizeId: paperSize || "letter",
      });
      toast.info("Choose \"Save as PDF\" in the print dialog.");
    } catch (err) {
      console.error("PDF export failed:", err);
      toast.error(`Export failed: ${err?.message || "unknown error"}`);
    } finally {
      setExporting(false);
    }
  }

  function handleExportJson() {
    const payload = isCoverLetter
      ? { documentType: "cover-letter", ...coverLetter }
      : { documentType: "resume", ...resume };
    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = isCoverLetter ? "cover-letter-draft.json" : "resume-draft.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Draft saved to your device!");
  }

  function handleImportJson(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const isCoverLetterFile =
          data.documentType === "cover-letter" || Boolean(data.sender && data.letter);

        if (isCoverLetterFile) {
          importCoverLetter(data);
          toast.success("Cover letter imported successfully!");
        } else {
          const keepPhotoTemplate = resume.meta.template === "classic-photo";
          importResume(data);
          if (keepPhotoTemplate && data.meta?.template === "classic") {
            toast.success("Classic draft imported! Add your photo in Personal Info.");
          } else {
            toast.success("Draft imported successfully!");
          }
        }
      } catch {
        toast.error("Invalid file — please use a .json draft file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleReset() {
    resetResume();
    setResetOpen(false);
    toast.success("Resume cleared.");
  }

  return (
    <>
      <header className="shrink-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-40">
        <div className="flex h-14 items-center justify-between px-3 sm:px-4 gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 min-w-0">
            <BriefcaseBusiness className="h-5 w-5 text-primary shrink-0" />
            <span className="font-semibold text-sm truncate hidden xs:block sm:block">
              HireMePo 2.0
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop secondary actions */}
            <div className="hidden sm:flex items-center gap-1">
              {/* Help button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setHelpOpen(true)}
                aria-label="Help: Save Draft & Import"
                className="text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>

              {/* Import JSON */}
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setImportDialogOpen(true)}
              >
                <Upload className="h-4 w-4" />
                <span className="hidden lg:inline">Import</span>
              </Button>
              <input
                ref={importInputRef}
                id="import-json-desk"
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={handleImportJson}
              />

              {/* Save Draft */}
              <Button variant="ghost" size="sm" onClick={handleExportJson}>
                <Save className="h-4 w-4" />
                <span className="hidden lg:inline ml-1">Save Draft</span>
              </Button>

              {/* Reset */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setResetOpen(true)}
                className="border-destructive/50 text-red-600 dark:text-red-400 hover:bg-destructive/10 hover:text-red-600 dark:hover:text-red-400 hover:border-destructive"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden lg:inline ml-1">Reset</span>
              </Button>
            </div>

            {/* Mobile overflow menu */}
            <div className="flex sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="More options">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onClick={() => setHelpOpen(true)}>
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Save / Import help
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onShowTutorial}>
                    <Map className="h-4 w-4 mr-2" />
                    Show app tour
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setImportDialogOpen(true)}>
                    <Upload className="h-4 w-4 mr-2" />
                    Import Draft
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportJson}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setResetOpen(true)}
                    className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset Resume
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Customize */}
            <CustomizeDrawer />

            {/* Theme toggle */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            {/* Download PDF — primary CTA */}
            <Button
              size="sm"
              onClick={handleExport}
              disabled={exporting}
              className="ml-1"
            >
              <Download className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">
                {exporting ? "Exporting…" : "Download PDF"}
              </span>
            </Button>
          </div>
        </div>
      </header>

      {/* Save Draft / Import help dialog */}
      <DraftHelpDialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        onShowTutorial={onShowTutorial}
      />

      <ImportDraftDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        documentType={documentType}
        onChooseFile={() => importInputRef.current?.click()}
      />

      {/* Reset confirmation dialog */}
      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Start Over?</DialogTitle>
            <DialogDescription>
              This will erase all your resume data. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReset}>
              Yes, Reset
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
