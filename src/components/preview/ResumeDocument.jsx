import { useResumeStore } from "@/store/resumeStore";
import { formatDate } from "@/lib/utils";
import { getPaperSize } from "@/lib/paperSizes";

const fontSizeMap = { sm: "11px", md: "12px", lg: "13px" };
const marginMap   = { tight: 32, normal: 48, wide: 64 };

// ─────────────────────────────────────────────────────────────────────────────
// Theme factory — returns a style object for each template
// ─────────────────────────────────────────────────────────────────────────────
function getTheme(template, accent) {
  const ac = accent || "#1a1a1a";

  const themes = {
    // ── Classic ──────────────────────────────────────────────────
    classic: {
      fontFamily: "Georgia, 'Times New Roman', serif",
      headerAlign: "center",
      nameStyle: {
        fontSize: "22px", fontWeight: "700",
        textTransform: "uppercase", letterSpacing: "0.06em",
        color: "#111", margin: "0 0 3px 0", lineHeight: 1.2,
      },
      jobTitleStyle: {
        fontSize: "12px", color: "#555",
        margin: "0 0 3px 0", fontWeight: "400",
      },
      contactsStyle: {
        fontSize: "11px", color: "#333",
        lineHeight: 1.6, margin: 0,
      },
      contactSep: " | ",
      headerMarginBottom: "14px",
      sectionGap: "12px",
      sectionHeading: (title) => ({
        wrapper: { marginBottom: "5px" },
        text: {
          fontSize: "13px", fontWeight: "700",
          textTransform: "uppercase", letterSpacing: "0.08em",
          color: ac, margin: "0 0 5px 0",
        },
        rule: { height: "1px", backgroundColor: ac, opacity: 0.8 },
      }),
      entryTop: { marginTop: "6px" },
      entryTitleStyle: { fontSize: "12px", fontWeight: "700", color: "#111" },
      subtitleStyle: { fontSize: "11px", color: "#444", fontStyle: "italic", margin: "1px 0 2px 0" },
      dateStyle: { fontSize: "11px", color: "#444", whiteSpace: "nowrap", marginLeft: "8px", textAlign: "right" },
      bulletStyle: { margin: "3px 0 0 0", paddingLeft: "16px", listStyleType: "disc" },
      bulletItemStyle: { fontSize: "inherit", color: "#222", lineHeight: 1.5, marginBottom: "2px" },
      bodyText: { fontSize: "inherit", color: "#222", lineHeight: 1.55, margin: "4px 0 0 0", textAlign: "justify" },
      supportsPhoto: false,
    },

    // ── Classic + Photo ────────────────────────────────────────────
    "classic-photo": {
      fontFamily: "Georgia, 'Times New Roman', serif",
      headerAlign: "left",
      nameStyle: {
        fontSize: "24px", fontWeight: "700",
        textTransform: "uppercase", letterSpacing: "0.04em",
        color: ac, margin: "0 0 4px 0", lineHeight: 1.15,
      },
      jobTitleStyle: {
        fontSize: "12px", color: "#111",
        margin: "0 0 6px 0", fontWeight: "700",
        textTransform: "uppercase", letterSpacing: "0.03em",
      },
      contactsStyle: {
        fontSize: "11px", color: "#555",
        lineHeight: 1.5, margin: 0,
      },
      contactSep: " | ",
      headerMarginBottom: "14px",
      headerBottomRule: true,
      sectionGap: "12px",
      sectionHeading: (title) => ({
        wrapper: { marginBottom: "5px" },
        text: {
          fontSize: "13px", fontWeight: "700",
          textTransform: "uppercase", letterSpacing: "0.08em",
          color: ac, margin: "0 0 5px 0",
        },
        rule: { height: "1px", backgroundColor: ac, opacity: 0.8 },
      }),
      entryTop: { marginTop: "6px" },
      entryTitleStyle: { fontSize: "12px", fontWeight: "700", color: "#111" },
      subtitleStyle: { fontSize: "11px", color: "#444", fontStyle: "italic", margin: "1px 0 2px 0" },
      dateStyle: { fontSize: "11px", color: "#444", whiteSpace: "nowrap", marginLeft: "8px", textAlign: "right" },
      bulletStyle: { margin: "3px 0 0 0", paddingLeft: "16px", listStyleType: "disc" },
      bulletItemStyle: { fontSize: "inherit", color: "#222", lineHeight: 1.5, marginBottom: "2px" },
      bodyText: { fontSize: "inherit", color: "#222", lineHeight: 1.55, margin: "4px 0 0 0", textAlign: "justify" },
      supportsPhoto: true,
      photoStyle: {
        width: "92px",
        height: "92px",
        objectFit: "cover",
        flexShrink: 0,
        border: "1px solid #ccc",
      },
    },

    // ── Modern ───────────────────────────────────────────────────
    modern: {
      fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
      headerAlign: "left",
      nameStyle: {
        fontSize: "26px", fontWeight: "700",
        textTransform: "none", letterSpacing: "-0.01em",
        color: "#0f0f0f", margin: "0 0 2px 0", lineHeight: 1.1,
      },
      jobTitleStyle: {
        fontSize: "13px", color: ac,
        margin: "0 0 6px 0", fontWeight: "500", letterSpacing: "0.01em",
      },
      contactsStyle: {
        fontSize: "11px", color: "#555",
        lineHeight: 1.6, margin: 0,
      },
      contactSep: " · ",
      headerMarginBottom: "20px",
      sectionGap: "16px",
      sectionHeading: (title) => ({
        wrapper: { marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" },
        text: {
          fontSize: "12px", fontWeight: "700",
          textTransform: "uppercase", letterSpacing: "0.1em",
          color: ac, margin: "0 0 0 0", flexShrink: 0,
        },
        rule: { flex: 1, height: "1px", backgroundColor: ac, opacity: 0.3 },
      }),
      entryTop: { marginTop: "10px" },
      entryTitleStyle: { fontSize: "13px", fontWeight: "700", color: "#0f0f0f" },
      subtitleStyle: { fontSize: "11.5px", color: ac, fontWeight: "500", margin: "1px 0 3px 0" },
      dateStyle: { fontSize: "11px", color: "#888", whiteSpace: "nowrap", marginLeft: "8px", textAlign: "right" },
      bulletStyle: { margin: "4px 0 0 0", paddingLeft: "14px", listStyleType: "disc" },
      bulletItemStyle: { fontSize: "inherit", color: "#333", lineHeight: 1.55, marginBottom: "3px" },
      bodyText: { fontSize: "inherit", color: "#333", lineHeight: 1.6, margin: "6px 0 0 0" },
    },

    // ── Minimal ──────────────────────────────────────────────────
    minimal: {
      fontFamily: "Inter, 'Helvetica Neue', Arial, sans-serif",
      headerAlign: "left",
      nameStyle: {
        fontSize: "24px", fontWeight: "300",
        textTransform: "none", letterSpacing: "0.02em",
        color: "#111", margin: "0 0 3px 0", lineHeight: 1.15,
      },
      jobTitleStyle: {
        fontSize: "12px", color: "#666",
        margin: "0 0 5px 0", fontWeight: "400",
      },
      contactsStyle: {
        fontSize: "11px", color: "#777",
        lineHeight: 1.7, margin: 0,
      },
      contactSep: "  ·  ",
      headerMarginBottom: "22px",
      sectionGap: "18px",
      sectionHeading: (title) => ({
        wrapper: { marginBottom: "8px" },
        text: {
          fontSize: "10px", fontWeight: "600",
          textTransform: "uppercase", letterSpacing: "0.18em",
          color: "#999", margin: "0 0 5px 0",
        },
        rule: { height: "0.5px", backgroundColor: "#ddd", opacity: 1 },
      }),
      entryTop: { marginTop: "10px" },
      entryTitleStyle: { fontSize: "12px", fontWeight: "600", color: "#111" },
      subtitleStyle: { fontSize: "11px", color: "#666", fontStyle: "normal", margin: "1px 0 3px 0" },
      dateStyle: { fontSize: "10.5px", color: "#aaa", whiteSpace: "nowrap", marginLeft: "8px", textAlign: "right" },
      bulletStyle: { margin: "4px 0 0 0", paddingLeft: "12px", listStyleType: "none" },
      bulletItemStyle: { fontSize: "inherit", color: "#444", lineHeight: 1.6, marginBottom: "3px" },
      bodyText: { fontSize: "inherit", color: "#444", lineHeight: 1.65, margin: "6px 0 0 0" },
    },
  };

  return themes[template] || themes.classic;
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared section heading renderer (template-aware)
// ─────────────────────────────────────────────────────────────────────────────
function SectionHeading({ title, theme }) {
  const s = theme.sectionHeading(title);
  return (
    <div style={s.wrapper}>
      {/*
        Use <div> instead of <h2> to avoid UA-stylesheet margins (margin-block-end: 0.83em)
        that inflate the gap in the PDF.  Pin lineHeight: 1 to eliminate half-leading so the
        rule sits exactly `margin-bottom` pixels below the text in both preview and PDF.
      */}
      <div style={{ ...s.text, lineHeight: 1, display: "block" }}>{title}</div>
      <div style={s.rule} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Entry row — left content + right date/location
// ─────────────────────────────────────────────────────────────────────────────
function EntryRow({ left, right, theme }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ flex: 1, minWidth: 0 }}>{left}</div>
      {right && (
        <div style={theme.dateStyle}>{right}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Resume Header
// ─────────────────────────────────────────────────────────────────────────────
function ResumeHeader({ personal, theme, showPhoto, accentColor }) {
  const contacts = (theme.supportsPhoto
    ? [personal.location, personal.phone, personal.email, personal.website, personal.linkedin, personal.github]
    : [personal.email, personal.phone, personal.website, personal.linkedin, personal.github, personal.location]
  ).filter(Boolean);

  const nameStyle = theme.supportsPhoto
    ? { ...theme.nameStyle, color: accentColor || theme.nameStyle.color }
    : theme.nameStyle;

  const textBlock = (
    <>
      <h1 style={nameStyle}>{personal.fullName || "Your Name"}</h1>
      {personal.jobTitle && (
        <p style={theme.jobTitleStyle}>{personal.jobTitle}</p>
      )}
      {contacts.length > 0 && (
        <p style={theme.contactsStyle}>
          {contacts.join(theme.contactSep)}
        </p>
      )}
    </>
  );

  const displayPhoto = theme.supportsPhoto && showPhoto && personal.photo;
  const wrapperStyle = {
    textAlign: theme.headerAlign,
    marginBottom: theme.headerMarginBottom,
  };

  const bottomRule = theme.headerBottomRule ? (
    <div
      style={{
        height: "2px",
        backgroundColor: accentColor || "#1a1a1a",
        marginTop: "12px",
        opacity: 0.85,
      }}
    />
  ) : null;

  if (!displayPhoto) {
    return (
      <div style={wrapperStyle}>
        {textBlock}
        {bottomRule}
      </div>
    );
  }

  return (
    <div style={{ marginBottom: theme.headerMarginBottom }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
          {textBlock}
        </div>
        <img
          src={personal.photo}
          alt={personal.fullName || "Profile photo"}
          style={theme.photoStyle}
        />
      </div>
      {bottomRule}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section renderers
// ─────────────────────────────────────────────────────────────────────────────
function ResumeSummary({ text, theme }) {
  if (!text?.trim()) return null;
  return (
    <div style={{ marginBottom: theme.sectionGap }}>
      <SectionHeading title="Profile" theme={theme} />
      <p style={theme.bodyText}>{text}</p>
    </div>
  );
}

function EducationSection({ education, theme }) {
  const items = education.filter((e) => e.institution?.trim());
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: theme.sectionGap }}>
      <SectionHeading title="Education" theme={theme} />
      {items.map((edu) => {
        const dateRange = [
          edu.startDate ? formatDate(edu.startDate) : "",
          edu.endDate   ? formatDate(edu.endDate)   : "",
        ].filter(Boolean).join(" – ");
        const degreeField = [edu.degree, edu.field].filter(Boolean).join(" of ");
        return (
          <div key={edu.id} style={theme.entryTop}>
            <EntryRow
              left={<span style={theme.entryTitleStyle}>{edu.institution}</span>}
              right={edu.location || ""}
              theme={theme}
            />
            {degreeField && (
              <EntryRow
                left={<span style={{ ...theme.subtitleStyle, fontStyle: "normal" }}>{degreeField}</span>}
                right={dateRange}
                theme={theme}
              />
            )}
            {edu.gpa && (
              <p style={{ fontSize: "11px", margin: "1px 0 0 0", color: "#555" }}>
                Cumulative GPA: {edu.gpa}
              </p>
            )}
            {edu.honors && (
              <p style={{ fontSize: "11px", margin: "1px 0 0 0", color: "#666" }}>
                {edu.honors}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ExperienceSection({ experience, theme }) {
  const items = experience.filter((e) => e.company?.trim() || e.position?.trim());
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: theme.sectionGap }}>
      <SectionHeading title="Work Experience" theme={theme} />
      {items.map((exp) => {
        const startFmt = exp.startDate ? formatDate(exp.startDate) : "";
        const endFmt   = exp.current ? "Present" : (exp.endDate ? formatDate(exp.endDate) : "");
        const dateRange = [startFmt, endFmt].filter(Boolean).join(" – ");
        const bullets   = exp.bullets.filter(Boolean);
        // Minimal uses en-dash bullets
        const bulletPrefix = theme === "minimal" ? "– " : "";
        return (
          <div key={exp.id} style={theme.entryTop}>
            <EntryRow
              left={<span style={theme.entryTitleStyle}>{exp.company}</span>}
              right={exp.location || null}
              theme={theme}
            />
            {(exp.position || dateRange) && (
              <EntryRow
                left={
                  exp.position ? (
                    <span style={{ ...theme.subtitleStyle, margin: 0 }}>{exp.position}</span>
                  ) : null
                }
                right={dateRange || null}
                theme={theme}
              />
            )}
            {bullets.length > 0 && (
              <ul style={theme.bulletStyle}>
                {bullets.map((b, i) => (
                  <li key={i} style={theme.bulletItemStyle}>
                    {theme.bulletStyle.listStyleType === "none" ? `– ${b}` : b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

function SkillsSection({ skills, theme }) {
  const cats = skills.filter((s) => s.items.length > 0);
  if (!cats.length) return null;
  return (
    <div style={{ marginBottom: theme.sectionGap }}>
      <SectionHeading title="Skills" theme={theme} />
      <ul style={theme.bulletStyle}>
        {cats.map((cat) => (
          <li key={cat.id} style={theme.bulletItemStyle}>
            {theme.bulletStyle.listStyleType === "none" ? "– " : ""}
            {cat.category && <strong>{cat.category}: </strong>}
            {cat.items.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProjectsSection({ projects, theme }) {
  const items = projects.filter((p) => p.name?.trim());
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: theme.sectionGap }}>
      <SectionHeading title="Projects" theme={theme} />
      {items.map((proj) => {
        const dateRange = [
          proj.startDate ? formatDate(proj.startDate) : "",
          proj.endDate   ? formatDate(proj.endDate)   : "",
        ].filter(Boolean).join(" – ");
        return (
          <div key={proj.id} style={theme.entryTop}>
            <EntryRow
              left={
                <span style={theme.entryTitleStyle}>
                  {proj.name}{proj.role ? ` — ${proj.role}` : ""}
                </span>
              }
              right={dateRange}
              theme={theme}
            />
            {proj.techStack?.length > 0 && (
              <p style={{ ...theme.subtitleStyle, fontStyle: "normal" }}>
                {proj.techStack.join(", ")}
              </p>
            )}
            {proj.description && (
              <p style={{ ...theme.bodyText, margin: "3px 0 0 0" }}>
                {proj.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CertificationsSection({ certifications, theme }) {
  const items = certifications.filter((c) => c.name?.trim());
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: theme.sectionGap }}>
      <SectionHeading title="Certifications" theme={theme} />
      {items.map((cert) => (
        <div key={cert.id} style={theme.entryTop}>
          <EntryRow
            left={
              <span style={theme.entryTitleStyle}>
                {cert.name}{cert.issuer ? ` — ${cert.issuer}` : ""}
              </span>
            }
            right={cert.date ? formatDate(cert.date) : ""}
            theme={theme}
          />
        </div>
      ))}
    </div>
  );
}

function LanguagesSection({ languages, theme }) {
  const items = languages.filter((l) => l.language?.trim());
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: theme.sectionGap }}>
      <SectionHeading title="Languages" theme={theme} />
      <ul style={theme.bulletStyle}>
        {items.map((l) => (
          <li key={l.id} style={theme.bulletItemStyle}>
            {theme.bulletStyle.listStyleType === "none" ? "– " : ""}
            {l.language}{l.proficiency ? ` (${l.proficiency})` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

function AwardsSection({ awards, theme }) {
  const items = awards.filter((a) => a.title?.trim());
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: theme.sectionGap }}>
      <SectionHeading title="Awards & Honors" theme={theme} />
      {items.map((award) => (
        <div key={award.id} style={theme.entryTop}>
          <EntryRow
            left={
              <span style={theme.entryTitleStyle}>
                {award.title}{award.issuer ? ` — ${award.issuer}` : ""}
              </span>
            }
            right={award.date ? formatDate(award.date) : ""}
            theme={theme}
          />
          {award.description && (
            <p style={{ ...theme.bodyText, margin: "2px 0 0 0" }}>{award.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function ReferencesSection({ references, onRequest, theme }) {
  if (onRequest) {
    return (
      <div style={{ marginBottom: theme.sectionGap }}>
        <SectionHeading title="References" theme={theme} />
        <p style={{ ...theme.bodyText, margin: "6px 0 0 0" }}>
          Available upon request.
        </p>
      </div>
    );
  }
  const items = references.filter((r) => r.name?.trim());
  if (!items.length) return null;
  return (
    <div style={{ marginBottom: theme.sectionGap }}>
      <SectionHeading title="References" theme={theme} />
      {items.map((ref) => (
        <div key={ref.id} style={theme.entryTop}>
          <p style={{ ...theme.entryTitleStyle, margin: 0 }}>{ref.name}</p>
          {(ref.position || ref.company) && (
            <p style={{ fontSize: "11px", margin: "1px 0 0 0", color: "#666" }}>
              {[ref.position, ref.company].filter(Boolean).join(", ")}
            </p>
          )}
          {(ref.email || ref.phone) && (
            <p style={{ fontSize: "11px", margin: "1px 0 0 0", color: "#777" }}>
              {[ref.email, ref.phone].filter(Boolean).join(" | ")}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Section registry
// ─────────────────────────────────────────────────────────────────────────────
const SECTION_COMPONENTS = {
  summary:        (resume, t) => <ResumeSummary        key="summary"        text={resume.summary}                                      theme={t} />,
  education:      (resume, t) => <EducationSection     key="education"      education={resume.education}                               theme={t} />,
  experience:     (resume, t) => <ExperienceSection    key="experience"     experience={resume.experience}                             theme={t} />,
  skills:         (resume, t) => <SkillsSection        key="skills"         skills={resume.skills}                                     theme={t} />,
  projects:       (resume, t) => <ProjectsSection      key="projects"       projects={resume.projects}                                 theme={t} />,
  certifications: (resume, t) => <CertificationsSection key="certs"         certifications={resume.certifications}                    theme={t} />,
  languages:      (resume, t) => <LanguagesSection     key="languages"      languages={resume.languages}                               theme={t} />,
  awards:         (resume, t) => <AwardsSection        key="awards"         awards={resume.awards}                                     theme={t} />,
  references:     (resume, t) => <ReferencesSection    key="refs"           references={resume.references}
                                                                            onRequest={resume.meta.referencesOnRequest ?? true}        theme={t} />,
};

// ─────────────────────────────────────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────────────────────────────────────
export function ResumeDocument() {
  const { resume } = useResumeStore();
  const { meta, personal } = resume;

  const paper      = getPaperSize(meta.paperSize || "letter");
  const padding    = marginMap[meta.pageMargin]  || 48;
  const fontSize   = fontSizeMap[meta.fontSize]  || "12px";
  const theme      = getTheme(meta.template, meta.accentColor);

  const visibleSections = meta.sectionOrder.filter(
    (s) => !meta.hiddenSections.includes(s)
  );

  return (
    <div
      id="document-root"
      style={{
        width:           `${paper.widthPx}px`,
        minHeight:       `${paper.heightPx}px`,
        backgroundColor: "#fff",
        color:           "#111",
        fontFamily:      meta.fontFamily || theme.fontFamily,
        fontSize,
        lineHeight:      1.45,
        padding:         `${padding}px`,
        boxSizing:       "border-box",
      }}
    >
      <ResumeHeader
        personal={personal}
        theme={theme}
        showPhoto={meta.showPhoto}
        accentColor={meta.accentColor}
      />

      {visibleSections.map((key) => {
        const renderer = SECTION_COMPONENTS[key];
        return renderer ? renderer(resume, theme) : null;
      })}
    </div>
  );
}
