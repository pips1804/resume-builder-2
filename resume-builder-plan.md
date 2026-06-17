# 🧾 ATS-Friendly Resume Builder — Project Plan

> **Stack:** React + Vite · Tailwind CSS · shadcn/ui · react-to-pdf / html2pdf.js
> **Features:** Dark/Light mode · Fully customizable · Form-driven · ATS-safe PDF export (≤10MB)

---

## 📋 Table of Contents

- [Phase 0 — Project Setup & Tooling](#phase-0--project-setup--tooling)
- [Phase 1 — Layout & Theme System](#phase-1--layout--theme-system)
- [Phase 2 — Resume Data Model & State Management](#phase-2--resume-data-model--state-management)
- [Phase 3 — Form Sections (Input Side)](#phase-3--form-sections-input-side)
- [Phase 4 — Live Resume Preview (Output Side)](#phase-4--live-resume-preview-output-side)
- [Phase 5 — Template & Customization System](#phase-5--template--customization-system)
- [Phase 6 — PDF Export](#phase-6--pdf-export)
- [Phase 7 — ATS Optimization Layer](#phase-7--ats-optimization-layer)
- [Phase 8 — Persistence & UX Polish](#phase-8--persistence--ux-polish)
- [Phase 9 — Testing & QA](#phase-9--testing--qa)
- [Phase 10 — Deployment](#phase-10--deployment)

---

## Phase 0 — Project Setup & Tooling

**Goal:** Bootstrap a clean, working development environment before writing any feature code.

### Steps

1. **Scaffold the project**
   ```bash
   npm create vite@latest resume-builder -- --template react
   cd resume-builder
   npm install
   ```

2. **Install Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```
   Configure `tailwind.config.js`:
   ```js
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   darkMode: "class",
   ```

3. **Install shadcn/ui**
   ```bash
   npx shadcn@latest init
   ```
   During init choose: TypeScript → No (or Yes if preferred), CSS variables → Yes, Tailwind → Yes.

4. **Install core shadcn components you'll need**
   ```bash
   npx shadcn@latest add button input label card tabs separator badge
   npx shadcn@latest add select textarea switch tooltip accordion
   npx shadcn@latest add dropdown-menu sheet dialog progress
   ```

5. **Install additional dependencies**
   ```bash
   npm install html2pdf.js
   npm install react-hook-form
   npm install @hookform/resolvers zod
   npm install lucide-react
   npm install clsx tailwind-merge
   npm install zustand          # lightweight state management
   npm install react-beautiful-dnd  # drag-to-reorder sections
   ```

6. **Folder structure**
   ```
   src/
   ├── components/
   │   ├── ui/              ← shadcn auto-generated
   │   ├── form/            ← form section components
   │   ├── preview/         ← resume preview components
   │   ├── templates/       ← resume layout templates
   │   └── shared/          ← reusable pieces (ThemeToggle, etc.)
   ├── store/               ← Zustand stores
   ├── hooks/               ← custom React hooks
   ├── lib/                 ← utils, pdf export, ats helpers
   ├── types/               ← TypeScript types / JSDoc types
   └── App.jsx
   ```

### Deliverable
- Dev server runs at `localhost:5173`
- Tailwind and shadcn working with a basic "Hello" component
- Dark mode class toggle verified

---

## Phase 1 — Layout & Theme System

**Goal:** Build the application shell — two-panel layout with a working dark/light toggle.

### Steps

1. **App shell layout**

   Create a two-column layout:
   - **Left panel (40%)** — Scrollable form area
   - **Right panel (60%)** — Live resume preview (sticky/fixed)

   On mobile: stacked vertically with a tab switcher (Form | Preview).

   ```jsx
   // src/App.jsx
   <div className="flex h-screen overflow-hidden bg-background text-foreground">
     <FormPanel />       {/* left */}
     <PreviewPanel />    {/* right */}
   </div>
   ```

2. **Dark / Light mode**

   - Store theme preference in `localStorage`
   - Toggle via a `ThemeToggle` button in the top navbar using shadcn `Switch` or `Button`
   - Apply `dark` class to `<html>` element

   ```jsx
   // src/hooks/useTheme.js
   const [theme, setTheme] = useState(
     () => localStorage.getItem("theme") || "light"
   );
   useEffect(() => {
     document.documentElement.classList.toggle("dark", theme === "dark");
     localStorage.setItem("theme", theme);
   }, [theme]);
   ```

3. **Top Navbar**
   - App logo / name
   - `ThemeToggle` (sun/moon icon)
   - `Download PDF` button (wired up in Phase 6)
   - `Save Draft` button (wired up in Phase 8)

4. **Responsive breakpoints**

   | Breakpoint | Layout |
   |---|---|
   | `< md` (mobile) | Single column, tab toggle |
   | `md` – `lg` | Side by side, 40/60 split |
   | `> xl` | Side by side, wider preview |

### Deliverable
- Shell renders in both light and dark mode
- Toggle persists on page reload
- Mobile layout with tab switching works

---

## Phase 2 — Resume Data Model & State Management

**Goal:** Define a single source of truth for all resume data that every form and preview component reads from.

### Resume Data Shape

```js
// src/types/resume.js  (or types/resume.ts)

const defaultResume = {
  meta: {
    template: "classic",        // "classic" | "modern" | "minimal"
    accentColor: "#2563eb",     // user-chosen hex
    fontFamily: "Inter",        // "Inter" | "Merriweather" | "Roboto Mono"
    fontSize: "md",             // "sm" | "md" | "lg"
    pageMargin: "normal",       // "tight" | "normal" | "wide"
    showPhoto: false,
    sectionOrder: [             // drag-to-reorder
      "summary", "experience", "education",
      "skills", "projects", "certifications",
      "languages", "awards", "references"
    ],
    hiddenSections: [],         // sections user toggled off
  },

  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    photo: null,                // base64 or null
  },

  summary: "",                  // plain text

  experience: [
    {
      id: "",                   // uuid
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      bullets: [""],            // array of bullet strings
    }
  ],

  education: [
    {
      id: "",
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
      honors: "",
    }
  ],

  skills: [
    {
      id: "",
      category: "",             // e.g. "Frontend", "Languages"
      items: [""],
    }
  ],

  projects: [
    {
      id: "",
      name: "",
      role: "",
      description: "",
      techStack: [""],
      link: "",
      startDate: "",
      endDate: "",
    }
  ],

  certifications: [
    {
      id: "",
      name: "",
      issuer: "",
      date: "",
      url: "",
    }
  ],

  languages: [
    { id: "", language: "", proficiency: "" }
  ],

  awards: [
    { id: "", title: "", issuer: "", date: "", description: "" }
  ],

  references: [
    { id: "", name: "", position: "", company: "", email: "", phone: "" }
  ],
};
```

### Zustand Store

```js
// src/store/resumeStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useResumeStore = create(
  persist(
    (set, get) => ({
      resume: defaultResume,
      updatePersonal: (data) => set(s => ({ resume: { ...s.resume, personal: { ...s.resume.personal, ...data } } })),
      updateMeta: (data) => set(s => ({ resume: { ...s.resume, meta: { ...s.resume.meta, ...data } } })),
      updateSection: (section, data) => set(s => ({ resume: { ...s.resume, [section]: data } })),
      addItem: (section, item) => set(s => ({ resume: { ...s.resume, [section]: [...s.resume[section], item] } })),
      removeItem: (section, id) => set(s => ({ resume: { ...s.resume, [section]: s.resume[section].filter(i => i.id !== id) } })),
      updateItem: (section, id, data) => set(s => ({
        resume: {
          ...s.resume,
          [section]: s.resume[section].map(i => i.id === id ? { ...i, ...data } : i)
        }
      })),
      reorderSections: (newOrder) => set(s => ({ resume: { ...s.resume, meta: { ...s.resume.meta, sectionOrder: newOrder } } })),
      resetResume: () => set({ resume: defaultResume }),
    }),
    { name: "resume-draft" }  // auto-persists to localStorage
  )
);
```

### Deliverable
- All resume state lives in one Zustand store
- State auto-persists to `localStorage` (free "Save Draft" feature)
- Helper actions cover CRUD for every section

---

## Phase 3 — Form Sections (Input Side)

**Goal:** Build all form sections that the user fills out to populate their resume.

> Every field uses `react-hook-form` + `zod` validation. shadcn components handle all UI.

### 3.1 — Navigation / Section Sidebar

- A vertical list of section names on the left-of-the-form area
- Clicking a section scrolls to its form accordion
- Active section is highlighted
- Toggle visibility of any section via an eye icon (adds to `meta.hiddenSections`)
- Drag handle to reorder sections (`react-beautiful-dnd`)

### 3.2 — Personal Information Form

Fields:
- Full Name `*`
- Job Title `*`
- Email `*`
- Phone
- Location (City, Country)
- Website URL
- LinkedIn URL
- GitHub URL
- Profile Photo (optional — file upload → converted to base64)

UI: shadcn `Card` + `Input` + `Label`. Two-column grid on wider screens.

### 3.3 — Professional Summary Form

- Single `Textarea` (resizable)
- Character count with ATS tip: aim for 50–200 words
- Inline tip: "Use keywords from the job description here"

### 3.4 — Work Experience Form

For each entry:
- Company Name `*`
- Job Title / Position `*`
- Location
- Start Date (Month/Year picker)
- End Date (Month/Year picker) OR "Currently Working Here" toggle
- Bullet Points — dynamic list:
  - Add bullet button
  - Each bullet is an `Input` with a drag handle (reorder) and delete icon
  - ATS tip: start each bullet with an action verb

Interactions:
- "Add Experience" button appends a new blank entry
- Each entry is collapsible (shadcn `Accordion`)
- Drag to reorder entries

### 3.5 — Education Form

For each entry:
- Institution Name `*`
- Degree (e.g., Bachelor of Science) `*`
- Field of Study `*`
- Start / End Date
- GPA (optional)
- Honors / Awards (optional)

### 3.6 — Skills Form

Structured as categories:
- Category Name (e.g., "Frontend", "Tools", "Soft Skills")
- Skill Tags — type and press Enter to add a tag; click tag to remove
- "Add Category" button
- Drag to reorder categories

UI: shadcn `Badge` for tags, `Input` for entry

### 3.7 — Projects Form

For each project:
- Project Name `*`
- Role
- Description (`Textarea`)
- Tech Stack (tag input)
- Project URL
- Start / End Date

### 3.8 — Certifications Form

For each certification:
- Certification Name `*`
- Issuing Organization `*`
- Date Issued
- Credential URL

### 3.9 — Languages Form

For each language:
- Language Name
- Proficiency Level (`Select`: Beginner / Intermediate / Advanced / Native)

### 3.10 — Awards & Honors Form

For each award:
- Title `*`
- Issuer
- Date
- Short Description (`Textarea`)

### 3.11 — References Form

- Toggle: "Available upon request" (auto-fills section) OR manual entries
- For each reference:
  - Full Name
  - Position
  - Company
  - Email
  - Phone

### Form UX Details
- All optional sections can be collapsed or hidden
- Inline validation shows errors on blur
- Autosave after every keystroke (Zustand + `persist` = free)
- "Add" buttons always visible at bottom of each section
- Empty state prompts in each section (e.g., "No experience added yet. Click + to add.")

### Deliverable
- All 10 form sections built and wired to Zustand store
- Validation working on required fields
- Dynamic add/remove/reorder for all list-based sections

---

## Phase 4 — Live Resume Preview (Output Side)

**Goal:** Render a real-time, pixel-faithful preview of the resume as the user fills in the form.

### Architecture

```
PreviewPanel
  └── ResumeDocument (ref="resume-root" — this is what gets exported to PDF)
       ├── ResumeHeader       ← personal info
       ├── ResumeSummary
       ├── ResumeSection      ← renders each section in sectionOrder
       │    ├── ExperienceSection
       │    ├── EducationSection
       │    ├── SkillsSection
       │    ├── ProjectsSection
       │    ├── CertificationsSection
       │    ├── LanguagesSection
       │    ├── AwardsSection
       │    └── ReferencesSection
       └── (hidden sections are skipped)
```

### Preview Behavior
- Scrollable within the right panel
- Styled to look like an A4 page (white background, subtle shadow, fixed width ~794px scaled to fit)
- Uses the `meta` settings (font, accent color, margin, template) from the store
- Hidden sections from `meta.hiddenSections` are not rendered
- Sections render in the order defined by `meta.sectionOrder`
- Empty sections are not rendered (no blank space)
- Real-time: any form change instantly reflects in the preview

### A4 Page Simulation

```jsx
<div
  id="resume-root"
  className="bg-white text-black mx-auto shadow-lg"
  style={{
    width: "794px",
    minHeight: "1123px",
    padding: `${marginMap[meta.pageMargin]}px`,
    fontFamily: meta.fontFamily,
    fontSize: fontSizeMap[meta.fontSize],
  }}
>
  {/* resume content */}
</div>
```

> The preview panel scales this down using CSS `transform: scale()` so it fits on screen.

### Section Rendering Rules (ATS-safe)
- Use semantic HTML: `<h1>`, `<h2>`, `<h3>`, `<p>`, `<ul>`, `<li>`
- No tables, no multi-column CSS (ATS parsers hate these)
- No images in text flow (photo in header only, with toggle)
- All text selectable (no canvas rendering)
- Avoid absolute positioning in the exported area

### Deliverable
- Live preview renders correctly for all form sections
- Scales to fit within the right panel
- Empty sections gracefully omitted
- Custom font, color, and margin applied

---

## Phase 5 — Template & Customization System

**Goal:** Let users change the look of their resume without touching any form data.

### Customization Options (Sidebar Panel or Modal)

Open via a "Customize" or "Design" button in the top navbar, using a shadcn `Sheet` (slide-over drawer).

#### 5.1 — Template Picker
Three built-in templates (all ATS-safe):

| Template | Description |
|---|---|
| **Classic** | Clean serif, single column, traditional dividers |
| **Modern** | Sans-serif, accent sidebar strip, bold name |
| **Minimal** | Lots of whitespace, no dividers, ultra clean |

Display as visual thumbnail cards; active template is highlighted.

#### 5.2 — Accent Color Picker
- A grid of 12 preset colors (blues, greens, purples, neutrals, etc.)
- Plus a free-form hex color input
- Color applies to: section headings, divider lines, links, skill badges

#### 5.3 — Font Family Picker
- `Inter` — clean and modern (default)
- `Merriweather` — traditional / academic
- `Roboto Mono` — technical / developer

#### 5.4 — Font Size
- Small / Medium / Large toggle (`ToggleGroup`)

#### 5.5 — Page Margin
- Tight / Normal / Wide toggle

#### 5.6 — Show / Hide Profile Photo
- `Switch` toggle — adds or removes the photo from the header

#### 5.7 — Section Reorder
- Visual drag-and-drop list of all active sections
- Uses `react-beautiful-dnd`
- Changes are reflected immediately in the preview

#### 5.8 — Section Visibility
- Toggle each section on/off using a switch next to the section name
- Hidden sections disappear from the preview but data is NOT lost

### Deliverable
- Customization drawer fully functional
- All meta settings persist in Zustand store (and therefore in `localStorage`)
- Preview updates in real time when any design setting changes

---

## Phase 6 — PDF Export

**Goal:** Export the rendered resume as a high-quality, ATS-parseable PDF, max 10MB.

### Library Choice: `html2pdf.js`

> Chosen because it renders the actual DOM (not a canvas screenshot), producing text-selectable, ATS-readable PDF output.

```bash
npm install html2pdf.js
```

### Export Implementation

```js
// src/lib/exportPdf.js
import html2pdf from "html2pdf.js";

export async function exportResumeToPdf(resumeName = "resume") {
  const element = document.getElementById("resume-root");

  const options = {
    margin:       0,
    filename:     `${resumeName}.pdf`,
    image:        { type: "jpeg", quality: 0.92 },
    html2canvas:  {
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
    pagebreak: { mode: ["avoid-all", "css"] },
  };

  await html2pdf().set(options).from(element).save();
}
```

### Size Control (keep under 10MB)
- Image quality: `0.92` (adjust down if needed)
- Scale: `2` for sharp text, lower to `1.5` if file is too large
- JPEG compression on embedded images
- Profile photo compressed to max 200×200px before embedding
- After export, estimate file size and warn user if > 10MB with a toast

### Export Button UX
- "Download PDF" in navbar
- Shows a `Progress` bar or spinner while generating
- Toast notification: "✅ Resume downloaded!" or "⚠️ File may be large — try reducing image quality in settings"
- File is named: `[FullName]-Resume.pdf`

### Multi-page Handling
- If content overflows A4 height, `html2pdf` automatically creates page 2
- Use `page-break-inside: avoid` on section blocks to prevent awkward splits
- Add a soft page overflow warning in the preview ("Your resume exceeds 1 page")

### Deliverable
- One-click PDF export working
- Output is ATS-parseable (text-based, not image-based)
- File size stays under 10MB for typical resumes
- Multi-page resumes handled gracefully

---

## Phase 7 — ATS Optimization Layer

**Goal:** Help users write a resume that actually passes Applicant Tracking Systems.

### 7.1 — ATS Score Panel (optional sidebar)

A collapsible panel below the form that shows a live ATS health score.

Checks to run:
- [ ] Full name present
- [ ] Email and phone present
- [ ] Summary is between 50–200 words
- [ ] At least 1 work experience entry
- [ ] Each experience has at least 2 bullet points
- [ ] Bullet points start with action verbs (compare against a list of 100+ common ATS-friendly verbs)
- [ ] Skills section populated
- [ ] No special characters in headings
- [ ] No tables used (always true in this app — can be shown as guaranteed ✅)
- [ ] No columns used (same — always safe)

Display as a score out of 100 with color (red / yellow / green) and per-item pass/fail list.

### 7.2 — Inline Tips
- Each form field can have a small tooltip (shadcn `Tooltip`) with ATS-specific advice
- Example: Job Title field → "Match this exactly to the job posting title for best ATS results"
- Skills field → "Include exact keywords from the job description"

### 7.3 — ATS-Safe Rendering Rules (enforced in preview)
- All text rendered as real HTML text (not images or canvas)
- Standard section heading labels (e.g., "Work Experience", not "Where I've Been")
- No headers/footers that repeat across pages
- Dates in consistent format (Month YYYY)
- File exported as actual PDF text, not a scanned image

### 7.4 — ATS Warning Badges
Show a small warning badge on sections that have issues:
- Experience entry missing dates → yellow badge
- Bullet point starting with a noun instead of verb → yellow badge
- Summary too long or too short → yellow badge

### Deliverable
- Live ATS score computed and displayed
- Inline tips on key fields
- Warning badges on problematic entries

---

## Phase 8 — Persistence & UX Polish

**Goal:** Make the app feel complete, smooth, and delightful to use.

### 8.1 — Auto-Save (already free via Zustand `persist`)
- State persists to `localStorage` automatically
- Show "Auto-saved" indicator in navbar that fades after a few seconds

### 8.2 — Import / Export JSON
- **Export Draft**: download the full resume JSON so users can back it up
- **Import Draft**: upload a previously exported JSON to restore their resume

```js
// Export
const json = JSON.stringify(resumeStore.resume, null, 2);
const blob = new Blob([json], { type: "application/json" });
const url = URL.createObjectURL(blob);
// trigger download

// Import
const reader = new FileReader();
reader.onload = (e) => {
  const data = JSON.parse(e.target.result);
  resumeStore.loadResume(data);
};
```

### 8.3 — Reset / Clear Confirmation
- "Start Over" button in settings
- Shows a shadcn `Dialog` confirmation: "This will erase all your data. Are you sure?"
- Calls `resumeStore.resetResume()`

### 8.4 — Print Shortcut
- `Ctrl/Cmd + P` triggers the PDF export (not the browser print dialog)

### 8.5 — Keyboard Navigation
- All form controls reachable via Tab
- Modals and dialogs trap focus correctly (shadcn handles this)
- Escape closes modals/drawers

### 8.6 — Loading & Empty States
- Initial load shows a skeleton placeholder in the preview if store is empty
- Each empty form section has an illustrated empty state prompt

### 8.7 — Toasts & Feedback
- All actions show a `toast` notification (use shadcn Sonner)
- Success: green — "Section saved", "PDF downloaded"
- Warning: yellow — "Resume may exceed 10MB"
- Error: red — "Export failed. Please try again."

### 8.8 — Accessibility
- All inputs have associated `<label>`
- Color contrast AA compliant in both light and dark mode
- Focus rings visible
- `aria-label` on icon-only buttons
- Reduced motion preference respected (no animations if `prefers-reduced-motion: reduce`)

### Deliverable
- All UX polish applied
- App feels production-quality
- Accessible and keyboard-navigable

---

## Phase 9 — Testing & QA

**Goal:** Verify everything works correctly before shipping.

### 9.1 — Manual Test Checklist

**Theme**
- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] Theme persists on page refresh

**Forms**
- [ ] All fields save to store
- [ ] Validation errors show on invalid input
- [ ] Adding / removing items in all list sections works
- [ ] Drag-to-reorder works in experience, education, skills

**Preview**
- [ ] Preview reflects form changes in real time
- [ ] Hidden sections do not appear in preview
- [ ] Section order in preview matches `meta.sectionOrder`
- [ ] Empty sections are not rendered

**Customization**
- [ ] All 3 templates render correctly
- [ ] Accent color applies across all sections
- [ ] Font changes apply to preview
- [ ] Margin changes apply to preview
- [ ] Section reorder in customization panel works

**PDF Export**
- [ ] PDF downloads successfully
- [ ] PDF text is selectable (ATS-parseable)
- [ ] File size is under 10MB
- [ ] Multi-page resume exports both pages correctly
- [ ] Filename is `[FullName]-Resume.pdf`

**Persistence**
- [ ] Draft auto-saves to localStorage
- [ ] Refreshing the page restores the draft
- [ ] JSON export downloads a valid file
- [ ] JSON import restores the correct data
- [ ] "Reset" clears all data

**Responsive / Mobile**
- [ ] Tab toggle between Form and Preview on mobile
- [ ] All form fields usable on mobile

### 9.2 — ATS Parsability Test
- Export a PDF and upload to a free ATS checker (e.g., `resume.io` ATS checker, `jobscan.co`)
- Verify all text is extracted correctly
- Verify section headings are recognized

### Deliverable
- All checklist items pass
- PDF passes external ATS check

---

## Phase 10 — Deployment

**Goal:** Ship the app to a public URL.

### Option A — Vercel (Recommended)
```bash
npm run build
# Connect GitHub repo to Vercel
# Zero-config Vite deployment
```

### Option B — Netlify
```bash
npm run build
# Drag-and-drop `dist/` folder to Netlify drop zone
# Or connect GitHub repo
```

### Option C — GitHub Pages
```bash
# In vite.config.js: set base: "/resume-builder/"
npm run build
npm install -D gh-pages
# Add deploy script to package.json
```

### Build Optimization
- Ensure `npm run build` produces no errors
- Check final bundle size with `npx vite-bundle-visualizer`
- Lazy-load the PDF export library (it's heavy) using dynamic `import()`

```js
// Lazy load html2pdf only when user clicks export
const handleExport = async () => {
  const { exportResumeToPdf } = await import("../lib/exportPdf");
  await exportResumeToPdf(resume.personal.fullName);
};
```

### Environment
- No backend required — this is a fully client-side app
- No API keys needed
- All data stays in the user's browser (`localStorage`)

### Deliverable
- App live at public URL
- Build passes with no errors
- Lighthouse score: Performance ≥ 90, Accessibility ≥ 90

---

## 🗺️ Phase Summary Table

| Phase | Name | Estimated Effort |
|---|---|---|
| 0 | Project Setup & Tooling | ~1–2 hours |
| 1 | Layout & Theme System | ~2–3 hours |
| 2 | Data Model & State Management | ~2 hours |
| 3 | Form Sections | ~6–8 hours |
| 4 | Live Resume Preview | ~4–5 hours |
| 5 | Template & Customization System | ~3–4 hours |
| 6 | PDF Export | ~2–3 hours |
| 7 | ATS Optimization Layer | ~2–3 hours |
| 8 | Persistence & UX Polish | ~3–4 hours |
| 9 | Testing & QA | ~2–3 hours |
| 10 | Deployment | ~1 hour |
| | **Total** | **~28–38 hours** |

---

## 🔑 Key Technical Decisions

| Decision | Choice | Reason |
|---|---|---|
| State management | Zustand + persist | Lightweight, no boilerplate, free auto-save |
| Form handling | react-hook-form + zod | Performant, type-safe validation |
| PDF export | html2pdf.js | Text-based PDF (ATS-safe), not canvas screenshot |
| Drag & drop | react-beautiful-dnd | Stable, accessible |
| UI components | shadcn/ui | Unstyled base, fully Tailwind-compatible |
| Styling | Tailwind CSS + CSS variables | Dark mode, theming, and customization |
| Build tool | Vite | Fast HMR, great DX |
| Deployment | Vercel | Zero-config, free tier |

---

## 📎 Notes

- **No backend needed** — everything runs in the browser
- **Privacy-first** — resume data never leaves the user's device
- **Offline capable** — works without internet (after initial load)
- **Extensible** — adding a new section follows the same pattern as existing ones
- **ATS-safe by design** — semantic HTML and text-based PDF are baked in from the start, not an afterthought
