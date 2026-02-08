/**
 * Analytics wrapper for PostHog. Only runs when NEXT_PUBLIC_POSTHOG_ENABLED is set.
 * No PII (name, email, or user-entered text) is sent in event properties.
 */

import posthog from "posthog-js";

const isEnabled =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true" &&
  !!process.env.NEXT_PUBLIC_POSTHOG_KEY;

/** Assumes PostHogProvider has already run init when enabled. */
function getClient(): typeof posthog | null {
  if (!isEnabled) return null;
  return posthog;
}

/** Call only from client; no-op when analytics disabled. */
function capture(event: string, properties?: Record<string, unknown>) {
  const client = getClient();
  if (client) client.capture(event, properties);
}

// --- Apply flow events (no PII) ---

export function trackApplyStarted(): void {
  capture("apply_started", { source: "apply" });
}

export function trackApplyStepViewed(step: 1 | 2 | 3): void {
  capture("apply_step_viewed", { step });
}

export function trackApplyStepCompleted(step: 1 | 2): void {
  capture("apply_step_completed", { step });
}

export function trackApplyValidationError(
  step: 1 | 2,
  fields: string[]
): void {
  capture("apply_validation_error", { step, fields });
}

export function trackApplyRecommendationShown(
  context: "review" | "success",
  packageType?: "Starter" | "Growth" | "Pro"
): void {
  const props: Record<string, unknown> = { context };
  if (packageType) props.package = packageType;
  capture("apply_recommendation_shown", props);
}

export function trackApplySubmittedSuccess(
  packageType?: "Starter" | "Growth" | "Pro"
): void {
  const props = packageType ? { package: packageType } : undefined;
  capture("apply_submitted_success", props);
}

export function trackApplySubmittedError(errorType?: string): void {
  capture("apply_submitted_error", {
    error_type: errorType ?? "unknown",
  });
}

// --- Placeholders for future attachment/voice features ---

export function trackApplyAttachmentAdded(): void {
  capture("apply_attachment_added");
}

export function trackApplyVoiceRecorded(): void {
  capture("apply_voice_recorded");
}
