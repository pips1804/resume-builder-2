import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultResume } from "../types/resume";
import { generateId } from "../lib/utils";

export const useResumeStore = create(
  persist(
    (set) => ({
      resume: defaultResume,
      templateChosen: false,

      // Called when user picks a template on the welcome screen
      chooseTemplate: (templateId) =>
        set((s) => {
          // Set sensible accent + font defaults per template
          const defaults = {
            classic: { accentColor: "#1a1a1a", fontFamily: "Georgia, serif" },
            modern:  { accentColor: "#2563eb", fontFamily: "Inter, sans-serif" },
            minimal: { accentColor: "#1a1a1a", fontFamily: "Inter, sans-serif" },
          };
          const d = defaults[templateId] || defaults.classic;
          return {
            templateChosen: true,
            resume: {
              ...s.resume,
              meta: { ...s.resume.meta, template: templateId, ...d },
            },
          };
        }),

      // Re-opens the template picker (from Customize drawer)
      reopenTemplatePicker: () => set({ templateChosen: false }),

      updatePersonal: (data) =>
        set((s) => ({
          resume: {
            ...s.resume,
            personal: { ...s.resume.personal, ...data },
          },
        })),

      updateMeta: (data) =>
        set((s) => ({
          resume: {
            ...s.resume,
            meta: { ...s.resume.meta, ...data },
          },
        })),

      updateSummary: (text) =>
        set((s) => ({ resume: { ...s.resume, summary: text } })),

      addItem: (section, defaults = {}) =>
        set((s) => ({
          resume: {
            ...s.resume,
            [section]: [
              ...s.resume[section],
              { id: generateId(), ...defaults },
            ],
          },
        })),

      removeItem: (section, id) =>
        set((s) => ({
          resume: {
            ...s.resume,
            [section]: s.resume[section].filter((i) => i.id !== id),
          },
        })),

      updateItem: (section, id, data) =>
        set((s) => ({
          resume: {
            ...s.resume,
            [section]: s.resume[section].map((i) =>
              i.id === id ? { ...i, ...data } : i
            ),
          },
        })),

      reorderItems: (section, items) =>
        set((s) => ({ resume: { ...s.resume, [section]: items } })),

      reorderSections: (newOrder) =>
        set((s) => ({
          resume: {
            ...s.resume,
            meta: { ...s.resume.meta, sectionOrder: newOrder },
          },
        })),

      toggleSection: (sectionKey) =>
        set((s) => {
          const hidden = s.resume.meta.hiddenSections;
          const isHidden = hidden.includes(sectionKey);
          return {
            resume: {
              ...s.resume,
              meta: {
                ...s.resume.meta,
                hiddenSections: isHidden
                  ? hidden.filter((k) => k !== sectionKey)
                  : [...hidden, sectionKey],
              },
            },
          };
        }),

      loadResume: (data) => set({ resume: data, templateChosen: true }),

      resetResume: () =>
        set({ resume: defaultResume, templateChosen: false }),
    }),
    {
      name: "resume-draft",
      version: 2,
      // When the stored version doesn't match, reset to defaults
      migrate: (persistedState, version) => {
        if (version < 2) {
          return { resume: defaultResume, templateChosen: false };
        }
        return persistedState;
      },
    }
  )
);
