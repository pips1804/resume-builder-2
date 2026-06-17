import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useResumeStore } from "@/store/resumeStore";

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Fluent", "Native"];

export function LanguagesForm() {
  const { resume, addItem, removeItem, updateItem } = useResumeStore();

  return (
    <div className="space-y-3">
      {resume.languages.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No languages added yet.
        </p>
      )}

      {resume.languages.map((lang) => (
        <div key={lang.id} className="flex gap-2 items-end border rounded-lg p-3">
          <div className="flex-1 space-y-1.5">
            <Label>Language</Label>
            <Input
              value={lang.language}
              onChange={(e) =>
                updateItem("languages", lang.id, { language: e.target.value })
              }
              placeholder="English"
            />
          </div>
          <div className="flex-1 space-y-1.5">
            <Label>Proficiency</Label>
            <Select
              value={lang.proficiency}
              onValueChange={(v) =>
                updateItem("languages", lang.id, { proficiency: v })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                {PROFICIENCY_LEVELS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-destructive shrink-0"
            onClick={() => removeItem("languages", lang.id)}
            aria-label="Remove language"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => addItem("languages", { language: "", proficiency: "" })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Language
      </Button>
    </div>
  );
}
