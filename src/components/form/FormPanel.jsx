import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { SectionSidebar } from "./SectionSidebar";
import { PersonalForm } from "./PersonalForm";
import { SummaryForm } from "./SummaryForm";
import { ExperienceForm } from "./ExperienceForm";
import { EducationForm } from "./EducationForm";
import { SkillsForm } from "./SkillsForm";
import { ProjectsForm } from "./ProjectsForm";
import { CertificationsForm } from "./CertificationsForm";
import { LanguagesForm } from "./LanguagesForm";
import { AwardsForm } from "./AwardsForm";
import { ReferencesForm } from "./ReferencesForm";
import { AtsPanel } from "@/components/shared/AtsPanel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SECTION_MAP = {
  personal: { label: "Personal Information", Component: PersonalForm },
  summary: { label: "Profile / Summary", Component: SummaryForm },
  experience: { label: "Work Experience", Component: ExperienceForm },
  education: { label: "Education", Component: EducationForm },
  skills: { label: "Skills", Component: SkillsForm },
  projects: { label: "Projects", Component: ProjectsForm },
  certifications: { label: "Certifications", Component: CertificationsForm },
  languages: { label: "Languages", Component: LanguagesForm },
  awards: { label: "Awards & Honors", Component: AwardsForm },
  references: { label: "References", Component: ReferencesForm },
};

const ALL_SECTIONS = Object.entries(SECTION_MAP).map(([id, { label }]) => ({
  id,
  label,
}));

export function FormPanel() {
  const [activeSection, setActiveSection] = useState("personal");
  const sectionRef = useRef(null);

  function handleSectionClick(key) {
    setActiveSection(key);
    sectionRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }

  const section = SECTION_MAP[activeSection];
  const Component = section?.Component;

  return (
    <div className="flex h-full overflow-hidden border-r">
      {/* ── Vertical sidebar (visible on lg+) ── */}
      <aside className="hidden lg:flex w-40 shrink-0 border-r overflow-y-auto px-2 flex-col">
        <SectionSidebar
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
        />
      </aside>

      {/* ── Main form area ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Compact section picker for tablet/mobile (< lg) */}
        <div className="lg:hidden px-3 pt-3 pb-2 border-b shrink-0">
          <Select value={activeSection} onValueChange={handleSectionClick}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_SECTIONS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Scrollable form content */}
        <div ref={sectionRef} className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-5">
            {/* Section heading */}
            <div>
              <h2 className="text-base font-semibold">{section?.label}</h2>
              <div className="h-px bg-border mt-2" />
            </div>

            {Component && <Component />}

            {/* ATS score panel always at the bottom */}
            <div className="mt-4">
              <AtsPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
