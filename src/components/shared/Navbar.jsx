import { useState } from "react";
import {
  FileText, Download, Save, RotateCcw,
  Upload, MoreHorizontal,
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

export function Navbar({ theme, onToggleTheme }) {
  const { resume, resetResume, loadResume } = useResumeStore();
  const [exporting, setExporting] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const { exportResumeToPdf } = await import("@/lib/exportPdf");
      await exportResumeToPdf(
        resume.personal.fullName || "My",
        resume.meta.paperSize || "a4"
      );
      toast.success("Resume downloaded!");
    } catch {
      toast.error("Export failed. Please try again.");
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
    toast.success("Draft exported!");
  }

  function handleImportJson(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        loadResume(data);
        toast.success("Draft imported!");
      } catch {
        toast.error("Invalid JSON file.");
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
            <FileText className="h-5 w-5 text-primary shrink-0" />
            <span className="font-semibold text-sm truncate hidden xs:block sm:block">
              HireMePo 2.0
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* Secondary actions — hidden on xs, shown as icons on sm+ */}
            <div className="hidden sm:flex items-center gap-1">
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
                <DropdownMenuContent align="end" className="w-44">
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
