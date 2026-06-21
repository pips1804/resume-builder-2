import { useState } from "react";
import { BriefcaseBusiness, FileText, Mail, ArrowRight, Lock, MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { StaggerItem } from "./motion";
import { InterviewAccessDialog } from "@/components/interview/InterviewAccessDialog";
import { useResumeStore } from "@/store/resumeStore";
import { isInterviewFeatureEnabled } from "@/lib/gemini";
import { cn } from "@/lib/utils";

const DOCUMENT_TYPES = [
  {
    id: "resume",
    name: "Resume",
    tagline: "Build your CV",
    desc: "Create a professional resume with multiple templates, sections, and live preview.",
    icon: FileText,
  },
  {
    id: "cover-letter",
    name: "Cover Letter",
    tagline: "Write your letter",
    desc: "Craft a tailored cover letter with e-signature support — print-ready or save as PDF.",
    icon: Mail,
  },
];

export function DocumentTypeSelector({ theme, onToggleTheme }) {
  const { chooseDocumentType } = useResumeStore();
  const [accessDialogOpen, setAccessDialogOpen] = useState(false);
  const showInterview = isInterviewFeatureEnabled();

  return (
    <div className="h-full bg-background flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between gap-2 px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">HireMePo 2.0</span>
        </div>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </div>

      <div className="text-center px-6 pt-10 pb-6 shrink-0 motion-section">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          What would you like to create?
        </h1>
        <p className="mt-3 text-muted-foreground text-base max-w-lg mx-auto">
          Choose a document type to get started. You can switch anytime by resetting
          from the navbar.
        </p>
      </div>

      <div className="flex-1 px-4 sm:px-8 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
          {DOCUMENT_TYPES.map((doc, index) => {
            const Icon = doc.icon;
            return (
              <StaggerItem key={doc.id} index={index}>
              <button
                type="button"
                onClick={() => chooseDocumentType(doc.id)}
                className={cn(
                  "w-full group rounded-2xl border-2 p-6 text-left transition-all duration-200",
                  "hover:shadow-lg hover:-translate-y-0.5 hover:border-primary/40 border-border"
                )}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg">{doc.name}</h3>
                <p className="text-xs text-primary font-medium mt-0.5">{doc.tagline}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{doc.desc}</p>
                <div className="flex items-center gap-1 text-sm font-medium text-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  Continue <ArrowRight className="h-4 w-4" />
                </div>
              </button>
              </StaggerItem>
            );
          })}
        </div>

        {showInterview && (
          <StaggerItem index={2} className="max-w-2xl mx-auto mt-6 w-full">
            <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-lg">Mock Interview Coach</h3>
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      <Lock className="h-3 w-3" />
                      Private
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Practice a 3-stage job interview with AI — pre-screening, initial,
                    and final rounds tailored to your target role.
                  </p>
                  <p className="text-xs text-muted-foreground/90 flex items-start gap-1.5 rounded-md bg-background/80 border px-3 py-2">
                    <Lock className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                    <span>
                      <strong className="font-medium text-foreground">Security code required.</strong>{" "}
                      This feature is private — enter your security code each time
                      you want to use the interview coach.
                    </span>
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-1 gap-2"
                    onClick={() => setAccessDialogOpen(true)}
                  >
                    <Sparkles className="h-4 w-4" />
                    Enter security code
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </StaggerItem>
        )}
      </div>

      <InterviewAccessDialog open={accessDialogOpen} onOpenChange={setAccessDialogOpen} />
    </div>
  );
}
