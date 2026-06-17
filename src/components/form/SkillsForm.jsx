import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useResumeStore } from "@/store/resumeStore";

function SkillCategory({ cat }) {
  const { updateItem, removeItem } = useResumeStore();
  const [input, setInput] = useState("");

  function addTag() {
    const val = input.trim();
    if (!val || cat.items.includes(val)) return;
    updateItem("skills", cat.id, { items: [...cat.items, val] });
    setInput("");
  }

  function removeTag(tag) {
    updateItem("skills", cat.id, { items: cat.items.filter((t) => t !== tag) });
  }

  function handleKey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Category (e.g. Frontend, Tools)"
          value={cat.category}
          onChange={(e) =>
            updateItem("skills", cat.id, { category: e.target.value })
          }
          className="font-medium"
        />
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 h-8 w-8 text-destructive"
          onClick={() => removeItem("skills", cat.id)}
          aria-label="Remove category"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex flex-wrap gap-1.5 min-h-8">
        {cat.items.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              onClick={() => removeTag(tag)}
              aria-label={`Remove ${tag}`}
              className="ml-0.5 hover:text-destructive"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Type a skill and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          className="text-sm"
        />
        <Button variant="outline" size="sm" onClick={addTag}>
          Add
        </Button>
      </div>
    </div>
  );
}

export function SkillsForm() {
  const { resume, addItem } = useResumeStore();

  return (
    <div className="space-y-3">
      {resume.skills.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No skills added yet.
        </p>
      )}

      {resume.skills.map((cat) => (
        <SkillCategory key={cat.id} cat={cat} />
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => addItem("skills", { category: "", items: [] })}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-1" />
        Add Skill Category
      </Button>
    </div>
  );
}
