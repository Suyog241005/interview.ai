# Environment Variables & Configuration Guide

This document lists every environment variable utilized across all workspaces, their purposes, defaults, and security considerations. All sample values below use **generic placeholders** for security and privacy.

---

## 🔑 Environment Variable Reference Table

| Variable | Workspace(s) | Required In | Description | Placeholder / Example |
| :--- | :--- | :--- | :--- | :--- |
| `PORT` | `apps/server` | Dev & Prod | HTTP port for the Express API server | `3001` / `8000` |
| `DATABASE_URL` | `apps/server`, `packages/db`, `packages/better-auth` | Dev & Prod | Neon PostgreSQL pooled connection URI | `postgresql://username:password@ep-your-pooler.region.neon.tech/neondb?sslmode=require` |
| `BETTER_AUTH_SECRET` | `apps/server`, `packages/better-auth` | Dev & Prod | 32+ character cryptographic secret for session tokens | `your_random_32_character_secret_key` |
| `BETTER_AUTH_URL` | `apps/server`, `packages/better-auth` | Dev & Prod | Public base URL where Better Auth endpoints are hosted | `http://localhost:3001` (Dev) / `https://api.yourdomain.com` (Prod) |
| `DEV_API_URL` | `apps/server` | Dev | Express server local development URL | `http://localhost:3001` |
| `PROD_API_URL` | `apps/server` | Prod | Production backend API URL (e.g. Render/Railway) | `https://api.yourdomain.com` |
| `DEV_CLIENT_URL` / `CLIENT_URL` | `apps/server`, `packages/better-auth` | Dev | Local candidate web client address for CORS and callbacks | `http://localhost:5173` |
| `PROD_CLIENT_URL` | `apps/server`, `packages/better-auth` | Prod | Production candidate web client address (e.g. Vercel) | `https://candidate.yourdomain.com` |
| `GOOGLE_GENERATIVE_AI_API_KEY` | `apps/server`, `packages/better-auth` | Dev & Prod | API Key for Google Gemini 2.5 Flash via Vercel AI SDK | `your_google_gemini_api_key` |
| `GEMINI_API_KEY` | `apps/server` | Dev & Prod | Secondary alias for Google AI API Key | `your_google_gemini_api_key` |
| `GOOGLE_CLIENT_ID` | `apps/server` | Optional | Google OAuth 2.0 Client ID for Better Auth social sign-in | `your-google-client-id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | `apps/server` | Optional | Google OAuth 2.0 Client Secret for Better Auth | `your-google-client-secret` |
| `GITHUB_CLIENT_ID` | `apps/server` | Optional | GitHub OAuth App Client ID for Better Auth | `your-github-client-id` |
| `GITHUB_CLIENT_SECRET` | `apps/server` | Optional | GitHub OAuth App Client Secret for Better Auth | `your-github-client-secret` |
| `NEXT_PUBLIC_DEV_API_URL` | `candidate-web`, `recruiter-web`, `gateway` | Dev | Client-side pointer to Express API for tRPC batching | `http://localhost:3001` |
| `NEXT_PUBLIC_PROD_API_URL`| `candidate-web`, `recruiter-web`, `gateway` | Prod | Client-side pointer to production API | `https://api.yourdomain.com` |
| `NEXT_PUBLIC_DEV_AUTH_URL`| `candidate-web`, `recruiter-web`, `gateway` | Dev | Client-side Better Auth base endpoint | `http://localhost:3001` |
| `NEXT_PUBLIC_PROD_AUTH_URL`| `candidate-web`, `recruiter-web`, `gateway` | Prod | Client-side Better Auth production endpoint | `https://api.yourdomain.com` |
| `NEXT_PUBLIC_CANDIDATE_URL`| `apps/gateway`, `recruiter-web` | Dev | Link to Candidate Web (gateway nav, recruiter invite links) | `http://localhost:5173` |
| `NEXT_PUBLIC_RECRUITER_URL`| `apps/gateway` | Dev | Gateway link to Recruiter Suite | `http://localhost:5174` |
| `NEXT_PUBLIC_PROD_CANDIDATE_URL` | `apps/gateway`, `recruiter-web` | Prod | Production link to Candidate Web (gateway nav, recruiter invite links) | `https://candidate.yourdomain.com` |
| `NEXT_PUBLIC_PROD_RECRUITER_URL` | `apps/gateway` | Prod | Gateway production link to Recruiter Web | `https://recruiter.yourdomain.com` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `candidate-web`, `recruiter-web`, `gateway` | Dev & Prod | Cloudinary cloud account name for resume PDF storage | `your-cloudinary-cloud-name` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `candidate-web`, `recruiter-web`, `gateway` | Dev & Prod | Unsigned Cloudinary upload preset name | `your-upload-preset` |
| `CLOUDINARY_API_KEY` | `packages/better-auth` (backend) | Dev & Prod | Cloudinary API Key for authenticated server operations | `your-cloudinary-api-key` |
| `CLOUDINARY_API_SECRET` | `packages/better-auth` (backend) | Dev & Prod | Cloudinary API Secret | `your-cloudinary-api-secret` |

---

## 🔒 Security Best Practices

1. **Keep Secrets Out of Client Bundles**: Variables prefixed with `NEXT_PUBLIC_` are bundled into client-side JavaScript. Never prefix `BETTER_AUTH_SECRET`, `GOOGLE_GENERATIVE_AI_API_KEY`, or `DATABASE_URL` with `NEXT_PUBLIC_`.
2. **Neon Database SSL & Pooling**: The `DATABASE_URL` must append `?sslmode=require&channel_binding=require` to enforce TLS when connecting to serverless PostgreSQL on Neon.
3. **Cloudinary Upload Presets**: `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` uses an **unsigned** preset restricted to PDF uploads with maximum file size limits (5MB) configured on the Cloudinary console.
4. **CORS & Cookie Isolation**:
   - `apps/server/src/index.ts` automatically permits `CLIENT_URL`, `http://localhost:5173`, `http://localhost:5174`, `http://localhost:3000`, and authorized production domains.
   - In production, session cookies are configured with `sameSite: "none"` and `secure: true` to support cross-domain session cookies between frontend deployments and the backend API.
