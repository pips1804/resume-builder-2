import { defaultResume } from "../types/resume";

const LIST_KEYS = [
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "awards",
  "references",
];

/**
 * Merge an imported JSON draft with the current resume.
 *
 * Supports upgrading a Classic draft into Classic + Photo when the user has
 * already chosen (or forces) the classic-photo template — all content is kept,
 * they only need to upload a photo.
 */
export function mergeImportedResume(imported, currentResume = defaultResume, options = {}) {
  const { forceTemplate } = options;

  const importedMeta = imported?.meta || {};
  const currentMeta = currentResume?.meta || {};
  const importedTemplate = importedMeta.template || "classic";
  const currentTemplate = currentMeta.template || "classic";

  let template = importedTemplate;
  let showPhoto = importedMeta.showPhoto ?? false;

  if (forceTemplate) {
    template = forceTemplate;
    showPhoto = forceTemplate === "classic-photo";
  } else if (
    currentTemplate === "classic-photo" &&
    (importedTemplate === "classic" || importedTemplate === "classic-photo")
  ) {
    // Already on Classic + Photo — keep it when importing a Classic draft
    template = "classic-photo";
    showPhoto = currentMeta.showPhoto ?? true;
  }

  if (template === "classic-photo") {
    showPhoto = true;
  }

  const merged = {
    ...defaultResume,
    ...imported,
    personal: {
      ...defaultResume.personal,
      ...imported.personal,
      photo: imported.personal?.photo ?? currentResume?.personal?.photo ?? null,
    },
    meta: {
      ...defaultResume.meta,
      ...importedMeta,
      template,
      showPhoto,
    },
    summary: imported.summary ?? defaultResume.summary,
  };

  for (const key of LIST_KEYS) {
    if (!Array.isArray(merged[key])) {
      merged[key] = [];
    }
  }

  if (!Array.isArray(merged.meta.sectionOrder)) {
    merged.meta.sectionOrder = defaultResume.meta.sectionOrder;
  }
  if (!Array.isArray(merged.meta.hiddenSections)) {
    merged.meta.hiddenSections = [];
  }

  return merged;
}
