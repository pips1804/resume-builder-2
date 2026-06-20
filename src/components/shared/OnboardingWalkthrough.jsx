import { useState, useEffect } from "react";
import {
  Sparkles,
  PenLine,
  Eye,
  Settings2,
  FileJson,
  Download,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useResumeStore } from "@/store/resumeStore";
import { AnimatedStep } from "@/components/shared/motion";
import { cn } from "@/lib/utils";

const TEMPLATE_LABELS = {
  classic: "Classic",
  "classic-photo": "Classic + Photo",
  modern: "Modern",
  minimal: "Minimal",
};

function getSteps(isCoverLetter) {
  return [
    {
      icon: Sparkles,
      title: "Welcome to HireMePo 2.0!",
      description: isCoverLetter
        ? "You're ready to write your cover letter. This quick tour shows you where everything is — it only takes a minute."
        : "You're ready to build your resume. This quick tour shows you where everything is — it only takes a minute.",
      detail: null,
    },
    {
      icon: PenLine,
      title: "Fill in your details",
      description: isCoverLetter
        ? "Enter your contact info, the recipient, letter body, and optional e-signature in the form sections."
        : "Use the form on the left to enter your personal info, work experience, education, skills, and more.",
      detail:
        "On phones and tablets, switch to the **Form** tab at the top. Your progress is saved automatically as you type.",
    },
    {
      icon: Eye,
      title: "Live preview",
      description:
        "Every change appears instantly in the preview panel on the right — what you see is what you'll export.",
      detail: isCoverLetter
        ? "On smaller screens, tap the **Preview** tab to see your letter update in real time."
        : "On smaller screens, tap the **Preview** tab to see your resume update in real time.",
    },
    {
      icon: Settings2,
      title: "Customize your design",
      description: isCoverLetter
        ? "Open **Customize** to change paper size, accent color, fonts, and margins."
        : "Open **Customize** to change paper size, accent color, fonts, margins, and drag sections to reorder them.",
      detail: "You can also switch templates anytime from the Customize panel.",
    },
    {
      icon: FileJson,
      title: "Save & import drafts",
      description:
        "Use **Save Draft** to download a backup `.json` file. **Import** restores a saved draft on this or another device.",
      detail:
        "Tap the **?** help icon in the navbar for a plain-English explanation of JSON drafts.",
    },
    {
      icon: Download,
      title: isCoverLetter ? "Download your letter" : "Download your resume",
      description:
        "Click **Download PDF** when you're done. Choose \"Save as PDF\" in the print dialog and turn off headers/footers for a clean file.",
      detail: "Keyboard shortcut: **Ctrl+P** (or **Cmd+P** on Mac).",
    },
    {
      icon: CheckCircle2,
      title: "You're all set!",
      description: isCoverLetter
        ? "Start with your header and recipient, write your letter, then add a signature or print and sign by hand."
        : "Start with your name and job title, then work through each section. Your draft stays in the browser until you clear it.",
      detail: "You can replay this tour anytime from the **?** help menu.",
    },
  ];
}

function renderDetail(text) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p className="text-xs text-muted-foreground leading-relaxed mt-3 rounded-md bg-muted/50 px-3 py-2.5">
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i}>{part.slice(2, -2)}</strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
  );
}

export function OnboardingWalkthrough({ open, onOpenChange, onComplete, documentType }) {
  const { resume, coverLetter } = useResumeStore();
  const isCoverLetter = documentType === "cover-letter";
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  const CL_TEMPLATE_LABELS = { professional: "Professional", modern: "Modern" };
  const templateLabel = isCoverLetter
    ? CL_TEMPLATE_LABELS[coverLetter.meta.template] || "Professional"
    : TEMPLATE_LABELS[resume.meta.template] || "Classic";
  const STEPS = getSteps(isCoverLetter);
  const current = STEPS[step];
  const Icon = current.icon;
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  function handleDismiss() {
    setStep(0);
    onOpenChange(false);
    onComplete?.();
  }

  function handleNext() {
    if (isLast) handleDismiss();
    else setStep((s) => s + 1);
  }

  function handleBack() {
    setStep((s) => Math.max(0, s - 1));
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleDismiss();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-md sm:max-w-lg">
        <AnimatedStep stepKey={step}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Step {step + 1} of {STEPS.length}
              </p>
              <DialogTitle className="text-lg mt-0.5">{current.title}</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-left text-sm leading-relaxed pt-1">
            {step === 0
              ? `Your ${templateLabel} ${isCoverLetter ? "layout" : "template"} is ready. ${current.description}`
              : current.description}
          </DialogDescription>
          {renderDetail(current.detail)}
        </DialogHeader>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 py-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>
        </AnimatedStep>

        <DialogFooter className="flex-row justify-between sm:justify-between gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={handleDismiss}
          >
            Skip tour
          </Button>
          <div className="flex gap-2">
            {!isFirst && (
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4 mr-0.5" />
                Back
              </Button>
            )}
            <Button size="sm" onClick={handleNext}>
              {isLast ? (
                <>
                  Get started
                  <CheckCircle2 className="h-4 w-4 ml-1" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
