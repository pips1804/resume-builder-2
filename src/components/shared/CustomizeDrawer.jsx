import { useState } from "react";
import { Palette, Settings2, GripVertical, FileText, LayoutTemplate } from "lucide-react";
import { PAPER_SIZE_LIST } from "@/lib/paperSizes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useResumeStore } from "@/store/resumeStore";
import { cn } from "@/lib/utils";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const SECTION_LABELS = {
  summary: "Profile / Summary",
  experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  projects: "Projects",
  certifications: "Certifications",
  languages: "Languages",
  awards: "Awards & Honors",
  references: "References",
};

const PRESET_COLORS = [
  "#1a1a1a", "#2563eb", "#16a34a", "#dc2626",
  "#7c3aed", "#d97706", "#0891b2", "#db2777",
  "#374151", "#065f46", "#1e3a5f", "#7f1d1d",
];

const FONTS = [
  { id: "Georgia, serif", label: "Georgia (Classic)" },
  { id: "Inter, sans-serif", label: "Inter (Modern)" },
  { id: "'Roboto Mono', monospace", label: "Roboto Mono (Technical)" },
];

const FONT_SIZES = [
  { id: "sm", label: "Small" },
  { id: "md", label: "Medium" },
  { id: "lg", label: "Large" },
];

const MARGINS = [
  { id: "tight", label: "Tight" },
  { id: "normal", label: "Normal" },
  { id: "wide", label: "Wide" },
];

export function CustomizeDrawer() {
  const { resume, updateMeta, reorderSections, toggleSection, reopenTemplatePicker } = useResumeStore();
  const meta = resume.meta;
  const [customColor, setCustomColor] = useState(meta.accentColor || "#1a1a1a");

  function handleDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(meta.sectionOrder);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    reorderSections(items);
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-1" />
          Customize
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Design Settings
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Paper Size */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              Paper Size
            </Label>
            <div className="grid gap-1.5">
              {PAPER_SIZE_LIST.map((p) => (
                <button
                  key={p.id}
                  onClick={() => updateMeta({ paperSize: p.id })}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-colors",
                    meta.paperSize === p.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted"
                  )}
                >
                  <div>
                    <span className="text-sm font-medium">{p.label}</span>
                    <p className="text-xs text-muted-foreground">{p.desc}</p>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono ml-2 shrink-0">
                    {p.widthMm}×{p.heightMm}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Template */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Template
            </Label>
            <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/40">
              <div>
                <p className="text-sm font-medium capitalize">{meta.template || "Classic"}</p>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={reopenTemplatePicker}
                className="gap-1.5 shrink-0"
              >
                <LayoutTemplate className="h-3.5 w-3.5" />
                Change
              </Button>
            </div>
          </div>

          <Separator />

          {/* Accent Color */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Accent Color
            </Label>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    updateMeta({ accentColor: color });
                    setCustomColor(color);
                  }}
                  className={cn(
                    "w-8 h-8 rounded-md border-2 transition-transform hover:scale-110",
                    meta.accentColor === color
                      ? "border-foreground scale-110"
                      : "border-transparent"
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={color}
                />
              ))}
            </div>
            <div className="flex gap-2 items-center mt-1">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  updateMeta({ accentColor: e.target.value });
                }}
                className="w-8 h-8 rounded cursor-pointer border border-border"
              />
              <span className="text-xs text-muted-foreground">Custom color</span>
              <span className="text-xs font-mono ml-auto">{customColor}</span>
            </div>
          </div>

          <Separator />

          {/* Font Family */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Font Family
            </Label>
            <div className="grid gap-1.5">
              {FONTS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => updateMeta({ fontFamily: f.id })}
                  className={cn(
                    "px-3 py-2 rounded-md border text-left text-sm transition-colors",
                    meta.fontFamily === f.id
                      ? "border-primary bg-primary/5 font-medium"
                      : "border-border hover:bg-muted"
                  )}
                  style={{ fontFamily: f.id }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Font Size */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Font Size
            </Label>
            <div className="flex gap-2">
              {FONT_SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => updateMeta({ fontSize: s.id })}
                  className={cn(
                    "flex-1 py-1.5 rounded-md border text-sm transition-colors",
                    meta.fontSize === s.id
                      ? "border-primary bg-primary/5 font-medium"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Page Margin */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Page Margins
            </Label>
            <div className="flex gap-2">
              {MARGINS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => updateMeta({ pageMargin: m.id })}
                  className={cn(
                    "flex-1 py-1.5 rounded-md border text-sm transition-colors",
                    meta.pageMargin === m.id
                      ? "border-primary bg-primary/5 font-medium"
                      : "border-border hover:bg-muted"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Section Order & Visibility */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sections (drag to reorder)
            </Label>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sections">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-1"
                  >
                    {meta.sectionOrder.map((key, index) => {
                      const isHidden = meta.hiddenSections.includes(key);
                      return (
                        <Draggable key={key} draggableId={key} index={index}>
                          {(prov) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              className={cn(
                                "flex items-center gap-2 px-2 py-1.5 rounded-md border bg-background",
                                isHidden && "opacity-50"
                              )}
                            >
                              <div {...prov.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                              </div>
                              <span className="flex-1 text-sm">
                                {SECTION_LABELS[key] || key}
                              </span>
                              <Switch
                                checked={!isHidden}
                                onCheckedChange={() => toggleSection(key)}
                                aria-label={`Toggle ${key}`}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
