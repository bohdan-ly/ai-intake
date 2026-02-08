# Smart Intake App - Specification

## Goal
A lead collection system that uses a smart multi-step form to gather client information and automatically recommend service packages based on their needs and budget. Streamlines the intake process and helps close more deals.

## Pages

### 1. Landing Page (`/`)
- Hero section with value proposition
- Benefits overview (Smart Recommendations, Streamlined Collection, Admin Management)
- How It Works section
- Call-to-action buttons linking to `/apply`

### 2. Apply Page (`/apply`)
- Multi-step form (3 steps: Basic Info → Details → Review)
- Step 1: Name, Email, Goal (Website/App/Branding/Other)
- Step 2: Budget selection + conditional fields based on goal
  - Website: Pages count, Features (blog, payments, auth, dashboard)
  - App: Platform (iOS/Android/Web), Auth needed
- Step 3: Review and submit
- Success screen with package recommendation

### 3. Admin Dashboard (`/admin`)
- Protected route (requires admin token authentication)
- Login page (`/admin/login`) for token-based access
- Dashboard displays all submissions in a table

## Core Features

### Multi-Step Form (Current)
- 3-step progressive form with validation
- Conditional fields based on selected goal
- Real-time form validation using Zod schemas
- Progress indicator
- Form data persists across steps

### Package Recommendation (Current)
- Automatic package recommendation logic:
  - **Starter**: Budget < $500, or Branding/Other goals with $500-$2K budget
  - **Growth**: Budget $500-$2K (except Branding/Other), or $2K-$5K without Pro criteria
  - **Pro**: Budget $5K+, or Website with $2K-$5K + (pages > 10 OR features ≥ 3)
- Recommendation displayed on success screen

### Backend: Convex
- Database schema: `submissions` table with indexes on status and createdAt
- Mutations: `create`, `updateStatus`
- Queries: `list` (with search), `getById`
- Authentication: Token-based admin access
- Real-time data synchronization

## Admin Features

### List & Display
- Table view of all submissions
- Columns: Name, Email, Goal, Budget, Package, Status, Date
- Sorted by creation date (newest first)
- Submission count display

### Search
- Real-time search by name or email
- Debounced input (300ms delay)
- Case-insensitive matching

### Filter
- Status filter (via dropdown): New | Contacted
- Future: Filter by package, goal, budget range

### Status Management
- Dropdown to update submission status
- Statuses: "New" → "Contacted"
- Real-time updates via Convex mutations

### Export
- CSV export functionality
- Includes all submission fields
- Filename: `submissions-YYYY-MM-DD.csv`

## Definition of Done - Day 2

### Must Have
- [x] Landing page with hero, benefits, and CTA
- [x] Multi-step form (3 steps) with validation
- [x] Conditional form fields based on goal selection
- [x] Package recommendation algorithm working
- [x] Form submission saves to Convex database
- [x] Success screen displays recommended package
- [x] Admin login page with token authentication
- [x] Admin dashboard displays all submissions
- [x] Search functionality (name/email)
- [x] Status update (New/Contacted) via dropdown
- [x] CSV export feature
- [x] Error handling and loading states
- [x] Responsive design (mobile-friendly)

### Nice to Have (Future)
- [ ] Filter by package, goal, or budget
- [ ] Pagination for large submission lists
- [ ] Individual submission detail view
- [ ] Email notifications on new submissions
- [ ] Advanced package recommendation with ML
- [ ] Form analytics and completion rates

## Technical Stack
- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Convex (database, mutations, queries)
- **Form Management**: React Hook Form, Zod validation
- **Icons**: Lucide React
- **Date Formatting**: date-fns

