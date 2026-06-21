import { create } from "zustand";
import { INTERVIEW_STAGES, COACHING_MODES, createInterviewMessage } from "@/types/interview";
import { generateGeminiText } from "@/lib/gemini";
import {
  buildInterviewerSystemPrompt,
  buildQuestionUserPrompt,
  buildRealtimeCoachingPrompt,
  buildStageFeedbackPrompt,
  buildFinalSummaryPrompt,
} from "@/lib/interviewPrompts";

const ACCESS_CODE = import.meta.env.VITE_INTERVIEW_ACCESS_CODE?.trim() || "";

function getCurrentStage(state) {
  return INTERVIEW_STAGES[state.stageIndex] ?? INTERVIEW_STAGES[0];
}

async function fetchQuestion(state, resume) {
  const stage = getCurrentStage(state);
  const systemPrompt = buildInterviewerSystemPrompt({
    jobPosition: state.jobPosition,
    stageId: stage.id,
    resume: state.useResumeContext ? resume : null,
    company: state.company,
  });

  const userPrompt = buildQuestionUserPrompt({
    jobPosition: state.jobPosition,
    stageId: stage.id,
    questionNumber: state.questionIndex + 1,
    totalQuestions: stage.questionCount,
    transcript: state.messages,
  });

  const text = await generateGeminiText({
    systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  return createInterviewMessage({
    role: "assistant",
    content: text,
    type: "question",
    stage: stage.id,
  });
}

async function fetchRealtimeCoaching(state, question, answer, resume) {
  const stage = getCurrentStage(state);
  const systemPrompt = buildRealtimeCoachingPrompt({
    jobPosition: state.jobPosition,
    stageId: stage.id,
    question,
    answer,
    resume: state.useResumeContext ? resume : null,
    company: state.company,
  });

  const text = await generateGeminiText({
    systemPrompt,
    messages: [{ role: "user", content: "Provide coaching with a sample answer." }],
  });

  return createInterviewMessage({
    role: "assistant",
    content: text,
    type: "coaching",
    stage: stage.id,
  });
}

async function fetchStageFeedback(state, resume) {
  const stage = getCurrentStage(state);
  const systemPrompt = buildStageFeedbackPrompt({
    jobPosition: state.jobPosition,
    stageId: stage.id,
    transcript: state.messages,
    resume: state.useResumeContext ? resume : null,
    company: state.company,
  });

  const text = await generateGeminiText({
    systemPrompt,
    messages: [{ role: "user", content: "Provide stage feedback." }],
  });

  return createInterviewMessage({
    role: "assistant",
    content: text,
    type: "feedback",
    stage: stage.id,
  });
}

async function fetchFinalSummary(state) {
  const systemPrompt = buildFinalSummaryPrompt({
    jobPosition: state.jobPosition,
    allTranscript: state.messages,
  });

  const text = await generateGeminiText({
    systemPrompt,
    messages: [{ role: "user", content: "Provide the final interview report." }],
  });

  return createInterviewMessage({
    role: "assistant",
    content: text,
    type: "final-report",
    stage: "final",
  });
}

export const useInterviewStore = create((set, get) => ({
      panelOpen: false,

      // Session
      phase: "setup", // setup | interview | stage-feedback | complete
      jobPosition: "",
      company: "",
      coachingMode: COACHING_MODES.realtime.id,
      useResumeContext: true,
      stageIndex: 0,
      questionIndex: 0,
      messages: [],
      loading: false,
      error: null,
      awaitingAnswer: false,

      verifyAccessCode: (code) => {
        if (!ACCESS_CODE) return false;
        return code?.trim() === ACCESS_CODE;
      },

      openPanel: () => {
        const s = get();
        const hasSession =
          s.phase !== "setup" ||
          s.messages.length > 0 ||
          s.jobPosition.trim().length > 0;
        set({
          panelOpen: true,
          ...(hasSession ? {} : { phase: "setup" }),
          error: null,
        });
      },

      verifyAccessAndOpen: (code) => {
        if (!get().verifyAccessCode(code)) return false;
        get().openPanel();
        return true;
      },

      closePanel: () => set({ panelOpen: false }),

      setSetup: (data) => set(data),

      resetSession: () =>
        set({
          phase: "setup",
          jobPosition: "",
          company: "",
          coachingMode: COACHING_MODES.realtime.id,
          useResumeContext: true,
          stageIndex: 0,
          questionIndex: 0,
          messages: [],
          loading: false,
          error: null,
          awaitingAnswer: false,
        }),

      startInterview: async (resume) => {
        const s = get();
        if (!s.jobPosition.trim()) {
          set({ error: "Enter a job position to start." });
          return;
        }

        set({
          phase: "interview",
          stageIndex: 0,
          questionIndex: 0,
          messages: [
            createInterviewMessage({
              role: "assistant",
              content: `Welcome to your mock interview for **${s.jobPosition}**${s.company ? ` at ${s.company}` : ""}. We'll go through three rounds: Pre-Screening → Initial → Final. Answer each question as you would in a real interview.`,
              type: "system",
              stage: "pre-screening",
            }),
          ],
          loading: true,
          error: null,
          awaitingAnswer: false,
        });

        try {
          const question = await fetchQuestion(get(), resume);
          set((state) => ({
            messages: [...state.messages, question],
            loading: false,
            awaitingAnswer: true,
          }));
        } catch (err) {
          set({ loading: false, error: err.message });
        }
      },

      retryAfterError: async (resume) => {
        const s = get();
        if (s.loading || !s.error) return;

        set({ loading: true, error: null });

        try {
          const question = await fetchQuestion(get(), resume);
          set((state) => ({
            messages: [...state.messages, question],
            loading: false,
            awaitingAnswer: true,
          }));
        } catch (err) {
          set({ loading: false, error: err.message });
        }
      },

      submitAnswer: async (answerText, resume) => {
        const s = get();
        if (!answerText.trim() || !s.awaitingAnswer || s.loading) return;

        const stage = getCurrentStage(s);
        const lastQuestion = [...s.messages]
          .reverse()
          .find((m) => m.type === "question" && m.stage === stage.id);

        const answerMsg = createInterviewMessage({
          role: "user",
          content: answerText.trim(),
          type: "answer",
          stage: stage.id,
        });

        set({
          messages: [...s.messages, answerMsg],
          loading: true,
          awaitingAnswer: false,
          error: null,
        });

        try {
          const newMessages = [...get().messages];

          if (s.coachingMode === COACHING_MODES.realtime.id && lastQuestion) {
            const coaching = await fetchRealtimeCoaching(
              get(),
              lastQuestion.content,
              answerText.trim(),
              resume
            );
            newMessages.push(coaching);
            set({ messages: newMessages });
          }

          const nextQuestionIndex = s.questionIndex + 1;
          const stageComplete = nextQuestionIndex >= stage.questionCount;

          if (!stageComplete) {
            const question = await fetchQuestion(get(), resume);
            set((state) => ({
              messages: [...state.messages, question],
              questionIndex: nextQuestionIndex,
              loading: false,
              awaitingAnswer: true,
            }));
            return;
          }

          // Stage complete
          if (s.coachingMode === COACHING_MODES.perStage.id) {
            const feedback = await fetchStageFeedback(get(), resume);
            set((state) => ({
              messages: [...state.messages, feedback],
              phase: "stage-feedback",
              loading: false,
            }));
            return;
          }

          await get().advanceStage(resume);
        } catch (err) {
          set({ loading: false, error: err.message, awaitingAnswer: true });
        }
      },

      advanceStage: async (resume) => {
        const s = get();
        const nextIndex = s.stageIndex + 1;

        if (nextIndex >= INTERVIEW_STAGES.length) {
          set({ loading: true });
          try {
            const report = await fetchFinalSummary(get());
            set((state) => ({
              messages: [...state.messages, report],
              phase: "complete",
              loading: false,
              awaitingAnswer: false,
            }));
          } catch (err) {
            set({ loading: false, error: err.message });
          }
          return;
        }

        const nextStage = INTERVIEW_STAGES[nextIndex];
        const transition = createInterviewMessage({
          role: "assistant",
          content: `Great work on the **${getCurrentStage(s).label}** round. Let's begin the **${nextStage.label}** interview.`,
          type: "system",
          stage: nextStage.id,
        });

        set({
          stageIndex: nextIndex,
          questionIndex: 0,
          messages: [...s.messages, transition],
          phase: "interview",
          loading: true,
        });

        try {
          const question = await fetchQuestion(get(), resume);
          set((state) => ({
            messages: [...state.messages, question],
            loading: false,
            awaitingAnswer: true,
          }));
        } catch (err) {
          set({ loading: false, error: err.message });
        }
      },

      continueAfterFeedback: async (resume) => {
        set({ phase: "interview", loading: false });
        await get().advanceStage(resume);
      },
    }));

// Drop legacy persisted unlock flag from earlier versions.
try {
  localStorage.removeItem("hiremepo-interview-v1");
} catch {
  /* ignore */
}
