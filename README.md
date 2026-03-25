# copilot-btw

A `btw` command extension for [GitHub Copilot CLI](https://github.com/github/copilot-cli) — ask quick side questions without derailing your session.

Inspired by Claude Code's `/btw` command.

> 📣 **Feature request:** [github/copilot-cli#2280](https://github.com/github/copilot-cli/issues/2280) — proposing a first-party `/btw` with true ephemeral model calls.

## What it does

Type `btw <question>` and get a concise answer inline. The extension intercepts
your prompt, strips the `btw` prefix, and instructs the model to:

- Answer in a few sentences
- **Not** use any tools (no file reads, no shell commands)
- **Not** reference the side question in future responses

### Example

```
> btw What does the --frozen-lockfile flag do in npm?

It tells npm ci to fail if package-lock.json is missing or would need
updating, ensuring reproducible installs.
```

### Why `btw` instead of `/btw`?

The Copilot CLI intercepts all `/`-prefixed input as built-in slash commands
before extensions can see it. Since the extension SDK doesn't support registering
custom slash commands, we use `btw` (no slash) as the trigger. If the CLI adds
custom command registration in the future, we'll switch to `/btw`.

### Limitations

- The Copilot CLI extension SDK doesn't expose a separate model inference API,
  so the question and answer still appear in conversation history. The extension
  minimizes impact by keeping responses short and tool-free.
- **Queuing:** If the agent is mid-turn (running tools, generating a response),
  your `btw` question is queued and won't be answered until the current turn
  finishes. True "interrupt and answer immediately" behavior requires a
  first-party ephemeral inference channel — see the [feature request](https://github.com/github/copilot-cli/issues/2280).

## Installation

### Option 1: Per-project (recommended)

Copy the extension into your repo:

```bash
mkdir -p .github/extensions/btw
cp <path-to-copilot-btw>/.github/extensions/btw/extension.mjs .github/extensions/btw/
cp <path-to-copilot-btw>/btw-logic.mjs .github/extensions/btw/btw-logic.mjs
```

Then update the import path in `extension.mjs`:

```js
import { parseBtwPrompt, buildModifiedPrompt, buildAdditionalContext } from "./btw-logic.mjs";
```

### Option 2: User-scoped (all repos)

Copy to your Copilot CLI user extensions directory:

```powershell
# Windows
$extDir = "$env:USERPROFILE\.copilot\extensions\btw"
New-Item -ItemType Directory -Force -Path $extDir
Copy-Item .github\extensions\btw\extension.mjs $extDir\
Copy-Item btw-logic.mjs $extDir\
```

```bash
# macOS / Linux
mkdir -p ~/.copilot/extensions/btw
cp .github/extensions/btw/extension.mjs ~/.copilot/extensions/btw/
cp btw-logic.mjs ~/.copilot/extensions/btw/
```

Update the import path in `extension.mjs` to `./btw-logic.mjs`.

### Option 3: Self-contained single file

For the simplest install, use the standalone version which has all logic inlined:

```bash
# Copy just one file — no separate btw-logic.mjs needed
cp standalone/extension.mjs ~/.copilot/extensions/btw/extension.mjs
```

## Development

```bash
# Run tests
npm test
```

## How it works

The extension uses the `onUserPromptSubmitted` hook to:

1. Check if the prompt starts with `btw`
2. Strip the prefix and extract the question
3. Return the question as `modifiedPrompt` with `additionalContext` instructing the model to answer briefly without tools

All testable logic lives in `btw-logic.mjs` — the extension entry point is a thin wrapper.

## License

MIT
