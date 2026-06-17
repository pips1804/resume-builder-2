import { Plus, Trash2 } from "lucide-react";
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

export function ReferencesForm() {
  const { resume, addItem, removeItem, updateItem, updateMeta } =
    useResumeStore();
  const availableOnRequest = resume.meta.referencesOnRequest ?? true;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 border rounded-lg p-3">
        <Switch
          id="ref-on-request"
          checked={availableOnRequest}
          onCheckedChange={(v) => updateMeta({ referencesOnRequest: v })}
        />
        <Label htmlFor="ref-on-request" className="cursor-pointer">
          Show "References available upon request"
        </Label>
      </div>

      {!availableOnRequest && (
        <>
          {resume.references.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No references added yet.
            </p>
          )}

          <Accordion type="multiple" className="space-y-2">
            {resume.references.map((ref) => (
              <AccordionItem
                key={ref.id}
                value={ref.id}
                className="border rounded-lg px-4"
              >
                <AccordionTrigger className="hover:no-underline">
                  <span className="font-medium text-sm text-left">
                    {ref.name || "New Reference"}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 pt-2 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Full Name</Label>
                      <Input
                        value={ref.name}
                        onChange={(e) =>
                          updateItem("references", ref.id, {
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Position</Label>
                      <Input
                        value={ref.position}
                        onChange={(e) =>
                          updateItem("references", ref.id, {
                            position: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Company</Label>
                      <Input
                        value={ref.company}
                        onChange={(e) =>
                          updateItem("references", ref.id, {
                            company: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={ref.email}
                        onChange={(e) =>
                          updateItem("references", ref.id, {
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Phone</Label>
                    <Input
                      value={ref.phone}
                      onChange={(e) =>
                        updateItem("references", ref.id, {
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => removeItem("references", ref.id)}
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
              addItem("references", {
                name: "",
                position: "",
                company: "",
                email: "",
                phone: "",
              })
            }
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Reference
          </Button>
        </>
      )}
    </div>
  );
}
