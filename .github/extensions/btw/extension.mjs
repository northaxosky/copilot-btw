import { joinSession } from "@github/copilot-sdk/extension";
import { parseBtwPrompt, buildModifiedPrompt, buildAdditionalContext } from "../../../btw-logic.mjs";

const session = await joinSession({
  hooks: {
    onUserPromptSubmitted: async (input) => {
      const { isBtw, question } = parseBtwPrompt(input.prompt);
      if (!isBtw) return;

      await session.log("💡 /btw — answering quick side question", { ephemeral: true });

      return {
        modifiedPrompt: buildModifiedPrompt(question),
        additionalContext: buildAdditionalContext(),
      };
    },

    onSessionStart: async () => {
      await session.log("btw extension loaded — use /btw <question> for quick side questions");
    },
  },
  tools: [],
});
