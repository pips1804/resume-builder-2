import { Plus, Trash2, GripVertical, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useResumeStore } from "@/store/resumeStore";
import { generateId } from "@/lib/utils";
import { getExperienceWarnings } from "@/lib/atsScore";

function MonthYearInput({ label, id, value, onChange }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="month"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full"
      />
    </div>
  );
}

export function ExperienceForm() {
  const { resume, addItem, removeItem, updateItem } = useResumeStore();
  const items = resume.experience;

  function addEntry() {
    addItem("experience", {
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],
    });
  }

  function update(id, field, value) {
    updateItem("experience", id, { [field]: value });
  }

  function addBullet(id) {
    const exp = items.find((i) => i.id === id);
    updateItem("experience", id, { bullets: [...exp.bullets, ""] });
  }

  function updateBullet(id, idx, value) {
    const exp = items.find((i) => i.id === id);
    const bullets = [...exp.bullets];
    bullets[idx] = value;
    updateItem("experience", id, { bullets });
  }

  function removeBullet(id, idx) {
    const exp = items.find((i) => i.id === id);
    const bullets = exp.bullets.filter((_, i) => i !== idx);
    updateItem("experience", id, { bullets: bullets.length ? bullets : [""] });
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No experience added yet. Click + to add.
        </p>
      )}

      <Accordion type="multiple" defaultValue={items.map((i) => i.id)} className="space-y-2">
        {items.map((exp) => {
          const warnings = getExperienceWarnings(exp);
          const title = exp.position || exp.company || "New Experience";
          return (
            <AccordionItem
              key={exp.id}
              value={exp.id}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2 text-left">
                  <span className="font-medium text-sm">{title}</span>
                  {warnings.length > 0 && (
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Company *</Label>
                    <Input
                      placeholder="Ingoude Company"
                      value={exp.company}
                      onChange={(e) => update(exp.id, "company", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Job Title *</Label>
                    <Input
                      placeholder="Admin and Multimedia Staff"
                      value={exp.position}
                      onChange={(e) => update(exp.id, "position", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input
                    placeholder="Anywhere St., Any City"
                    value={exp.location}
                    onChange={(e) => update(exp.id, "location", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <MonthYearInput
                    label="Start Date"
                    id={`start-${exp.id}`}
                    value={exp.startDate}
                    onChange={(v) => update(exp.id, "startDate", v)}
                  />
                  {!exp.current && (
                    <MonthYearInput
                      label="End Date"
                      id={`end-${exp.id}`}
                      value={exp.endDate}
                      onChange={(v) => update(exp.id, "endDate", v)}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onCheckedChange={(v) => update(exp.id, "current", v)}
                  />
                  <Label htmlFor={`current-${exp.id}`} className="cursor-pointer">
                    Currently working here
                  </Label>
                </div>

                {/* Bullet points */}
                <div className="space-y-2">
                  <Label>Bullet Points</Label>
                  <p className="text-xs text-muted-foreground -mt-1">
                    Start each bullet with an action verb for ATS best results.
                  </p>
                  {exp.bullets.map((b, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                      <Input
                        placeholder="Managed digital communication and data organization…"
                        value={b}
                        onChange={(e) => updateBullet(exp.id, idx, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0 h-8 w-8"
                        onClick={() => removeBullet(exp.id, idx)}
                        aria-label="Remove bullet"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addBullet(exp.id)}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Add Bullet
                  </Button>
                </div>

                {warnings.length > 0 && (
                  <div className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 rounded-md p-2 space-y-0.5">
                    {warnings.map((w, i) => (
                      <p key={i}>⚠ {w}</p>
                    ))}
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeItem("experience", exp.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove Entry
                </Button>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Button variant="outline" size="sm" onClick={addEntry} className="w-full">
        <Plus className="h-4 w-4 mr-1" />
        Add Work Experience
      </Button>
    </div>
  );
}
