import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignaturePad } from "./SignaturePad";
import {
  SIGNATURE_MODAL_DISPLAY_WIDTH,
  SIGNATURE_MODAL_DISPLAY_HEIGHT,
} from "@/lib/signatureConstants";

export function SignaturePadModal({ open, onOpenChange, initialImage, onSave }) {
  function handleSave(dataUrl) {
    onSave(dataUrl);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Draw your signature</DialogTitle>
          <DialogDescription>
            Use your mouse or finger on the large pad below. The background stays
            transparent so your signature can overlap your printed name.
          </DialogDescription>
        </DialogHeader>

        <SignaturePad
          variant="modal"
          displayWidth={SIGNATURE_MODAL_DISPLAY_WIDTH}
          displayHeight={SIGNATURE_MODAL_DISPLAY_HEIGHT}
          initialImage={initialImage}
          onSave={handleSave}
        />

        <DialogFooter className="sm:justify-start">
          <p className="text-xs text-muted-foreground">
            Tip: After saving, resize your signature on the document preview by
            dragging its corner.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
