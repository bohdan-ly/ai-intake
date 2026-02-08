# Deployment (Vercel)

## Prerequisites

- Convex project deployed (`npx convex deploy`)
- Vercel account

## Environment Variables

### Vercel (Project → Settings → Environment Variables)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CONVEX_URL` | Yes | Convex deployment URL (e.g. `https://xxx.convex.cloud`) |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | No | Admin login password (default: `admin123`) |
| `NEXT_PUBLIC_ADMIN_TOKEN` | No | Admin API token (default: `admin-token-123`) |
| `NEXT_PUBLIC_POSTHOG_ENABLED` | No | Set to `true` to enable analytics |
| `NEXT_PUBLIC_POSTHOG_KEY` | If PostHog enabled | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | No | PostHog host (default: `https://us.i.posthog.com`) |

### Convex Dashboard (Convex → Settings → Environment Variables)

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_TOKEN` | No | Must match `NEXT_PUBLIC_ADMIN_TOKEN` for API auth (default: `admin-token-123`) |
| `ADMIN_PASSWORD` | No | Admin password for Convex auth (default: `admin123`) |

## Deploy Steps

1. Push to GitHub and connect repo in Vercel, or run `vercel` CLI.
2. Add environment variables in Vercel (see table above).
3. Ensure Convex is deployed: `npx convex deploy --prod`.
4. Set `ADMIN_TOKEN` and `ADMIN_PASSWORD` in Convex dashboard to match Vercel.
5. Trigger deployment (push or manual redeploy).

## Smoke Test Checklist

- [ ] Homepage loads (`/`)
- [ ] Apply form loads (`/apply`)
- [ ] Form submits and shows success
- [ ] Admin login works (`/admin/login`)
- [ ] Admin dashboard shows submissions (`/admin`)
