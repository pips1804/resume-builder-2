import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useResumeStore } from "@/store/resumeStore";

export function AwardsForm() {
  const { resume, addItem, removeItem, updateItem } = useResumeStore();

  function update(id, field, value) {
    updateItem("awards", id, { [field]: value });
  }

  return (
    <div className="space-y-3">
      {resume.awards.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No awards added yet.
        </p>
      )}

      <Accordion type="multiple" className="space-y-2">
        {resume.awards.map((award) => (
          <AccordionItem
            key={award.id}
            value={award.id}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="font-medium text-sm text-left">
                {award.title || "New Award"}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2 pb-4">
              <div className="space-y-1.5">
                <Label>Award Title *</Label>
                <Input
                  value={award.title}
                  onChange={(e) => update(award.id, "title", e.target.value)}
                  placeholder="Dean's List"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Issuer</Label>
                  <Input
                    value={award.issuer}
                    onChange={(e) => update(award.id, "issuer", e.target.value)}
                    placeholder="Universitas Fauget"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Date</Label>
                  <Input
                    type="month"
                    value={award.date}
                    onChange={(e) => update(award.id, "date", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Description</Label>
                <Textarea
                  value={award.description}
                  onChange={(e) =>
                    update(award.id, "description", e.target.value)
                  }
                  rows={2}
                  placeholder="Brief description of the award…"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => removeItem("awards", award.id)}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Remove
              </Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          addItem("awards", {
            title: "",
            issuer: "",
            date: "",
            description: "",
          })
        }
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Award
      </Button>
    </div>
  );
}
