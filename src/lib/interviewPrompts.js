import { INTERVIEW_STAGES } from "@/types/interview";

function stageMeta(stageId) {
  return INTERVIEW_STAGES.find((s) => s.id === stageId);
}

function formatResumeContext(resume) {
  if (!resume) return "No resume provided.";
  const { personal, summary, experience, education, skills } = resume;
  const exp = (experience || [])
    .slice(0, 4)
    .map(
      (e) =>
        `- ${e.position} at ${e.company} (${e.startDate || "?"} – ${e.current ? "Present" : e.endDate || "?"})`
    )
    .join("\n");
  const edu = (education || [])
    .slice(0, 2)
    .map((e) => `- ${e.degree} in ${e.field}, ${e.institution}`)
    .join("\n");
  const skillList = (skills || [])
    .flatMap((g) => g.items || [])
    .slice(0, 20)
    .join(", ");

  return `Candidate: ${personal?.fullName || "Unknown"}
Current title: ${personal?.jobTitle || "N/A"}
Summary: ${summary || "N/A"}
Experience:
${exp || "N/A"}
Education:
${edu || "N/A"}
Skills: ${skillList || "N/A"}`;
}

export function buildInterviewerSystemPrompt({ jobPosition, stageId, resume, company }) {
  const stage = stageMeta(stageId);
  return `You are a professional job interviewer conducting the "${stage?.label}" round for the position: ${jobPosition}${company ? ` at ${company}` : ""}.

Stage focus: ${stage?.description}

Rules:
- Ask ONE question at a time — typical, realistic interview questions for this stage and role.
- Be professional, concise, and conversational (2-4 sentences max per message).
- Tailor questions to the job position and candidate background when provided.
- Do NOT answer your own questions. Do NOT give coaching unless explicitly asked in a separate coaching request.
- Vary question types: behavioral (STAR), situational, technical/role-specific, motivation, and closing-style as appropriate for this stage.
- Pre-screening: availability, salary range, why this role, basic qualifications.
- Initial: deeper behavioral, teamwork, problem-solving, role scenarios.
- Final: leadership, long-term goals, culture fit, strategic thinking.

Candidate background:
${formatResumeContext(resume)}`;
}

export function buildQuestionUserPrompt({
  jobPosition,
  stageId,
  questionNumber,
  totalQuestions,
  transcript,
}) {
  const stage = stageMeta(stageId);
  const history = transcript
    .filter((m) => m.type === "question" || m.type === "answer")
    .map((m) => `${m.role === "assistant" ? "Interviewer" : "Candidate"}: ${m.content}`)
    .join("\n");

  const isFirst = questionNumber === 1;

  return isFirst
    ? `Start the ${stage?.label} round. Greet the candidate briefly, then ask question 1 of ${totalQuestions}. Return ONLY the interviewer message (no JSON).`
    : `Continue the ${stage?.label} round. Ask question ${questionNumber} of ${totalQuestions} for ${jobPosition}.

Previous exchange:
${history || "(none)"}

Ask a NEW question that has not been asked yet. Return ONLY the interviewer message.`;
}

export function buildRealtimeCoachingPrompt({
  jobPosition,
  stageId,
  question,
  answer,
  resume,
  company,
}) {
  const stage = stageMeta(stageId);
  return `You are an expert interview coach. The candidate is interviewing for: ${jobPosition}${company ? ` at ${company}` : ""}.
Stage: ${stage?.label}

Question asked: ${question}
Candidate's answer: ${answer}

Candidate background (use this to personalize the sample answer when available):
${formatResumeContext(resume)}

Respond in markdown with EXACTLY these sections:

## What went well
(1-2 sentences on a strength in their answer)

## How to improve
(1-2 sentences on one specific gap or weakness)

## Sample answer for next time
Write a complete example answer in first person (4-6 sentences) as if the candidate is speaking in the interview. Use STAR format for behavioral questions when appropriate. Base it on their real background when resume details are available; otherwise use realistic placeholder experience. This should show them what a strong answer sounds like — not just tips.

Be encouraging but honest. Do not add extra sections.`;
}

export function buildStageFeedbackPrompt({
  jobPosition,
  stageId,
  transcript,
  resume,
  company,
}) {
  const stage = stageMeta(stageId);
  const qa = transcript
    .filter((m) => m.stage === stageId && (m.type === "question" || m.type === "answer"))
    .map((m) => `${m.type === "question" ? "Q" : "A"}: ${m.content}`)
    .join("\n\n");

  return `You are an expert interview coach reviewing a completed ${stage?.label} for the role: ${jobPosition}${company ? ` at ${company}` : ""}.

Candidate background:
${formatResumeContext(resume)}

Full Q&A from this stage:
${qa}

Provide structured feedback in markdown:
## Overall impression
(2-3 sentences)

## Strengths
- (3 bullet points)

## Areas to improve
- (3 bullet points)

## Sample answers to study
For each question in this stage where the candidate's answer was weak or incomplete, provide:
- The original question (quoted briefly)
- A full sample answer in first person (4-6 sentences) they could use in a real interview

Give at least 2 sample answers when possible. Personalize using their background when available.

## Readiness for next round
(1-2 sentences)`;
}

export function buildFinalSummaryPrompt({ jobPosition, allTranscript }) {
  const summary = allTranscript
    .filter((m) => m.type === "question" || m.type === "answer" || m.type === "feedback")
    .map((m) => `[${m.stage}] ${m.type}: ${m.content.slice(0, 500)}`)
    .join("\n");

  return `You are an expert career coach. The candidate completed a full 3-stage mock interview for: ${jobPosition}.

Session log:
${summary}

Provide a final report in markdown:
## Executive summary
## Top 3 strengths demonstrated
## Top 3 priorities to practice
## Recommended preparation before a real interview
## Confidence score (1-10) with brief justification`;
}
