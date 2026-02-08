# Project Rules

## Core Principles

### 1. Smallest Diffs
- Make minimal, focused changes to achieve the goal
- Avoid refactoring unrelated code unless explicitly requested
- Prefer targeted edits over broad rewrites
- One change per logical unit when possible

### 2. Don't Break Working Flows
- Never break existing functionality while adding new features
- Test critical paths before and after changes:
  - Form submission flow (Landing → Apply → Success)
  - Admin authentication and dashboard access
  - Search, filter, and status updates
- If a change might impact existing flows, verify compatibility first
- Preserve backward compatibility when possible

### 3. Always Output Summary
After making changes, always provide:
- **Files Changed**: List all modified files
- **What Changed**: Brief description of changes made
- **How to Verify**: Steps to test the changes

Example format:
```
## Changes Made

**Files Changed:**
- `components/MultiStepForm.tsx`
- `convex/submissions.ts`

**What Changed:**
- Added validation for email format in step 1
- Updated package recommendation logic for edge cases

**How to Verify:**
1. Navigate to `/apply`
2. Enter invalid email (e.g., "test@") and verify error message
3. Submit form with budget $2K-$5K and 11+ pages, verify Pro package recommendation
```

### 4. Ask If Blocked
- If unclear about requirements, ask for clarification
- If implementation approach is ambiguous, propose options
- If blocked by technical constraints, explain the issue and suggest alternatives
- Don't make assumptions that could lead to incorrect implementation

### 5. Use SPEC.md as Truth
- **SPEC.md is the source of truth** for all feature requirements
- Before implementing, check SPEC.md for:
  - Feature specifications
  - Definition of Done criteria
  - Technical stack requirements
  - Expected behavior
- If SPEC.md needs updating, do so first, then implement
- When in doubt, refer to SPEC.md over code comments or assumptions

### 6. Keep Code Beginner-Friendly
- Write clear, self-documenting code
- Use descriptive variable and function names
- Add comments for complex logic or business rules
- Avoid overly clever or cryptic solutions
- Prefer explicit code over implicit magic
- Use TypeScript types effectively for clarity
- Follow existing code style and patterns in the codebase

## Additional Guidelines

- **Error Handling**: Always include proper error handling and user feedback
- **Loading States**: Show loading indicators for async operations
- **Responsive Design**: Ensure changes work on mobile and desktop
- **Type Safety**: Maintain TypeScript type safety throughout
- **Convex Patterns**: Follow existing Convex query/mutation patterns

