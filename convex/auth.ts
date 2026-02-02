import { query } from "./_generated/server";
import { v } from "convex/values";

// Simple auth check query
// For MVP, we'll use a simple password stored in environment
// In production, use Convex Auth or proper authentication
export const checkAuth = query({
  args: {
    token: v.string(),
  },
  handler: async (ctx, args) => {
    // Simple token validation
    // In production, use proper JWT or Convex Auth
    const validToken = process.env.ADMIN_TOKEN || "admin-token-123";
    return args.token === validToken;
  },
});

// Verify password and return token
export const verifyPassword = query({
  args: {
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    if (args.password === adminPassword) {
      return { valid: true, token: process.env.ADMIN_TOKEN || "admin-token-123" };
    }
    return { valid: false };
  },
});

