import { useState } from "react";
import { BriefcaseBusiness, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/resumeStore";
import { cn } from "@/lib/utils";

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

// ── Main component ────────────────────────────────────────────────────────────

export function TemplateSelector() {
  const { chooseTemplate } = useResumeStore();
  const [selected, setSelected] = useState(null);
  const [starting, setStarting] = useState(false);

  function handleStart() {
    if (!selected) return;
    setStarting(true);
    // Small delay for animation feel
    setTimeout(() => chooseTemplate(selected), 250);
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 px-6 py-4 border-b shrink-0">
        <BriefcaseBusiness className="h-5 w-5 text-primary" />
        <span className="font-semibold text-sm">HireMePo 2.0</span>
      </div>

      {/* Hero text */}
      <div className="text-center px-6 pt-10 pb-6 shrink-0">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Choose your resume template
        </h1>
        <p className="mt-3 text-muted-foreground text-base max-w-lg mx-auto">
          All templates are 100% ATS-friendly. You can switch anytime from the
          Customize panel.
        </p>
      </div>

      {/* Template grid */}
      <div className="flex-1 px-4 sm:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {TEMPLATES.map((t) => {
            const isSelected = selected === t.id;
            const { Preview } = t;
            return (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={cn(
                  "group relative rounded-2xl border-2 overflow-hidden text-left transition-all duration-200",
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
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            disabled={!selected || starting}
            onClick={handleStart}
            className="gap-2 px-8"
          >
            {starting
              ? "Starting…"
              : selected
              ? `Start with ${TEMPLATES.find((t) => t.id === selected)?.name}`
              : "Select a template to continue"}
            {!starting && selected && <ArrowRight className="h-4 w-4" />}
          </Button>
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
