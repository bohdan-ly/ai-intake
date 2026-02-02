import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Package recommendation logic
export function determinePackage(
  goal: string,
  budget: string,
  features?: string[],
  pagesCount?: number
): "Starter" | "Growth" | "Pro" {
  // Starter: Budget < $500 OR (Budget $500-$2000 AND Goal = Branding/Other)
  if (budget === "<500") {
    return "Starter";
  }
  if (budget === "500-2000") {
    if (goal === "Branding" || goal === "Other") {
      return "Starter";
    }
    return "Growth";
  }
  // Growth: Budget $2000-$5000
  if (budget === "2000-5000") {
    // Check for complex requirements
    if (goal === "Website" && pagesCount && pagesCount > 10) {
      return "Pro";
    }
    if (goal === "Website" && features && features.length >= 3) {
      return "Pro";
    }
    return "Growth";
  }
  // Pro: Budget $5000+
  if (budget === "5000+") {
    return "Pro";
  }
  return "Growth";
}

