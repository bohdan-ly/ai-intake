import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Package recommendation logic (matches client-side logic)
function determinePackage(
  goal: string,
  budget: string,
  features?: string[],
  pagesCount?: number
): "Starter" | "Growth" | "Pro" {
  if (budget === "<500") {
    return "Starter";
  }
  if (budget === "500-2000") {
    if (goal === "Branding" || goal === "Other") {
      return "Starter";
    }
    return "Growth";
  }
  if (budget === "2000-5000") {
    if (goal === "Website" && pagesCount && pagesCount > 10) {
      return "Pro";
    }
    if (goal === "Website" && features && features.length >= 3) {
      return "Pro";
    }
    return "Growth";
  }
  if (budget === "5000+") {
    return "Pro";
  }
  return "Growth";
}

// Mutation: Create new submission
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    goal: v.union(
      v.literal("Website"),
      v.literal("App"),
      v.literal("Branding"),
      v.literal("Other")
    ),
    pagesCount: v.optional(v.number()),
    features: v.optional(v.array(v.string())),
    platform: v.optional(
      v.union(v.literal("iOS"), v.literal("Android"), v.literal("Web"))
    ),
    authNeeded: v.optional(v.boolean()),
    budget: v.union(
      v.literal("<500"),
      v.literal("500-2000"),
      v.literal("2000-5000"),
      v.literal("5000+")
    ),
  },
  handler: async (ctx, args) => {
    const recommendedPackage = determinePackage(
      args.goal,
      args.budget,
      args.features,
      args.pagesCount
    );

    const now = Date.now();
    return await ctx.db.insert("submissions", {
      ...args,
      recommendedPackage,
      status: "New",
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Query: List all submissions (protected by auth)
export const list = query({
  args: {
    search: v.optional(v.string()),
    status: v.optional(v.union(v.literal("New"), v.literal("Contacted"))),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
    // Check authentication
    const validToken = process.env.ADMIN_TOKEN || "admin-token-123";
    if (!args.token || args.token !== validToken) {
      throw new Error("Unauthorized");
    }
   
    // Use index if filtering by status, otherwise query all
    let submissions;
    if (args.status) {
      const status = args.status; // TypeScript narrowing
      submissions = await ctx.db
        .query("submissions")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else {
      submissions = await ctx.db.query("submissions").collect();
    }

    // Apply search filter if provided
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      submissions = submissions.filter(
        (s) =>
          s.name.toLowerCase().includes(searchLower) ||
          s.email.toLowerCase().includes(searchLower)
      );
    }

    // Sort by created date (newest first)
    return submissions.sort((a, b) => b.createdAt - a.createdAt);
    }
catch (error) {
  console.error("Error listing submissions:", error);
  return [];
}
},
});

// Query: Get submission by ID (protected by auth)
export const getById = query({
  args: {
    id: v.id("submissions"),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check authentication
    const validToken = process.env.ADMIN_TOKEN || "admin-token-123";
    if (!args.token || args.token !== validToken) {
      throw new Error("Unauthorized");
    }

    return await ctx.db.get(args.id);
  },
});

// Mutation: Update submission status (protected by auth)
export const updateStatus = mutation({
  args: {
    id: v.id("submissions"),
    status: v.union(v.literal("New"), v.literal("Contacted")),
    token: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check authentication
    const validToken = process.env.ADMIN_TOKEN || "admin-token-123";
    if (!args.token || args.token !== validToken) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.id, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

