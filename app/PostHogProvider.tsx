"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

const isEnabled =
  process.env.NEXT_PUBLIC_POSTHOG_ENABLED === "true" &&
  !!process.env.NEXT_PUBLIC_POSTHOG_KEY;

export function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (isEnabled) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        capture_pageview: false,
      });
    }
  }, []);

  if (isEnabled) {
    return <PHProvider client={posthog}>{children}</PHProvider>;
  }

  return <>{children}</>;
}
