const DEFAULT_MODEL = "gemini-2.5-flash";
// Prefer current free-tier models; gemini-2.0-flash is deprecated / often has limit: 0.
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
];

function isQuotaError(status, message) {
  return (
    status === 429 ||
    /quota exceeded|resource exhausted|rate limit/i.test(message)
  );
}

function formatGeminiError(status, message) {
  if (isQuotaError(status, message)) {
    if (/limit:\s*0/i.test(message)) {
      return (
        "Your Gemini API key has no free quota for this model (limit: 0). " +
        "Create a new key at aistudio.google.com/apikey, try again tomorrow, " +
        "or link billing in Google Cloud to unlock usage. " +
        "You can also set VITE_GEMINI_MODEL=gemini-2.5-flash in .env.local."
      );
    }
    return (
      "Gemini free-tier quota reached. Wait a few minutes and try again, " +
      "or check usage at ai.dev/rate-limit."
    );
  }
  return message || `Gemini request failed (${status})`;
}

export function isGeminiConfigured() {
  return Boolean(import.meta.env.VITE_GEMINI_API_KEY?.trim());
}

export function isInterviewFeatureEnabled() {
  return Boolean(import.meta.env.VITE_INTERVIEW_ACCESS_CODE?.trim());
}

/**
 * @param {{ systemPrompt: string, messages: {role:'user'|'assistant', content:string}[], json?: boolean }} opts
 */
export async function generateGeminiText({
  systemPrompt,
  messages,
  json = false,
  model = DEFAULT_MODEL,
}) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      "Gemini API key missing. Add VITE_GEMINI_API_KEY to your .env.local file."
    );
  }

  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const body = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.75,
      maxOutputTokens: 2048,
      ...(json ? { responseMimeType: "application/json" } : {}),
    },
  };

  const modelsToTry = [
    import.meta.env.VITE_GEMINI_MODEL?.trim(),
    model,
    ...FALLBACK_MODELS,
  ].filter(Boolean);
  const uniqueModels = [...new Set(modelsToTry)];

  let lastError = null;

  for (const modelName of uniqueModels) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      const rawMsg =
        data?.error?.message ||
        `Gemini request failed (${res.status})`;
      lastError = new Error(formatGeminiError(res.status, rawMsg));
      if (
        res.status === 404 ||
        /not found/i.test(rawMsg) ||
        isQuotaError(res.status, rawMsg)
      ) {
        continue;
      }
      throw lastError;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!text) throw new Error("Empty response from Gemini.");

    if (json) {
      try {
        return JSON.parse(text);
      } catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
        throw new Error("Could not parse JSON from Gemini.");
      }
    }

    return text;
  }

  throw lastError || new Error("No Gemini model available.");
}
