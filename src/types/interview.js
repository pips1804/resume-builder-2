import { generateId } from "@/lib/utils";

export const INTERVIEW_STAGES = [
  {
    id: "pre-screening",
    label: "Pre-Screening",
    shortLabel: "Pre-Screen",
    questionCount: 5,
    description:
      "HR-style screening: background, motivation, salary expectations, and role fit.",
  },
  {
    id: "initial",
    label: "Initial Interview",
    shortLabel: "Initial",
    questionCount: 6,
    description:
      "Hiring manager round: behavioral questions, role-specific skills, and team fit.",
  },
  {
    id: "final",
    label: "Final Interview",
    shortLabel: "Final",
    questionCount: 5,
    description:
      "Senior leadership round: strategy, culture, leadership, and closing questions.",
  },
];

export const COACHING_MODES = {
  realtime: {
    id: "realtime",
    label: "Real-time coaching",
    description:
      "After each answer: quick feedback plus a sample answer you can learn from.",
  },
  perStage: {
    id: "per-stage",
    label: "Feedback after each stage",
    description:
      "Detailed round feedback with multiple sample answers when each stage ends.",
  },
};

export function createInterviewMessage({
  role,
  content,
  type = "text",
  stage = null,
  meta = {},
}) {
  return {
    id: generateId(),
    role,
    content,
    type,
    stage,
    meta,
    createdAt: Date.now(),
  };
}
