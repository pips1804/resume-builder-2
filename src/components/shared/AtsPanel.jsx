import { useResumeStore } from "@/store/resumeStore";
import { computeAtsScore } from "@/lib/atsScore";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AtsPanel() {
  const { resume } = useResumeStore();
  const { score, checks } = computeAtsScore(resume);
  const [open, setOpen] = useState(false);

  const color =
    score >= 80
      ? "text-green-600"
      : score >= 50
      ? "text-amber-500"
      : "text-red-500";

  const barColor =
    score >= 80
      ? "bg-green-500"
      : score >= 50
      ? "bg-amber-400"
      : "bg-red-500";

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">ATS Score</span>
          <span className={cn("text-xl font-bold tabular-nums", color)}>
            {score}/100
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", barColor)}
              style={{ width: `${score}%` }}
            />
          </div>
          {open ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2 border-t">
          <p className="text-xs text-muted-foreground pt-3">
            Resume health check — complete each item to improve your score.
          </p>
          {checks.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              {c.pass ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
              )}
              <span
                className={cn(
                  "text-xs",
                  c.pass ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {c.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
