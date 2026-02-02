# Smart Intake - Lead Collection Application

A full-stack application built with Next.js (App Router) and Convex for collecting leads through a smart multi-step form with automatic package recommendations.

## Features

- **Landing Page**: Modern SaaS-style landing page with hero, benefits, and how it works sections
- **Multi-Step Form**: Conditional form logic that adapts based on user selections
- **Package Recommendations**: Automatic package tier recommendations (Starter/Growth/Pro) based on goal and budget
- **Admin Dashboard**: Protected dashboard to view, search, and manage all submissions
- **CSV Export**: Export submissions data as CSV

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Convex (database and serverless functions)
- **Form Management**: React Hook Form with Zod validation
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Convex account (sign up at [convex.dev](https://convex.dev))

### Installation

1. Install dependencies:
```bash
npm install
```

2. Initialize Convex:
```bash
npx convex dev
```

This will:
- Create a Convex deployment
- Generate TypeScript types
- Set up the Convex dashboard

3. Create `.env.local` file:
```bash
cp .env.local.example .env.local
```

4. Add your Convex URL to `.env.local`:
```
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_ADMIN_TOKEN=your-secure-token
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Keep `npx convex dev` running in a separate terminal to sync backend functions.

## Project Structure

```
smart-intake/
├── app/
│   ├── layout.tsx              # Root layout with ConvexProvider
│   ├── page.tsx                 # Landing page
│   ├── apply/
│   │   └── page.tsx             # Multi-step form page
│   ├── admin/
│   │   ├── page.tsx             # Admin dashboard
│   │   └── login/
│   │       └── page.tsx          # Admin login
│   └── ConvexClientProvider.tsx # Convex client wrapper
├── components/
│   ├── MultiStepForm.tsx         # Main form orchestrator
│   ├── FormStep1.tsx             # Basic info step
│   ├── FormStep2.tsx             # Conditional details step
│   ├── FormStep3.tsx             # Review step
│   ├── SuccessScreen.tsx        # Post-submission screen
│   ├── AdminDashboard.tsx        # Admin table component
│   └── PackageRecommendation.tsx # Package recommendation display
├── convex/
│   ├── schema.ts                 # Database schema
│   ├── submissions.ts           # Queries & mutations
│   └── auth.ts                   # Authentication helpers
└── lib/
    └── utils.ts                  # Utility functions
```

## Form Flow

1. **Step 1**: Basic information (Name, Email, Goal)
2. **Step 2**: Conditional details based on goal:
   - **Website**: Pages count, features (blog, payments, auth, dashboard)
   - **App**: Platform (iOS/Android/Web), authentication needed
   - **All**: Budget selection
3. **Step 3**: Review and submit with live package recommendation

## Package Recommendation Logic

- **Starter**: Budget < $500 OR (Budget $500-$2000 AND Goal = Branding/Other)
- **Growth**: Budget $500-$2000 (Website/App) OR Budget $2000-$5000
- **Pro**: Budget $5000+ OR (Budget $2000-$5000 with complex requirements)

## Admin Access

Default admin credentials (change in production):
- Password: `admin123` (set via `NEXT_PUBLIC_ADMIN_PASSWORD`)
- Token: `admin-token-123` (set via `NEXT_PUBLIC_ADMIN_TOKEN`)

Access the admin dashboard at `/admin` (redirects to `/admin/login` if not authenticated).

## Deployment

### Deploy Convex Backend

```bash
npx convex deploy
```

### Deploy Next.js Frontend

Deploy to Vercel (recommended):

```bash
vercel deploy
```

Or deploy to your preferred hosting platform. Make sure to set the `NEXT_PUBLIC_CONVEX_URL` environment variable in your hosting platform.

## Environment Variables

- `NEXT_PUBLIC_CONVEX_URL`: Your Convex deployment URL
- `NEXT_PUBLIC_ADMIN_PASSWORD`: Admin password for login
- `NEXT_PUBLIC_ADMIN_TOKEN`: Admin token for API authentication

## License

MIT

