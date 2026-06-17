import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/shared/Navbar";
import { FormPanel } from "@/components/form/FormPanel";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { TemplateSelector } from "@/components/shared/TemplateSelector";
import { useResumeStore } from "@/store/resumeStore";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function useTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return { theme, toggleTheme };
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { resume, templateChosen } = useResumeStore();

  // Ctrl/Cmd+P → PDF export
  useEffect(() => {
    async function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        try {
          const { exportResumeToPdf } = await import("./lib/exportPdf");
          await exportResumeToPdf(
            resume.personal.fullName || "My",
            resume.meta.paperSize || "a4"
          );
          toast.success("Resume downloaded!");
        } catch {
          toast.error("Export failed.");
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resume.personal.fullName, resume.meta.paperSize]);

  // Show template picker on first visit (or after reset)
  if (!templateChosen) {
    return (
      <>
        <TemplateSelector />
        <Toaster richColors position="bottom-right" />
      </>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      {/* Main content */}
      <div className="flex-1 overflow-hidden">

        {/* ── Desktop (≥ 1024px): side-by-side panels ── */}
        <div className="hidden lg:flex h-full">
          {/* Form panel: 40% on xl, 45% on lg */}
          <div className="w-[45%] xl:w-[40%] h-full overflow-hidden">
            <FormPanel />
          </div>
          {/* Preview panel: fills remaining space */}
          <div className="flex-1 h-full overflow-hidden">
            <PreviewPanel />
          </div>
        </div>

        {/* ── Tablet & Mobile (< 1024px): tabbed layout ── */}
        <div className="flex lg:hidden h-full">
          <Tabs defaultValue="form" className="flex flex-col w-full h-full">
            <TabsList className="mx-3 mt-2 shrink-0 grid grid-cols-2">
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="form" className="flex-1 overflow-hidden mt-2 data-[state=inactive]:hidden">
              <FormPanel />
            </TabsContent>
            <TabsContent value="preview" className="flex-1 overflow-hidden mt-2 data-[state=inactive]:hidden">
              <PreviewPanel />
            </TabsContent>
          </Tabs>
        </div>

      </div>

      <Toaster richColors position="bottom-right" />
    </div>
  );
}
