/**
 * copilot-btw — standalone single-file extension
 *
 * Drop this file into ~/.copilot/extensions/btw/extension.mjs (user-scoped)
 * or .github/extensions/btw/extension.mjs (per-project) and restart Copilot CLI.
 */
import { joinSession } from "@github/copilot-sdk/extension";

const BTW_PATTERN = /^btw\s+([\s\S]+)/i;

function parseBtwPrompt(prompt) {
  if (typeof prompt !== "string") return { isBtw: false };
  const match = prompt.match(BTW_PATTERN);
  if (!match) return { isBtw: false };
  const question = match[1].trim();
  if (!question) return { isBtw: false };
  return { isBtw: true, question };
}

const CONTEXT = [
  "IMPORTANT: This is a quick side question from the user (via btw).",
  "Answer concisely in a few sentences — do NOT use any tools,",
  "do NOT read or edit files, do NOT run commands.",
  "Just answer the question directly and briefly.",
  "Do not reference this side question in future responses.",
].join(" ");

const session = await joinSession({
  hooks: {
    onUserPromptSubmitted: async (input) => {
      const { isBtw, question } = parseBtwPrompt(input.prompt);
      if (!isBtw) return;

      await session.log("💡 btw — answering quick side question", { ephemeral: true });

      return {
        modifiedPrompt: question,
        additionalContext: CONTEXT,
      };
    },

    onSessionStart: async () => {
      await session.log("btw extension loaded — type btw <question> for quick side questions");
    },
  },
  tools: [],
});
