import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw } from "lucide-react";
import { useResumeStore } from "@/store/resumeStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  SIGNATURE_WIDTH,
  SIGNATURE_HEIGHT,
} from "@/lib/signatureConstants";
import {
  clampSignatureOffset,
  getDefaultSignaturePlacement,
  getSignaturePlacementBounds,
  resizeSignatureKeepingAspect,
} from "@/lib/signaturePlacement";
import { cn } from "@/lib/utils";

const NUDGE = 8;

function RangeRow({ id, label, value, min, max, onChange, suffix }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id} className="text-xs font-medium">
          {label}
        </Label>
        <span className="text-xs text-muted-foreground tabular-nums">
          {value}
          {suffix ?? "px"}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 accent-primary cursor-pointer touch-none"
      />
    </div>
  );
}

export function SignaturePlacementControls({ className, compact = false }) {
  const { coverLetter, updateCoverLetterLetter } = useResumeStore();
  const { letter, meta } = coverLetter;

  if (!letter.signature) return null;

  const width = letter.signatureWidth ?? SIGNATURE_WIDTH;
  const height = letter.signatureHeight ?? SIGNATURE_HEIGHT;
  const offsetX = letter.signatureOffsetX ?? 0;
  const offsetY = letter.signatureOffsetY ?? 0;
  const bounds = getSignaturePlacementBounds(letter, meta);

  function nudge(dx, dy) {
    updateCoverLetterLetter(
      clampSignatureOffset(offsetX + dx, offsetY + dy, letter, meta)
    );
  }

  function resetPlacement() {
    updateCoverLetterLetter(getDefaultSignaturePlacement());
  }

  return (
    <div
      className={cn(
        "rounded-lg border bg-background shadow-sm space-y-3",
        compact ? "p-3" : "p-4",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Position & size</p>
        <Button type="button" variant="ghost" size="sm" onClick={resetPlacement}>
          <RotateCcw className="h-3.5 w-3.5 mr-1" />
          Reset
        </Button>
      </div>

      <RangeRow
        id="sig-size"
        label="Size"
        value={width}
        min={bounds.minWidth}
        max={bounds.maxWidth}
        onChange={(nextW) =>
          updateCoverLetterLetter(resizeSignatureKeepingAspect(width, height, nextW))
        }
      />

      <RangeRow
        id="sig-x"
        label="Horizontal"
        value={offsetX}
        min={bounds.minX}
        max={bounds.maxX}
        onChange={(x) =>
          updateCoverLetterLetter(clampSignatureOffset(x, offsetY, letter, meta))
        }
      />

      <RangeRow
        id="sig-y"
        label="Vertical"
        value={offsetY}
        min={bounds.minY}
        max={bounds.maxY}
        onChange={(y) =>
          updateCoverLetterLetter(clampSignatureOffset(offsetX, y, letter, meta))
        }
      />

      <div className="space-y-1.5">
        <Label className="text-xs font-medium">Fine-tune</Label>
        <div className="grid grid-cols-3 gap-1 max-w-[140px] mx-auto">
          <span />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 touch-manipulation"
            aria-label="Nudge signature up"
            onClick={() => nudge(0, -NUDGE)}
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <span />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 touch-manipulation"
            aria-label="Nudge signature left"
            onClick={() => nudge(-NUDGE, 0)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="h-9 w-9 rounded-md bg-muted/50" aria-hidden />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 touch-manipulation"
            aria-label="Nudge signature right"
            onClick={() => nudge(NUDGE, 0)}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
          <span />
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 touch-manipulation"
            aria-label="Nudge signature down"
            onClick={() => nudge(0, NUDGE)}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
          <span />
        </div>
      </div>
    </div>
  );
}
