import { useResumeStore } from "@/store/resumeStore";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

function wordCount(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function SummaryForm() {
  const { resume, updateSummary } = useResumeStore();
  const count = wordCount(resume.summary);
  const isGood = count >= 50 && count <= 200;

  return (
    <div className="space-y-2">
      <Label htmlFor="summary">Professional Summary / Profile</Label>
      <Textarea
        id="summary"
        placeholder="Fresh graduate in Communication with experience as an admin and multimedia staff…"
        rows={6}
        value={resume.summary}
        onChange={(e) => updateSummary(e.target.value)}
        className="resize-y"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Tip: Use keywords from the job description here.</span>
        <span className={isGood ? "text-green-600" : "text-amber-500"}>
          {count} words {count > 0 && (isGood ? "✓" : "(aim for 50–200)")}
        </span>
      </div>
    </div>
  );
}
