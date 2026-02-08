/**
 * Analytics wrapper guard: ensures no PII in event properties and track* behavior.
 * Run with: npx vitest run lib/analytics.test.ts (after adding vitest to devDependencies).
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const captureMock = vi.fn();

vi.mock("posthog-js", () => ({
  default: {
    capture: (...args: unknown[]) => captureMock(...args),
    init: vi.fn(),
  },
}));

describe("analytics (no PII)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    captureMock.mockClear();
    process.env = { ...originalEnv };
    (globalThis as typeof globalThis & { window: Window }).window = {} as Window;
  });

  afterEach(() => {
    process.env = originalEnv;
    (globalThis as typeof globalThis & { window?: Window }).window = undefined;
  });

  it("does not send name or email in event properties when enabled", async () => {
    process.env.NEXT_PUBLIC_POSTHOG_ENABLED = "true";
    process.env.NEXT_PUBLIC_POSTHOG_KEY = "ph_test_key";
    const analytics = await import("./analytics");

    analytics.trackApplyStarted();
    analytics.trackApplyStepViewed(1);
    analytics.trackApplyStepCompleted(1);
    analytics.trackApplyValidationError(1, ["name", "email"]);
    analytics.trackApplyRecommendationShown("review", "Starter");
    analytics.trackApplySubmittedSuccess("Growth");
    analytics.trackApplySubmittedError("unknown");

    expect(captureMock).toHaveBeenCalled();
    const calls = captureMock.mock.calls;
    for (const call of calls) {
      const props = call[1] as Record<string, unknown> | undefined;
      if (props) {
        expect(props).not.toHaveProperty("name");
        expect(props).not.toHaveProperty("email");
      }
    }
  });

  it("sends only allowed property keys for apply events", async () => {
    process.env.NEXT_PUBLIC_POSTHOG_ENABLED = "true";
    process.env.NEXT_PUBLIC_POSTHOG_KEY = "ph_test_key";
    const analytics = await import("./analytics");

    const allowedKeys = new Set([
      "source",
      "step",
      "fields",
      "context",
      "package",
      "error_type",
    ]);

    analytics.trackApplyStarted();
    analytics.trackApplyStepViewed(2);
    analytics.trackApplyValidationError(2, ["budget"]);
    analytics.trackApplyRecommendationShown("success", "Pro");
    analytics.trackApplySubmittedError("network");

    const calls = captureMock.mock.calls;
    for (const call of calls) {
      const props = (call[1] as Record<string, unknown>) || {};
      for (const key of Object.keys(props)) {
        expect(allowedKeys.has(key)).toBe(true);
      }
    }
  });
});
