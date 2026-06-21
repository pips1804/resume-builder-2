import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Briefcase, Building2, Loader2, MessageSquare, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useInterviewStore } from "@/store/interviewStore";
import { useResumeStore } from "@/store/resumeStore";
import { INTERVIEW_STAGES, COACHING_MODES } from "@/types/interview";
import { cn } from "@/lib/utils";

function StageProgress({ stageIndex, phase }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {INTERVIEW_STAGES.map((stage, i) => (
        <Badge
          key={stage.id}
          variant={i === stageIndex && phase !== "complete" ? "default" : "outline"}
          className={cn(
            "text-[10px] sm:text-xs",
            i < stageIndex && "bg-primary/10"
          )}
        >
          {stage.shortLabel}
        </Badge>
      ))}
      {phase === "complete" && (
        <Badge className="text-[10px] sm:text-xs bg-green-600">Done</Badge>
      )}
    </div>
  );
}

function CoachingContent({ content }) {
  const sections = content.split(/(?=^## )/m).filter(Boolean);

  if (sections.length <= 1) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  return (
    <div className="space-y-3">
      {sections.map((block) => {
        const lines = block.trim().split("\n");
        const heading = lines[0]?.replace(/^##\s*/, "").trim();
        const body = lines.slice(1).join("\n").trim();
        const isSample = /sample answer/i.test(heading);

        return (
          <div key={heading}>
            <p
              className={cn(
                "text-[10px] font-semibold uppercase tracking-wide mb-1",
                isSample
                  ? "text-emerald-700 dark:text-emerald-400"
                  : "text-amber-700 dark:text-amber-400"
              )}
            >
              {heading}
            </p>
            <div
              className={cn(
                "whitespace-pre-wrap text-sm",
                isSample &&
                  "rounded-md bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 px-2.5 py-2 italic"
              )}
            >
              {body}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChatMessage({ message }) {
  const isUser = message.role === "user";
  const isSystem = message.type === "system";
  const isCoaching = message.type === "coaching";
  const isFeedback = message.type === "feedback" || message.type === "final-report";

  return (
    <div
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[92%] sm:max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser && "bg-primary text-primary-foreground rounded-br-md",
          !isUser && !isCoaching && !isFeedback && !isSystem && "bg-muted rounded-bl-md",
          isSystem && "bg-muted/60 text-muted-foreground text-xs italic w-full max-w-full text-center",
          isCoaching && "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-bl-md",
          isFeedback && "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 w-full max-w-full rounded-xl"
        )}
      >
        {isCoaching && (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400 mb-1.5">
            Coach feedback
          </p>
        )}
        {isFeedback && (
          <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400 mb-1.5">
            {message.type === "final-report" ? "Final report" : "Stage feedback"}
          </p>
        )}
        {isCoaching ? (
          <CoachingContent content={message.content} />
        ) : (
          <div className="whitespace-pre-wrap">{message.content}</div>
        )}
      </div>
    </div>
  );
}

function InterviewSetup() {
  const jobPosition = useInterviewStore((s) => s.jobPosition);
  const company = useInterviewStore((s) => s.company);
  const coachingMode = useInterviewStore((s) => s.coachingMode);
  const useResumeContext = useInterviewStore((s) => s.useResumeContext);
  const loading = useInterviewStore((s) => s.loading);
  const error = useInterviewStore((s) => s.error);
  const setSetup = useInterviewStore((s) => s.setSetup);
  const startInterview = useInterviewStore((s) => s.startInterview);
  const resume = useResumeStore((s) => s.resume);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-lg mx-auto w-full space-y-5">
      <div className="text-center space-y-1">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-bold">Mock Job Interview</h2>
        <p className="text-sm text-muted-foreground">
          Three rounds powered by Gemini — tailored to your target role. After each
          answer, the coach shows feedback and a sample answer you can learn from.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="job-position">Job position *</Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="job-position"
              className="pl-9"
              placeholder="e.g. Marketing Specialist"
              value={jobPosition}
              onChange={(e) => setSetup({ jobPosition: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="company">Company (optional)</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="company"
              className="pl-9"
              placeholder="e.g. Acme Corporation"
              value={company}
              onChange={(e) => setSetup({ company: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Coaching mode</Label>
          {Object.values(COACHING_MODES).map((mode) => (
            <button
              key={mode.id}
              type="button"
              onClick={() => setSetup({ coachingMode: mode.id })}
              className={cn(
                "w-full text-left rounded-lg border p-3 transition-colors",
                coachingMode === mode.id
                  ? "border-primary bg-primary/5"
                  : "hover:bg-muted/50"
              )}
            >
              <p className="text-sm font-medium">{mode.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{mode.description}</p>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <p className="text-sm font-medium">Use my resume as context</p>
            <p className="text-xs text-muted-foreground">
              AI tailors questions to your experience
            </p>
          </div>
          <Switch
            checked={useResumeContext}
            onCheckedChange={(v) => setSetup({ useResumeContext: v })}
          />
        </div>

        <div className="rounded-lg bg-muted/50 p-3 space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Interview stages
          </p>
          {INTERVIEW_STAGES.map((s) => (
            <div key={s.id} className="text-xs">
              <span className="font-medium">{s.label}</span>
              <span className="text-muted-foreground"> — {s.questionCount} questions</span>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
          {error}
        </p>
      )}

      <Button
        type="button"
        className="w-full"
        size="lg"
        disabled={!jobPosition.trim() || loading}
        onClick={() => startInterview(resume)}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Preparing…
          </>
        ) : (
          "Start interview"
        )}
      </Button>
    </div>
  );
}

export function InterviewPanel({ onClose }) {
  const {
    phase,
    messages,
    loading,
    error,
    awaitingAnswer,
    stageIndex,
    submitAnswer,
    continueAfterFeedback,
    resetSession,
    retryAfterError,
    closePanel,
  } = useInterviewStore();
  const resume = useResumeStore((s) => s.resume);
  const [draft, setDraft] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function handleClose() {
    closePanel();
    onClose?.();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    submitAnswer(draft, resume);
    setDraft("");
  }

  return (
    <div className="fixed inset-0 z-[60] bg-background flex flex-col">
      <header className="shrink-0 border-b px-3 sm:px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={handleClose} aria-label="Close">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-sm sm:text-base truncate flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-primary shrink-0" />
            Interview Coach
          </h1>
          {phase !== "setup" && (
            <div className="mt-1">
              <StageProgress stageIndex={stageIndex} phase={phase} />
            </div>
          )}
        </div>
        {phase !== "setup" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetSession();
              setDraft("");
            }}
          >
            New session
          </Button>
        )}
      </header>

      {phase === "setup" ? (
        <InterviewSetup />
      ) : (
        <>
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 min-h-0">
            {messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Interviewer is thinking…
              </div>
            )}
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-md p-3">
                {error}
              </p>
            )}
            <div ref={chatEndRef} />
          </div>

          <footer className="shrink-0 border-t p-3 sm:p-4 bg-background">
            {error && !loading && !awaitingAnswer && phase === "interview" && (
              <Button
                className="w-full mb-3"
                variant="outline"
                onClick={() => retryAfterError(resume)}
              >
                Try again
              </Button>
            )}
            {phase === "stage-feedback" && !loading && (
              <Button className="w-full mb-3" onClick={() => continueAfterFeedback(resume)}>
                Continue to next stage
              </Button>
            )}
            {phase === "complete" && (
              <p className="text-center text-sm text-muted-foreground mb-3">
                Interview complete. Review your feedback above or start a new session.
              </p>
            )}
            {phase === "interview" && (
              <form onSubmit={handleSubmit} className="flex gap-2 items-end max-w-3xl mx-auto">
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={
                    awaitingAnswer
                      ? "Type your answer…"
                      : "Waiting for the next question…"
                  }
                  disabled={!awaitingAnswer || loading}
                  rows={2}
                  className="resize-none min-h-[44px] max-h-32"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0 h-11 w-11"
                  disabled={!awaitingAnswer || loading || !draft.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            )}
          </footer>
        </>
      )}
    </div>
  );
}
