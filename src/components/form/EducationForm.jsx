import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useResumeStore } from "@/store/resumeStore";

export function EducationForm() {
  const { resume, addItem, removeItem, updateItem } = useResumeStore();
  const items = resume.education;

  function update(id, field, value) {
    updateItem("education", id, { [field]: value });
  }

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No education added yet. Click + to add.
        </p>
      )}

      <Accordion type="multiple" defaultValue={items.map((i) => i.id)} className="space-y-2">
        {items.map((edu) => {
          const title = edu.institution || edu.degree || "New Education";
          return (
            <AccordionItem
              key={edu.id}
              value={edu.id}
              className="border rounded-lg px-4"
            >
              <AccordionTrigger className="hover:no-underline">
                <span className="font-medium text-sm text-left">{title}</span>
              </AccordionTrigger>
              <AccordionContent className="space-y-3 pt-2 pb-4">
                <div className="space-y-1.5">
                  <Label>Institution *</Label>
                  <Input
                    placeholder="Universitas Fauget"
                    value={edu.institution}
                    onChange={(e) => update(edu.id, "institution", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Degree *</Label>
                    <Input
                      placeholder="Bachelor of Communication"
                      value={edu.degree}
                      onChange={(e) => update(edu.id, "degree", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Field of Study</Label>
                    <Input
                      placeholder="Communication"
                      value={edu.field}
                      onChange={(e) => update(edu.id, "field", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label>Location</Label>
                  <Input
                    placeholder="Anywhere St., Any City"
                    value={edu.location || ""}
                    onChange={(e) => update(edu.id, "location", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>Start Date</Label>
                    <Input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => update(edu.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>End Date</Label>
                    <Input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => update(edu.id, "endDate", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label>GPA (optional)</Label>
                    <Input
                      placeholder="3.89/4.0"
                      value={edu.gpa}
                      onChange={(e) => update(edu.id, "gpa", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Honors (optional)</Label>
                    <Input
                      placeholder="Cum Laude"
                      value={edu.honors}
                      onChange={(e) => update(edu.id, "honors", e.target.value)}
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeItem("education", edu.id)}
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1" />
                  Remove Entry
                </Button>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          addItem("education", {
            institution: "",
            degree: "",
            field: "",
            location: "",
            startDate: "",
            endDate: "",
            gpa: "",
            honors: "",
          })
        }
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Education
      </Button>
    </div>
  );
}
