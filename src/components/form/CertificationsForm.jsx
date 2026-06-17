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

export function CertificationsForm() {
  const { resume, addItem, removeItem, updateItem } = useResumeStore();

  function update(id, field, value) {
    updateItem("certifications", id, { [field]: value });
  }

  return (
    <div className="space-y-3">
      {resume.certifications.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No certifications added yet.
        </p>
      )}

      <Accordion type="multiple" className="space-y-2">
        {resume.certifications.map((cert) => (
          <AccordionItem
            key={cert.id}
            value={cert.id}
            className="border rounded-lg px-4"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="font-medium text-sm text-left">
                {cert.name || "New Certification"}
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pt-2 pb-4">
              <div className="space-y-1.5">
                <Label>Certification Name *</Label>
                <Input
                  value={cert.name}
                  onChange={(e) => update(cert.id, "name", e.target.value)}
                  placeholder="Google Analytics Certification"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Issuing Organization *</Label>
                  <Input
                    value={cert.issuer}
                    onChange={(e) => update(cert.id, "issuer", e.target.value)}
                    placeholder="Google"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Date Issued</Label>
                  <Input
                    type="month"
                    value={cert.date}
                    onChange={(e) => update(cert.id, "date", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Credential URL</Label>
                <Input
                  value={cert.url}
                  onChange={(e) => update(cert.id, "url", e.target.value)}
                  placeholder="https://…"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => removeItem("certifications", cert.id)}
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
          addItem("certifications", { name: "", issuer: "", date: "", url: "" })
        }
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Certification
      </Button>
    </div>
  );
}
