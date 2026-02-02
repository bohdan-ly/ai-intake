import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  submissions: defineTable({
    name: v.string(),
    email: v.string(),
    goal: v.union(
      v.literal("Website"),
      v.literal("App"),
      v.literal("Branding"),
      v.literal("Other")
    ),
    // Conditional fields (optional)
    pagesCount: v.optional(v.number()),
    features: v.optional(v.array(v.string())), // ["blog", "payments", "auth", "dashboard"]
    platform: v.optional(
      v.union(v.literal("iOS"), v.literal("Android"), v.literal("Web"))
    ),
    authNeeded: v.optional(v.boolean()),
    // Required
    budget: v.union(
      v.literal("<500"),
      v.literal("500-2000"),
      v.literal("2000-5000"),
      v.literal("5000+")
    ),
    recommendedPackage: v.union(
      v.literal("Starter"),
      v.literal("Growth"),
      v.literal("Pro")
    ),
    status: v.union(v.literal("New"), v.literal("Contacted")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_status", ["status"])
    .index("by_created_at", ["createdAt"]),
});

