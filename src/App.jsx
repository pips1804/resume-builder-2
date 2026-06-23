import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/shared/Navbar";
import { FormPanel } from "@/components/form/FormPanel";
import { CoverLetterFormPanel } from "@/components/form/CoverLetterFormPanel";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { PrintDocumentSource } from "@/components/preview/PrintDocumentSource";
import { DocumentTypeSelector } from "@/components/shared/DocumentTypeSelector";
import { TemplateSelector } from "@/components/shared/TemplateSelector";
import { OnboardingWalkthrough } from "@/components/shared/OnboardingWalkthrough";
import { InterviewPanel } from "@/components/interview/InterviewPanel";
import { PageTransition } from "@/components/shared/motion";
import { useResumeStore } from "@/store/resumeStore";
import { useInterviewStore } from "@/store/interviewStore";
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
  const {
    documentType,
    documentTypeChosen,
    templateChosen,
    tutorialCompleted,
    completeTutorial,
    resume,
    coverLetter,
  } = useResumeStore();
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const interviewPanelOpen = useInterviewStore((s) => s.panelOpen);

  const isCoverLetter = documentType === "cover-letter";

  useEffect(() => {
    if (templateChosen && !tutorialCompleted) {
      const timer = setTimeout(() => setTutorialOpen(true), 400);
      return () => clearTimeout(timer);
    }
  }, [templateChosen, tutorialCompleted]);

  function handleTutorialComplete() {
    completeTutorial();
    setTutorialOpen(false);
  }

  useEffect(() => {
    async function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        try {
          const { exportDocumentToPdf, buildExportFilename } = await import("./lib/exportPdf");
          const name = isCoverLetter
            ? coverLetter.sender.fullName
            : resume.personal.fullName;
          const paperSize = isCoverLetter
            ? coverLetter.meta.paperSize
            : resume.meta.paperSize;
          const result = await exportDocumentToPdf({
            filename: buildExportFilename({ fullName: name, isCoverLetter }),
            paperSizeId: paperSize || "letter",
          });
          if (result?.method === "download") {
            toast.success("PDF downloaded to your device.");
          } else {
            toast.info('Choose "Save as PDF" in the print dialog.', { duration: 5000 });
          }
        } catch (err) {
          console.error("PDF export failed:", err);
          toast.error(`Export failed: ${err?.message || "unknown error"}`);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isCoverLetter,
    resume.personal.fullName,
    resume.meta.paperSize,
    coverLetter.sender.fullName,
    coverLetter.meta.paperSize,
  ]);

  if (!documentTypeChosen) {
    return (
      <>
        <PageTransition className="fixed inset-0 z-50">
          <DocumentTypeSelector theme={theme} onToggleTheme={toggleTheme} />
        </PageTransition>
        <Toaster richColors position="bottom-right" />
        {interviewPanelOpen && <InterviewPanel />}
      </>
    );
  }

  if (!templateChosen) {
    return (
      <>
        <PageTransition className="fixed inset-0 z-50">
          <TemplateSelector theme={theme} onToggleTheme={toggleTheme} />
        </PageTransition>
        <Toaster richColors position="bottom-right" />
        {interviewPanelOpen && <InterviewPanel />}
      </>
    );
  }

  const FormComponent = isCoverLetter ? CoverLetterFormPanel : FormPanel;

  return (
    <PageTransition className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onShowTutorial={() => setTutorialOpen(true)}
      />

      <div className="flex-1 overflow-hidden">
        <div className="hidden lg:flex h-full">
          <div className="w-[45%] xl:w-[40%] h-full overflow-hidden">
            <FormComponent />
          </div>
          <div className="flex-1 h-full overflow-hidden">
            <PreviewPanel />
          </div>
        </div>

        <div className="flex lg:hidden h-full">
          <Tabs defaultValue="form" className="flex flex-col w-full h-full">
            <TabsList className="mx-3 mt-2 shrink-0 grid grid-cols-2">
              <TabsTrigger value="form">Form</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="form" className="flex-1 overflow-hidden mt-2">
              <FormComponent />
            </TabsContent>
            <TabsContent value="preview" className="flex-1 overflow-hidden mt-2">
              <PreviewPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <PrintDocumentSource />

      <Toaster richColors position="bottom-right" />

      <OnboardingWalkthrough
        open={tutorialOpen}
        onOpenChange={setTutorialOpen}
        onComplete={handleTutorialComplete}
        documentType={documentType}
      />

      {interviewPanelOpen && <InterviewPanel />}
    </PageTransition>
  );
}
