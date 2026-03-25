/**
 * Shared logic for the /btw extension, extracted for testability.
 *
 * The extension.mjs imports from this module at runtime. Tests import
 * it directly — no SDK dependency required.
 */

/** Matches `/btw <question>` at the start of the prompt (case-insensitive). */
const BTW_PATTERN = /^\/btw\s+([\s\S]+)/i;

/**
 * Detect whether a prompt is a /btw side question.
 * @param {string} prompt - The raw user prompt
 * @returns {{ isBtw: boolean, question?: string }}
 */
export function parseBtwPrompt(prompt) {
  if (typeof prompt !== "string") return { isBtw: false };
  const match = prompt.match(BTW_PATTERN);
  if (!match) return { isBtw: false };
  const question = match[1].trim();
  if (!question) return { isBtw: false };
  return { isBtw: true, question };
}

/**
 * Build the modified prompt that the agent will see.
 * Wraps the question with conciseness and no-tool instructions.
 * @param {string} question
 * @returns {string}
 */
export function buildModifiedPrompt(question) {
  return question;
}

/**
 * Build the additional context injected alongside the prompt.
 * @returns {string}
 */
export function buildAdditionalContext() {
  return [
    "IMPORTANT: This is a quick side question from the user (via /btw).",
    "Answer concisely in a few sentences — do NOT use any tools,",
    "do NOT read or edit files, do NOT run commands.",
    "Just answer the question directly and briefly.",
    "Do not reference this side question in future responses.",
  ].join(" ");
}
