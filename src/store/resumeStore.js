import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultResume } from "../types/resume";
import { defaultCoverLetter } from "../types/coverLetter";
import { generateId } from "../lib/utils";
import { mergeImportedResume } from "../lib/importResume";

const RESUME_TEMPLATE_DEFAULTS = {
  classic: { accentColor: "#1a1a1a", fontFamily: "Georgia, serif", showPhoto: false },
  "classic-photo": { accentColor: "#1a1a1a", fontFamily: "Georgia, serif", showPhoto: true },
  modern: { accentColor: "#2563eb", fontFamily: "Inter, sans-serif", showPhoto: false },
  minimal: { accentColor: "#1a1a1a", fontFamily: "Inter, sans-serif", showPhoto: false },
};

const COVER_LETTER_TEMPLATE_DEFAULTS = {
  professional: { accentColor: "#1e3a5f", fontFamily: "Inter, sans-serif" },
  modern: { accentColor: "#2563eb", fontFamily: "Inter, sans-serif" },
};

export const useResumeStore = create(
  persist(
    (set) => ({
      documentType: null,
      documentTypeChosen: false,
      resume: defaultResume,
      coverLetter: defaultCoverLetter,
      templateChosen: false,
      tutorialCompleted: false,

      completeTutorial: () => set({ tutorialCompleted: true }),

      chooseDocumentType: (type) =>
        set({
          documentType: type,
          documentTypeChosen: true,
          templateChosen: false,
        }),

      reopenDocumentPicker: () =>
        set({ documentTypeChosen: false, templateChosen: false }),

      chooseTemplate: (templateId) =>
        set((s) => {
          if (s.documentType === "cover-letter") {
            const d =
              COVER_LETTER_TEMPLATE_DEFAULTS[templateId] ||
              COVER_LETTER_TEMPLATE_DEFAULTS.professional;
            return {
              templateChosen: true,
              coverLetter: {
                ...s.coverLetter,
                meta: { ...s.coverLetter.meta, template: templateId, ...d },
              },
            };
          }

          const d =
            RESUME_TEMPLATE_DEFAULTS[templateId] || RESUME_TEMPLATE_DEFAULTS.classic;
          return {
            templateChosen: true,
            resume: {
              ...s.resume,
              meta: { ...s.resume.meta, template: templateId, ...d },
            },
          };
        }),

      reopenTemplatePicker: () => set({ templateChosen: false }),

      updatePersonal: (data) =>
        set((s) => ({
          resume: {
            ...s.resume,
            personal: { ...s.resume.personal, ...data },
          },
        })),

      updateMeta: (data) =>
        set((s) => {
          if (s.documentType === "cover-letter") {
            return {
              coverLetter: {
                ...s.coverLetter,
                meta: { ...s.coverLetter.meta, ...data },
              },
            };
          }
          return {
            resume: {
              ...s.resume,
              meta: { ...s.resume.meta, ...data },
            },
          };
        }),

      updateCoverLetterSender: (data) =>
        set((s) => ({
          coverLetter: {
            ...s.coverLetter,
            sender: { ...s.coverLetter.sender, ...data },
          },
        })),

      updateCoverLetterLetter: (data) =>
        set((s) => ({
          coverLetter: {
            ...s.coverLetter,
            letter: { ...s.coverLetter.letter, ...data },
          },
        })),

      addCoverLetterBullet: () =>
        set((s) => ({
          coverLetter: {
            ...s.coverLetter,
            letter: {
              ...s.coverLetter.letter,
              bullets: [
                ...s.coverLetter.letter.bullets,
                { id: generateId(), text: "" },
              ],
            },
          },
        })),

      updateCoverLetterBullet: (id, text) =>
        set((s) => ({
          coverLetter: {
            ...s.coverLetter,
            letter: {
              ...s.coverLetter.letter,
              bullets: s.coverLetter.letter.bullets.map((b) =>
                b.id === id ? { ...b, text } : b
              ),
            },
          },
        })),

      removeCoverLetterBullet: (id) =>
        set((s) => ({
          coverLetter: {
            ...s.coverLetter,
            letter: {
              ...s.coverLetter.letter,
              bullets: s.coverLetter.letter.bullets.filter((b) => b.id !== id),
            },
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

      loadResume: (data) =>
        set({ resume: data, documentType: "resume", documentTypeChosen: true, templateChosen: true }),

      importResume: (imported, options) =>
        set((s) => ({
          documentType: "resume",
          documentTypeChosen: true,
          resume: mergeImportedResume(imported, s.resume, options),
          templateChosen: true,
        })),

      importCoverLetter: (imported, options) =>
        set((s) => {
          const forced = options?.forceTemplate;
          const forcedDefaults = forced
            ? COVER_LETTER_TEMPLATE_DEFAULTS[forced]
            : {};
          return {
            documentType: "cover-letter",
            documentTypeChosen: true,
            coverLetter: {
              ...defaultCoverLetter,
              ...imported,
              meta: {
                ...defaultCoverLetter.meta,
                ...imported?.meta,
                ...forcedDefaults,
                template:
                  forced ||
                  imported?.meta?.template ||
                  s.coverLetter.meta.template,
              },
              sender: { ...defaultCoverLetter.sender, ...imported?.sender },
              letter: {
                ...defaultCoverLetter.letter,
                ...imported?.letter,
                bullets: imported?.letter?.bullets?.length
                  ? imported.letter.bullets.map((b) =>
                      typeof b === "string"
                        ? { id: generateId(), text: b }
                        : b
                    )
                  : defaultCoverLetter.letter.bullets,
              },
            },
            templateChosen: true,
          };
        }),

      resetResume: () =>
        set({
          documentType: null,
          documentTypeChosen: false,
          resume: defaultResume,
          coverLetter: defaultCoverLetter,
          templateChosen: false,
          tutorialCompleted: false,
        }),
    }),
    {
      name: "resume-draft",
      version: 4,
      migrate: (persistedState, version) => {
        if (version < 2) {
          return {
            resume: defaultResume,
            coverLetter: defaultCoverLetter,
            documentType: null,
            documentTypeChosen: false,
            templateChosen: false,
            tutorialCompleted: false,
          };
        }
        if (version < 3) {
          return { ...persistedState, tutorialCompleted: false };
        }
        if (version < 4) {
          return {
            ...persistedState,
            documentType: persistedState.documentType ?? "resume",
            documentTypeChosen: persistedState.documentTypeChosen ?? true,
            coverLetter: defaultCoverLetter,
          };
        }
        return persistedState;
      },
    }
  )
);
