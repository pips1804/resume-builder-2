import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/resumeStore";
import { cn } from "@/lib/utils";

const SECTION_LABELS = {
  summary: "Profile",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  awards: "Awards",
  references: "References",
};

export function SectionSidebar({ activeSection, onSectionClick }) {
  const { resume, toggleSection } = useResumeStore();
  const { sectionOrder, hiddenSections } = resume.meta;

  return (
    <nav className="flex flex-col gap-0.5 py-2">
      <button
        onClick={() => onSectionClick("personal")}
        className={cn(
          "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
          activeSection === "personal"
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        )}
      >
        Personal Info
      </button>

      {sectionOrder.map((key) => {
        const isHidden = hiddenSections.includes(key);
        const isActive = activeSection === key;
        return (
          <div key={key} className="flex items-center gap-1">
            <button
              onClick={() => onSectionClick(key)}
              className={cn(
                "flex-1 text-left px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : isHidden
                  ? "text-muted-foreground hover:bg-muted"
                  : "hover:bg-muted"
              )}
            >
              {SECTION_LABELS[key] || key}
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => toggleSection(key)}
              aria-label={isHidden ? `Show ${key}` : `Hide ${key}`}
            >
              {isHidden ? (
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </Button>
          </div>
        );
      })}
    </nav>
  );
}
