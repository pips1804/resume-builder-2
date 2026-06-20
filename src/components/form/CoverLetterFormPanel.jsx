import { useState } from "react";
import { Plus, Trash2, Upload, X, PenLine } from "lucide-react";
import { useResumeStore } from "@/store/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SignaturePadModal } from "./SignaturePadModal";
import { SignaturePlacementControls } from "./SignaturePlacementControls";
import { SignatureBlock } from "@/components/preview/SignatureBlock";
import { AnimatedSection } from "@/components/shared/motion";
import { useTouchSignatureControls } from "@/hooks/useTouchSignatureControls";
import { toast } from "sonner";
import {
  SIGNATURE_WIDTH,
  SIGNATURE_HEIGHT,
} from "@/lib/signatureConstants";

const SECTIONS = [
  { id: "sender", label: "Your Information" },
  { id: "letter", label: "Letter Content" },
  { id: "signature", label: "Signature" },
];

function Field({ label, id, ...props }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

export function CoverLetterFormPanel() {
  const [active, setActive] = useState("sender");
  const [sigMode, setSigMode] = useState("upload");
  const [drawModalOpen, setDrawModalOpen] = useState(false);
  const {
    coverLetter,
    updateCoverLetterSender,
    updateCoverLetterLetter,
    addCoverLetterBullet,
    updateCoverLetterBullet,
    removeCoverLetterBullet,
  } = useResumeStore();

  const { sender, letter } = coverLetter;
  const touchPlacement = useTouchSignatureControls();

  function applySignature(dataUrl) {
    updateCoverLetterLetter({
      signature: dataUrl,
      signatureWidth: SIGNATURE_WIDTH,
      signatureHeight: SIGNATURE_HEIGHT,
      signatureOffsetX: 0,
      signatureOffsetY: 0,
    });
  }

  function handleSignatureUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "image/png") {
      toast.error("Please upload a PNG file (transparent background recommended).");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => applySignature(ev.target.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="flex h-full overflow-hidden border-r">
      <aside className="hidden lg:flex w-44 shrink-0 border-r flex-col gap-0.5 p-2">
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              active === s.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {s.label}
          </button>
        ))}
      </aside>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div className="lg:hidden flex gap-2 flex-wrap">
          {SECTIONS.map((s) => (
            <Button
              key={s.id}
              size="sm"
              variant={active === s.id ? "default" : "outline"}
              onClick={() => setActive(s.id)}
            >
              {s.label}
            </Button>
          ))}
        </div>

        <AnimatedSection sectionKey={active}>
        {active === "sender" && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold">Your Information</h2>
            <Field
              label="Full Name"
              id="cl-name"
              value={sender.fullName}
              onChange={(e) => updateCoverLetterSender({ fullName: e.target.value })}
            />
            <div className="space-y-1.5">
              <Label htmlFor="cl-address">Address</Label>
              <Input
                id="cl-address"
                value={sender.address}
                onChange={(e) => updateCoverLetterSender({ address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Phone"
                id="cl-phone"
                value={sender.phone}
                onChange={(e) => updateCoverLetterSender({ phone: e.target.value })}
              />
              <Field
                label="Email"
                id="cl-email"
                type="email"
                value={sender.email}
                onChange={(e) => updateCoverLetterSender({ email: e.target.value })}
              />
            </div>
          </div>
        )}

        {active === "letter" && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold">Letter Content</h2>
            <Field
              label="Date"
              id="cl-date"
              type="date"
              value={letter.date}
              onChange={(e) => updateCoverLetterLetter({ date: e.target.value })}
            />
            <Field
              label="Position You're Applying For"
              id="cl-job"
              value={letter.jobTitle}
              onChange={(e) => updateCoverLetterLetter({ jobTitle: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field
                label="Recipient Name"
                id="cl-recipient"
                value={letter.recipientName}
                onChange={(e) => updateCoverLetterLetter({ recipientName: e.target.value })}
              />
              <Field
                label="Company"
                id="cl-company"
                value={letter.recipientCompany}
                onChange={(e) => updateCoverLetterLetter({ recipientCompany: e.target.value })}
              />
            </div>
            <Field
              label="Salutation"
              id="cl-salutation"
              placeholder="Dear Hiring Manager,"
              value={letter.salutation}
              onChange={(e) => updateCoverLetterLetter({ salutation: e.target.value })}
            />
            <div className="space-y-1.5">
              <Label htmlFor="cl-body">Letter Body</Label>
              <Textarea
                id="cl-body"
                rows={10}
                className="resize-y min-h-[200px]"
                value={letter.body}
                onChange={(e) => updateCoverLetterLetter({ body: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Separate paragraphs with a blank line.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Key highlights (optional bullets)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCoverLetterBullet}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {letter.bullets.map((b) => (
                <div key={b.id} className="flex gap-2">
                  <Input
                    value={b.text}
                    onChange={(e) => updateCoverLetterBullet(b.id, e.target.value)}
                    placeholder="Achievement or highlight"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeCoverLetterBullet(b.id)}
                    aria-label="Remove bullet"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>

            <Field
              label="Closing"
              id="cl-closing"
              value={letter.closing}
              onChange={(e) => updateCoverLetterLetter({ closing: e.target.value })}
            />
          </div>
        )}

        {active === "signature" && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold">E-Signature</h2>
            <p className="text-sm text-muted-foreground">
              Upload a transparent PNG, draw your signature, or leave it blank to
              sign by hand after printing.
            </p>

            <div className="rounded-lg border p-4 bg-muted/30 space-y-4">
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
                  Preview
                </p>
                <div className="bg-white rounded-md border p-4 inline-block">
                  <p className="text-sm mb-0">{letter.closing || "Sincerely,"}</p>
                  <SignatureBlock
                    signature={letter.signature}
                    fullName={sender.fullName || "Your Name"}
                    width={letter.signatureWidth ?? SIGNATURE_WIDTH}
                    height={letter.signatureHeight ?? SIGNATURE_HEIGHT}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={sigMode === "upload" ? "default" : "outline"}
                  onClick={() => setSigMode("upload")}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload PNG
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={sigMode === "draw" ? "default" : "outline"}
                  onClick={() => setSigMode("draw")}
                >
                  <PenLine className="h-4 w-4 mr-1" />
                  Draw signature
                </Button>
              </div>

              {sigMode === "upload" && (
                <div className="space-y-2">
                  <label htmlFor="cl-signature">
                    <Button variant="outline" size="sm" asChild>
                      <span className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-1.5" />
                        Choose PNG file
                      </span>
                    </Button>
                    <input
                      id="cl-signature"
                      type="file"
                      accept="image/png"
                      className="hidden"
                      onChange={handleSignatureUpload}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    PNG with a transparent background works best — your signature will
                    overlap your printed name.
                    {touchPlacement
                      ? " Adjust position and size with the sliders below, or on the Preview tab."
                      : " Resize on the document preview by dragging the blue corner, and move it by dragging the signature."}
                  </p>
                </div>
              )}

              {sigMode === "draw" && (
                <div className="space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setDrawModalOpen(true)}
                  >
                    <PenLine className="h-4 w-4 mr-1" />
                    {letter.signature ? "Edit signature" : "Open drawing pad"}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Opens a large drawing pad. After saving, use the sliders below
                    {touchPlacement ? " or on the Preview tab" : ""} to position your
                    signature.
                  </p>
                  <SignaturePadModal
                    open={drawModalOpen}
                    onOpenChange={setDrawModalOpen}
                    initialImage={letter.signature}
                    onSave={applySignature}
                  />
                </div>
              )}

              {letter.signature && touchPlacement && (
                <SignaturePlacementControls className="lg:hidden" />
              )}

              {letter.signature && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                  onClick={() =>
                    updateCoverLetterLetter({
                      signature: null,
                      signatureWidth: SIGNATURE_WIDTH,
                      signatureHeight: SIGNATURE_HEIGHT,
                      signatureOffsetX: 0,
                      signatureOffsetY: 0,
                    })
                  }
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove signature
                </Button>
              )}
            </div>
          </div>
        )}
        </AnimatedSection>
      </div>
    </div>
  );
}
