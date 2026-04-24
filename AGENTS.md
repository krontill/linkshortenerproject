<!-- BEGIN:nextjs-agent-rules -->
# Agent Instructions — Link Shortener Project

This project uses **Next.js 16** (App Router), which has breaking changes from earlier versions. APIs, file conventions, and behavior may differ significantly from your training data. Always read the relevant guide in `node_modules/next/dist/docs/` before writing code, and heed all deprecation notices.

## Quick Reference

- **Framework**: Next.js 16.2.3 (App Router only — no Pages Router)
- **Language**: TypeScript 5 (strict mode)
- **Database**: Neon serverless PostgreSQL via Drizzle ORM
- **Auth**: Clerk v7 (`@clerk/nextjs`)
- **UI**: shadcn/ui (radix-nova style) + Tailwind CSS v4 + lucide-react
- **Proxy**: `proxy.ts` at project root (replaces deprecated `middleware.ts`)
- **Path alias**: `@/` maps to the project root
<!-- END:nextjs-agent-rules -->
