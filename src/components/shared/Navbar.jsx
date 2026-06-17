import { useState } from "react";
import {
  BriefcaseBusiness, Download, Save, RotateCcw,
  Upload, MoreHorizontal, HelpCircle, FileJson,
  FolderOpen, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { CustomizeDrawer } from "./CustomizeDrawer";
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
function DraftHelpDialog({ open, onClose }) {
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
              💡 <strong>When to use it:</strong> Continuing work on another
              device, restoring a backup, or loading a different version of
              your resume.
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

        <DialogFooter>
          <Button onClick={onClose}>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Navbar ───────────────────────────────────────────────────────────────
export function Navbar({ theme, onToggleTheme }) {
  const { resume, resetResume, loadResume } = useResumeStore();
  const [exporting, setExporting] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const { exportResumeToPdf } = await import("@/lib/exportPdf");
      await exportResumeToPdf(
        resume.personal.fullName || "My",
        resume.meta.paperSize || "a4"
      );
      toast.info("Choose \"Save as PDF\" in the print dialog.");
    } catch (err) {
      console.error("PDF export failed:", err);
      toast.error(`Export failed: ${err?.message || "unknown error"}`);
    } finally {
      setExporting(false);
    }
  }

  function handleExportJson() {
    const json = JSON.stringify(resume, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resume-draft.json";
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
        loadResume(data);
        toast.success("Draft imported successfully!");
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
              <label htmlFor="import-json-desk">
                <Button variant="ghost" size="sm" asChild>
                  <span className="flex items-center gap-1 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span className="hidden lg:inline">Import</span>
                  </span>
                </Button>
                <input
                  id="import-json-desk"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportJson}
                />
              </label>

              {/* Save Draft */}
              <Button variant="ghost" size="sm" onClick={handleExportJson}>
                <Save className="h-4 w-4" />
                <span className="hidden lg:inline ml-1">Save Draft</span>
              </Button>

              {/* Reset */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResetOpen(true)}
                className="text-destructive hover:text-destructive"
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
                    What is Save / Import?
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <label htmlFor="import-json-mob" className="flex items-center gap-2 cursor-pointer w-full">
                      <Upload className="h-4 w-4" />
                      Import Draft
                      <input
                        id="import-json-mob"
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImportJson}
                      />
                    </label>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportJson}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Draft
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setResetOpen(true)}
                    className="text-destructive focus:text-destructive"
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
      <DraftHelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />

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
