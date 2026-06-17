const ACTION_VERBS = [
  "achieved","administered","analyzed","built","collaborated","communicated",
  "completed","conducted","coordinated","created","demonstrated","designed",
  "developed","directed","drove","edited","enhanced","established","evaluated",
  "executed","facilitated","generated","implemented","improved","increased",
  "initiated","launched","led","maintained","managed","mentored","monitored",
  "operated","organized","oversaw","performed","planned","prepared","presented",
  "produced","provided","reduced","researched","resolved","reviewed","scheduled",
  "streamlined","supervised","supported","trained","transformed","updated",
  "utilized","worked","wrote","accelerated","accomplished","adapted","administered",
  "advised","assessed","assisted","authored","automated","championed","coached",
  "compiled","configured","consolidated","constructed","contributed","controlled",
  "converted","customized","delivered","deployed","drafted","ensured","expanded",
  "formulated","guided","handled","headed","identified","influenced","integrated",
  "introduced","maximized","minimized","negotiated","optimized","partnered",
  "piloted","prioritized","processed","programmed","recommended","refactored",
  "reported","restructured","secured","simplified","solved","spearheaded","tested",
];

function startsWithActionVerb(bullet) {
  if (!bullet || !bullet.trim()) return false;
  const firstWord = bullet.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z]/g, "");
  return ACTION_VERBS.includes(firstWord);
}

function wordCount(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

export function computeAtsScore(resume) {
  const checks = [];

  // Personal info checks
  checks.push({
    id: "name",
    label: "Full name present",
    pass: !!resume.personal.fullName.trim(),
    weight: 10,
  });
  checks.push({
    id: "email",
    label: "Email address present",
    pass: !!resume.personal.email.trim(),
    weight: 10,
  });
  checks.push({
    id: "phone",
    label: "Phone number present",
    pass: !!resume.personal.phone.trim(),
    weight: 5,
  });

  // Summary checks
  const summaryWords = wordCount(resume.summary);
  checks.push({
    id: "summary_length",
    label: `Summary is 50–200 words (currently ${summaryWords})`,
    pass: summaryWords >= 50 && summaryWords <= 200,
    weight: 10,
  });

  // Experience checks
  const hasExperience = resume.experience.some((e) => e.company.trim());
  checks.push({
    id: "experience",
    label: "At least 1 work experience entry",
    pass: hasExperience,
    weight: 15,
  });

  const allBullets = resume.experience.flatMap((e) => e.bullets.filter(Boolean));
  const hasBullets = allBullets.length >= 2;
  checks.push({
    id: "bullets",
    label: "Experience entries have at least 2 bullet points",
    pass: hasBullets,
    weight: 10,
  });

  const verbCheck = allBullets.length > 0
    ? allBullets.filter(startsWithActionVerb).length / allBullets.length >= 0.7
    : false;
  checks.push({
    id: "action_verbs",
    label: "Bullets start with action verbs (≥70%)",
    pass: verbCheck,
    weight: 10,
  });

  // Skills check
  const hasSkills = resume.skills.some((s) => s.items.length > 0);
  checks.push({
    id: "skills",
    label: "Skills section populated",
    pass: hasSkills,
    weight: 10,
  });

  // Education check
  const hasEducation = resume.education.some((e) => e.institution.trim());
  checks.push({
    id: "education",
    label: "Education entry present",
    pass: hasEducation,
    weight: 10,
  });

  // ATS-safe checks (always pass in this app)
  checks.push({
    id: "no_tables",
    label: "No tables used (ATS-safe)",
    pass: true,
    weight: 5,
  });
  checks.push({
    id: "no_columns",
    label: "No multi-column layout (ATS-safe)",
    pass: true,
    weight: 5,
  });

  const totalWeight = checks.reduce((s, c) => s + c.weight, 0);
  const earnedWeight = checks.filter((c) => c.pass).reduce((s, c) => s + c.weight, 0);
  const score = Math.round((earnedWeight / totalWeight) * 100);

  return { score, checks };
}

export function getExperienceWarnings(exp) {
  const warnings = [];
  if (!exp.startDate) warnings.push("Missing start date");
  if (!exp.current && !exp.endDate) warnings.push("Missing end date");
  const badBullets = exp.bullets.filter(
    (b) => b.trim() && !startsWithActionVerb(b)
  );
  if (badBullets.length > 0)
    warnings.push("Some bullets don't start with an action verb");
  return warnings;
}
