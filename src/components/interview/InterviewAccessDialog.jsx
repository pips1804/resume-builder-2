import { useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useInterviewStore } from "@/store/interviewStore";
import { isGeminiConfigured, isInterviewFeatureEnabled } from "@/lib/gemini";
import { toast } from "sonner";

export function InterviewAccessDialog({ open, onOpenChange }) {
  const [code, setCode] = useState("");
  const verifyAccessAndOpen = useInterviewStore((s) => s.verifyAccessAndOpen);

  if (!isInterviewFeatureEnabled()) return null;

  function handleUnlock(e) {
    e.preventDefault();
    if (!isGeminiConfigured()) {
      toast.error("Add VITE_GEMINI_API_KEY to .env.local first.");
      return;
    }
    if (verifyAccessAndOpen(code)) {
      toast.success("Access granted — opening interview coach.");
      setCode("");
      onOpenChange(false);
    } else {
      toast.error("Invalid access code.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Private access
          </DialogTitle>
          <DialogDescription>
            Enter your security code to open the mock interview coach. You will be
            asked for it again each time you use this feature.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUnlock} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="interview-code">Access code</Label>
            <Input
              id="interview-code"
              type="password"
              autoComplete="off"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Your private code"
            />
          </div>
          {!isGeminiConfigured() && (
            <p className="text-xs text-amber-600 dark:text-amber-400">
              Set <code className="text-xs">VITE_GEMINI_API_KEY</code> in{" "}
              <code className="text-xs">.env.local</code> to enable AI interviews.
            </p>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Unlock</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}