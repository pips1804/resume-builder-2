import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useResumeStore } from "@/store/resumeStore";

export function ProjectsForm() {
  const { resume, addItem, removeItem, updateItem } = useResumeStore();
  const [techInputs, setTechInputs] = useState({});

  function update(id, field, value) {
    updateItem("projects", id, { [field]: value });
  }

  function addTech(id) {
    const val = (techInputs[id] || "").trim();
    if (!val) return;
    const proj = resume.projects.find((p) => p.id === id);
    if (!proj.techStack.includes(val)) {
      updateItem("projects", id, { techStack: [...proj.techStack, val] });
    }
    setTechInputs((prev) => ({ ...prev, [id]: "" }));
  }

  function removeTech(id, tech) {
    const proj = resume.projects.find((p) => p.id === id);
    updateItem("projects", id, {
      techStack: proj.techStack.filter((t) => t !== tech),
    });
  }

  return (
    <div className="space-y-3">
      {resume.projects.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No projects added yet. Click + to add.
        </p>
      )}

      <Accordion type="multiple" className="space-y-2">
        {resume.projects.map((proj) => (
          <AccordionItem
            key={proj.id}
            value={proj.id}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="font-medium text-sm text-left">
                {proj.name || "New Project"}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Project Name *</Label>
                  <Input
                    value={proj.name}
                    onChange={(e) => update(proj.id, "name", e.target.value)}
                    placeholder="Resume Builder"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Your Role</Label>
                  <Input
                    value={proj.role}
                    onChange={(e) => update(proj.id, "role", e.target.value)}
                    placeholder="Lead Developer"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={proj.description}
                  onChange={(e) =>
                    update(proj.id, "description", e.target.value)
                  }
                  placeholder="Describe the project and your contributions…"
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Tech Stack</Label>
                <div className="flex flex-wrap gap-1.5 mb-1">
                  {proj.techStack.map((t) => (
                    <Badge key={t} variant="secondary" className="gap-1 pr-1">
                      {t}
                      <button
                        onClick={() => removeTech(proj.id, t)}
                        className="ml-0.5 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="React, Node.js…"
                    value={techInputs[proj.id] || ""}
                    onChange={(e) =>
                      setTechInputs((prev) => ({
                        ...prev,
                        [proj.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTech(proj.id);
                      }
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addTech(proj.id)}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={proj.startDate}
                    onChange={(e) =>
                      update(proj.id, "startDate", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={proj.endDate}
                    onChange={(e) =>
                      update(proj.id, "endDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Project URL</Label>
                <Input
                  value={proj.link}
                  onChange={(e) => update(proj.id, "link", e.target.value)}
                  placeholder="https://github.com/…"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => removeItem("projects", proj.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remove Project
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          addItem("projects", {
            name: "",
            role: "",
            description: "",
            techStack: [],
            link: "",
            startDate: "",
            endDate: "",
          })
        }
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Project
      </Button>
    </div>
  );
}
