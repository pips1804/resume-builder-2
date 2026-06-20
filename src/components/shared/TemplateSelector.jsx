import { useState, useRef } from "react";
import { BriefcaseBusiness, ArrowRight, CheckCircle2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { ImportDraftDialog } from "./ImportDraftDialog";
import { StaggerItem } from "./motion";
import { useResumeStore } from "@/store/resumeStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Mini template previews (stylized SVG-like HTML thumbnails) ────────────────

function ClassicPreview({ accent = "#1a1a1a" }) {
  return (
    <div className="w-full h-full bg-white p-2 text-left" style={{ fontFamily: "Georgia, serif" }}>
      {/* Name block — centered */}
      <div className="text-center mb-1.5">
        <div className="font-bold text-[7px] uppercase tracking-widest text-gray-900">JANE DOE</div>
        <div className="text-[5.5px] text-gray-500">Software Engineer</div>
        <div className="text-[5px] text-gray-400 mt-0.5">jane@email.com | 555-1234 | linkedin.com</div>
      </div>
      {/* Section */}
      {[["EXPERIENCE", [["Acme Corp", "2021–Now"], ["Tech Inc", "2019–2021"]]], ["EDUCATION", [["MIT", "BS Computer Science"]]], ["SKILLS", null]].map(([heading, items]) => (
        <div key={heading} className="mb-1.5">
          <div className="text-[5.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: accent }}>{heading}</div>
          <div className="h-px mb-1" style={{ backgroundColor: accent, opacity: 0.7 }} />
          {items ? items.map(([a, b]) => (
            <div key={a} className="flex justify-between">
              <span className="text-[5px] font-bold text-gray-800">{a}</span>
              <span className="text-[5px] text-gray-400">{b}</span>
            </div>
          )) : (
            <div className="text-[5px] text-gray-600">JavaScript • React • Node.js • Python</div>
          )}
        </div>
      ))}
    </div>
  );
}

function ModernPreview({ accent = "#2563eb" }) {
  return (
    <div className="w-full h-full bg-white p-2 text-left" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Name block — left aligned */}
      <div className="mb-2">
        <div className="font-bold text-[9px] text-gray-900 leading-tight">Jane Doe</div>
        <div className="text-[5.5px] font-medium mb-0.5" style={{ color: accent }}>Software Engineer</div>
        <div className="text-[5px] text-gray-400">jane@email.com · 555-1234 · linkedin.com</div>
      </div>
      {/* Sections */}
      {[["EXPERIENCE", true], ["EDUCATION", true], ["SKILLS", false]].map(([heading, hasEntries]) => (
        <div key={heading} className="mb-1.5">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-[5px] font-bold uppercase tracking-widest" style={{ color: accent }}>{heading}</span>
            <div className="flex-1 h-px" style={{ backgroundColor: accent, opacity: 0.25 }} />
          </div>
          {hasEntries ? (
            <div>
              <div className="flex justify-between">
                <span className="text-[5.5px] font-bold text-gray-900">Acme Corp</span>
                <span className="text-[5px] text-gray-400">2021–Now</span>
              </div>
              <div className="text-[5px] font-medium mb-0.5" style={{ color: accent }}>Engineer II</div>
              <div className="text-[5px] text-gray-500">• Built scalable APIs</div>
            </div>
          ) : (
            <div className="text-[5px] text-gray-600">JavaScript · React · Node.js · Python</div>
          )}
        </div>
      ))}
    </div>
  );
}

function MinimalPreview({ accent = "#1a1a1a" }) {
  return (
    <div className="w-full h-full bg-white p-2 text-left" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Name — light weight, left */}
      <div className="mb-2">
        <div className="text-[9px] font-light text-gray-800 tracking-wide leading-tight">Jane Doe</div>
        <div className="text-[5.5px] text-gray-400 mt-0.5">Software Engineer</div>
        <div className="text-[5px] text-gray-300 mt-0.5">jane@email.com  ·  555-1234</div>
      </div>
      {/* Sections — minimal, no heavy dividers */}
      {[["E X P E R I E N C E", true], ["E D U C A T I O N", false], ["S K I L L S", false]].map(([heading, hasEntries]) => (
        <div key={heading} className="mb-2">
          <div className="text-[4.5px] font-semibold tracking-widest text-gray-300 uppercase mb-0.5">{heading}</div>
          <div className="h-px bg-gray-100 mb-1" />
          {hasEntries ? (
            <div>
              <div className="flex justify-between">
                <span className="text-[5.5px] font-semibold text-gray-700">Acme Corp</span>
                <span className="text-[5px] text-gray-300">2021–Now</span>
              </div>
              <div className="text-[5px] text-gray-400 mb-0.5">Engineer II</div>
              <div className="text-[5px] text-gray-400">– Built scalable APIs and services</div>
            </div>
          ) : heading.includes("SKILL") ? (
            <div className="text-[5px] text-gray-400">JavaScript  ·  React  ·  Node.js</div>
          ) : (
            <div>
              <div className="text-[5.5px] font-semibold text-gray-700">MIT</div>
              <div className="text-[5px] text-gray-400">BS Computer Science  ·  2019</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ClassicPhotoPreview({ accent = "#1a1a1a" }) {
  return (
    <div className="w-full h-full bg-white p-2 text-left" style={{ fontFamily: "Georgia, serif" }}>
      <div className="flex items-start justify-between gap-1 mb-1">
        <div className="flex-1 min-w-0 text-left">
          <div className="font-bold text-[7px] uppercase tracking-widest" style={{ color: accent }}>JANE DOE</div>
          <div className="text-[5.5px] font-bold text-gray-900 uppercase">Software Engineer</div>
          <div className="text-[5px] text-gray-500 mt-0.5">New York, NY | 555-1234 | jane@email.com</div>
        </div>
        <div className="w-9 h-9 shrink-0 rounded-sm bg-gray-200 border border-gray-300" />
      </div>
      <div className="h-px mb-1.5" style={{ backgroundColor: accent, opacity: 0.8 }} />
      {[["EXPERIENCE", [["Acme Corp", "2021–Now"]]], ["EDUCATION", [["MIT", "BS CS"]]], ["SKILLS", null]].map(([heading, items]) => (
        <div key={heading} className="mb-1.5">
          <div className="text-[5.5px] font-bold uppercase tracking-wider mb-0.5" style={{ color: accent }}>{heading}</div>
          <div className="h-px mb-1" style={{ backgroundColor: accent, opacity: 0.7 }} />
          {items ? items.map(([a, b]) => (
            <div key={a} className="flex justify-between">
              <span className="text-[5px] font-bold text-gray-800">{a}</span>
              <span className="text-[5px] text-gray-400">{b}</span>
            </div>
          )) : (
            <div className="text-[5px] text-gray-600">JavaScript • React • Node.js</div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── Template definitions ──────────────────────────────────────────────────────

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    tagline: "Timeless & ATS-safe",
    desc: "Traditional serif design with centered header and full-width section dividers. Perfect for academic, legal, and corporate roles.",
    accentDefault: "#1a1a1a",
    Preview: ClassicPreview,
    tags: ["Serif", "Centered", "Traditional"],
  },
  {
    id: "classic-photo",
    name: "Classic + Photo",
    tagline: "Classic with profile photo",
    desc: "Same timeless serif layout as Classic, with an optional profile photo at the top right of the header.",
    accentDefault: "#1a1a1a",
    Preview: ClassicPhotoPreview,
    tags: ["Serif", "Photo", "Traditional"],
  },
  {
    id: "modern",
    name: "Modern",
    tagline: "Bold & contemporary",
    desc: "Clean sans-serif with accent-colored headings and a sleek inline-rule style. Great for tech, design, and startup environments.",
    accentDefault: "#2563eb",
    Preview: ModernPreview,
    tags: ["Sans-serif", "Accent color", "Sleek"],
  },
  {
    id: "minimal",
    name: "Minimal",
    tagline: "Clean & distraction-free",
    desc: "Generous whitespace, light typography, and subtle dividers. Ideal for creative, academic, and senior-level professionals.",
    accentDefault: "#1a1a1a",
    Preview: MinimalPreview,
    tags: ["Light weight", "Whitespace", "Elegant"],
  },
];

const COVER_LETTER_TEMPLATES = [
  {
    id: "professional",
    name: "Professional",
    tagline: "Classic business letter",
    desc: "Centered header with double rule, accent recipient line, and signature area — matches standard cover letter format.",
    accentDefault: "#1e3a5f",
    Preview: ProfessionalCLPreview,
    tags: ["Centered", "Formal", "E-sign"],
  },
  {
    id: "modern",
    name: "Modern",
    tagline: "Clean left-aligned",
    desc: "Left-aligned header with accent color and a minimal rule. Great for tech, creative, and startup applications.",
    accentDefault: "#2563eb",
    Preview: ModernCLPreview,
    tags: ["Sans-serif", "Left-aligned", "E-sign"],
  },
];

function ProfessionalCLPreview({ accent = "#1e3a5f" }) {
  return (
    <div className="w-full h-full bg-white p-2 text-left" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="relative text-center mb-1">
        <div className="absolute right-0 top-0 text-[4px] text-gray-500">Jun 25, 2022</div>
        <div className="font-bold text-[8px] text-gray-900">JANE DOE</div>
        <div className="text-[4.5px] text-gray-500 mt-0.5">123 St | 555-1234 | jane@email.com</div>
      </div>
      <div className="border-t-2 border-gray-900 mb-px" />
      <div className="border-t border-gray-900 mb-1" />
      <div className="text-[5.5px] font-bold text-center mb-1.5">Marketing Manager</div>
      <div className="flex items-center gap-1 mb-1.5">
        <span className="text-[5px] font-semibold" style={{ color: accent }}>To Hannah - Acme</span>
        <div className="flex-1 h-px" style={{ backgroundColor: accent, opacity: 0.4 }} />
      </div>
      <div className="text-[4.5px] text-gray-600 space-y-1">
        <p>Dear Hannah,</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
        <p className="pt-2">Sincerely,</p>
        <div className="h-3 border-b border-gray-300 w-12" />
        <p className="font-semibold">Jane Doe</p>
      </div>
    </div>
  );
}

function ModernCLPreview({ accent = "#2563eb" }) {
  return (
    <div className="w-full h-full bg-white p-2 text-left" style={{ fontFamily: "Inter, sans-serif" }}>
      <div className="flex justify-between items-start">
        <div className="font-bold text-[8px]" style={{ color: accent }}>Jane Doe</div>
        <div className="text-[4px] text-gray-400">Jun 2022</div>
      </div>
      <div className="text-[4.5px] text-gray-500 mb-1">jane@email.com · 555-1234</div>
      <div className="h-0.5 mb-1" style={{ backgroundColor: accent }} />
      <div className="text-[5px] font-semibold mb-1.5">Product Designer</div>
      <div className="flex items-center gap-1 mb-1.5">
        <span className="text-[5px] font-semibold">To Acme Corp</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <div className="text-[4.5px] text-gray-600 space-y-1">
        <p>Dear Team,</p>
        <p>Short intro paragraph with clean modern styling...</p>
        <p className="pt-1">Best regards,</p>
        <div className="h-2 border-b border-gray-200 w-10" />
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function TemplateSelector({ theme, onToggleTheme }) {
  const { documentType, chooseTemplate, importResume, importCoverLetter, reopenDocumentPicker } = useResumeStore();
  const templates = documentType === "cover-letter" ? COVER_LETTER_TEMPLATES : TEMPLATES;
  const docLabel = documentType === "cover-letter" ? "cover letter" : "resume";
  const [selected, setSelected] = useState(null);
  const [starting, setStarting] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const importInputRef = useRef(null);

  function handleStart() {
    if (!selected) return;
    setStarting(true);
    // Small delay for animation feel
    setTimeout(() => chooseTemplate(selected), 250);
  }

  function handleImportClick() {
    if (!selected) {
      toast.error("Select a template first, then import your draft.");
      return;
    }
    setImportDialogOpen(true);
  }

  function handleImportJson(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!selected) {
      toast.error("Select a template first, then import your draft.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (documentType === "cover-letter") {
          importCoverLetter(data, { forceTemplate: selected });
          toast.success("Cover letter imported! Add your e-signature if needed.");
        } else {
          importResume(data, { forceTemplate: selected });
          toast.success("Draft imported! Add your photo in Personal Info if needed.");
        }
      } catch {
        toast.error("Invalid file — please use a .json draft file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  return (
    <div className="h-full bg-background flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 px-6 py-4 border-b shrink-0">
        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">HireMePo 2.0</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={reopenDocumentPicker}>
            Change type
          </Button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </div>

      {/* Hero text */}
      <div className="text-center px-6 pt-10 pb-6 shrink-0 motion-section">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Choose your {docLabel} template
        </h1>
        <p className="mt-3 text-muted-foreground text-base max-w-lg mx-auto">
          {documentType === "cover-letter"
            ? "Pick a layout, fill in your letter, and add an e-signature or sign after printing."
            : "All templates are ATS-friendly. You can switch anytime from the Customize panel."}
        </p>
      </div>

      {/* Template grid */}
      <div className="flex-1 px-4 sm:px-8 pb-8">
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-2 gap-5 mx-auto",
            documentType === "cover-letter" ? "max-w-3xl" : "xl:grid-cols-4 max-w-6xl"
          )}
        >
          {templates.map((t, index) => {
            const isSelected = selected === t.id;
            const { Preview } = t;
            return (
              <StaggerItem key={t.id} index={index}>
              <button
                onClick={() => setSelected(t.id)}
                className={cn(
                  "w-full group relative rounded-2xl border-2 overflow-hidden text-left transition-all duration-200",
                  "hover:shadow-lg hover:-translate-y-0.5",
                  isSelected
                    ? "border-primary shadow-lg -translate-y-0.5"
                    : "border-border hover:border-primary/40"
                )}
              >
                {/* Selected badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10">
                    <CheckCircle2 className="h-5 w-5 text-primary fill-primary/10" />
                  </div>
                )}

                {/* Mini preview */}
                <div
                  className={cn(
                    "relative overflow-hidden transition-colors",
                    isSelected ? "bg-primary/5" : "bg-muted/50 group-hover:bg-muted"
                  )}
                  style={{ height: "220px", padding: "12px" }}
                >
                  <div
                    className="origin-top-left shadow-md rounded overflow-hidden"
                    style={{
                      width: "180px",
                      height: "254px",
                      transform: "scale(1.05)",
                      transformOrigin: "top center",
                      margin: "0 auto",
                    }}
                  >
                    <Preview accent={t.accentDefault} />
                  </div>
                </div>

                {/* Info */}
                <div className="p-4 border-t">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-base">{t.name}</h3>
                      <p className="text-xs text-primary font-medium">{t.tagline}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {t.desc}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
              </StaggerItem>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-3 mt-8 motion-section">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              size="lg"
              disabled={!selected || starting}
              onClick={handleStart}
              className="gap-2 px-8"
            >
              {starting
                ? "Starting…"
                : selected
                ? `Start with ${templates.find((t) => t.id === selected)?.name}`
                : "Select a template to continue"}
              {!starting && selected && <ArrowRight className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              size="lg"
              disabled={!selected}
              className="gap-2 px-6"
              onClick={handleImportClick}
            >
              <Upload className="h-4 w-4" />
              Import existing draft
            </Button>
            <input
              ref={importInputRef}
              id="import-draft-welcome"
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportJson}
            />
          </div>

          <ImportDraftDialog
            open={importDialogOpen}
            onOpenChange={setImportDialogOpen}
            documentType={documentType}
            onChooseFile={() => importInputRef.current?.click()}
          />

          {selected && documentType !== "cover-letter" && (
            <p className="text-center text-xs text-muted-foreground max-w-md">
              Already have a saved draft? Select your template, click{" "}
              <strong>Import existing draft</strong>, then upload your photo in{" "}
              <strong>Personal Info</strong> if you chose Classic + Photo.
            </p>
          )}
          {selected && documentType === "cover-letter" && (
            <p className="text-center text-xs text-muted-foreground max-w-md">
              Have a saved cover letter? Import your draft, then add an e-signature
              in the <strong>Signature</strong> section.
            </p>
          )}
        </div>

        {selected && (
          <p className="text-center text-xs text-muted-foreground mt-3">
            You can change this anytime from the <strong>Customize</strong> panel.
          </p>
        )}
      </div>
    </div>
  );
}
