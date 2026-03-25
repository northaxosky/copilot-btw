import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseBtwPrompt, buildModifiedPrompt, buildAdditionalContext } from "../btw-logic.mjs";

// -- parseBtwPrompt ----------------------------------------------------------

describe("parseBtwPrompt", () => {
  it("detects a simple btw question", () => {
    const result = parseBtwPrompt("btw What is a closure?");
    assert.deepStrictEqual(result, {
      isBtw: true,
      question: "What is a closure?",
    });
  });

  it("is case-insensitive", () => {
    assert.ok(parseBtwPrompt("BTW hello").isBtw);
    assert.ok(parseBtwPrompt("Btw hello").isBtw);
  });

  it("trims whitespace from the question", () => {
    const result = parseBtwPrompt("btw   What is a monad?   ");
    assert.equal(result.question, "What is a monad?");
  });

  it("handles multiline questions", () => {
    const result = parseBtwPrompt("btw What is the difference\nbetween let and const?");
    assert.ok(result.isBtw);
    assert.equal(result.question, "What is the difference\nbetween let and const?");
  });

  it("rejects empty question after btw", () => {
    assert.ok(!parseBtwPrompt("btw").isBtw);
    assert.ok(!parseBtwPrompt("btw   ").isBtw);
  });

  it("rejects prompts that don't start with btw", () => {
    assert.ok(!parseBtwPrompt("what is btw?").isBtw);
    assert.ok(!parseBtwPrompt("hello btw world").isBtw);
  });

  it("rejects non-string input", () => {
    assert.ok(!parseBtwPrompt(null).isBtw);
    assert.ok(!parseBtwPrompt(undefined).isBtw);
    assert.ok(!parseBtwPrompt(42).isBtw);
  });

  it("requires a space after btw", () => {
    assert.ok(!parseBtwPrompt("btwhat").isBtw);
  });

  it("also works with /btw prefix for futureproofing", () => {
    // If the CLI ever stops intercepting unknown slash commands,
    // or if we register /btw as a real command, this should still work.
    assert.ok(!parseBtwPrompt("/btw What is a closure?").isBtw);
  });
});

// -- buildModifiedPrompt -----------------------------------------------------

describe("buildModifiedPrompt", () => {
  it("returns the question as-is (no wrapper fluff)", () => {
    const result = buildModifiedPrompt("Why is the sky blue?");
    assert.equal(result, "Why is the sky blue?");
  });
});

// -- buildAdditionalContext --------------------------------------------------

describe("buildAdditionalContext", () => {
  it("instructs the model to be concise", () => {
    const ctx = buildAdditionalContext();
    assert.ok(ctx.toLowerCase().includes("concise"));
  });

  it("instructs the model not to use tools", () => {
    const ctx = buildAdditionalContext();
    assert.ok(ctx.toLowerCase().includes("do not use any tools"));
  });

  it("instructs the model not to reference this later", () => {
    const ctx = buildAdditionalContext();
    assert.ok(ctx.toLowerCase().includes("do not reference"));
  });

  it("returns a non-empty string", () => {
    const ctx = buildAdditionalContext();
    assert.ok(typeof ctx === "string" && ctx.length > 0);
  });
});
