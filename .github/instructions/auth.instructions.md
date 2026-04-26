---
description: Read this file to understand how authentication works in this project and the coding standards to follow when implementing auth-related features.
---

# Authentication — Clerk

All authentication in this project is handled exclusively by **Clerk v7** (`@clerk/nextjs`). Do **not** implement any other auth method (NextAuth, custom JWT, sessions, etc.).

## Rules

- **Never** build custom login/register logic. Clerk handles all identity.
- Use Clerk's React hooks (`useUser`, `useAuth`, `useClerk`) and server helpers (`auth()`, `currentUser()`) from `@clerk/nextjs`.

## Route Protection

- `/dashboard` is a **protected route**. Users who are not signed in must not be able to access it — redirect them to sign in.
- Configure protection in `proxy.ts` (the project's middleware file) using Clerk's `clerkMiddleware` and `createRouteMatcher`.

```ts
// proxy.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Redirect signed-in users away from the homepage
  if (userId && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Protect the dashboard
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
```

## Sign In / Sign Up Modals

Always open Clerk's sign-in and sign-up flows as a **modal**, never as a full-page redirect.

- Use `<SignInButton mode="modal">` and `<SignUpButton mode="modal">` from `@clerk/nextjs`.
- Do **not** create dedicated `/sign-in` or `/sign-up` route pages.

```tsx
import { SignInButton, SignUpButton } from "@clerk/nextjs";

<SignInButton mode="modal">
  <button>Sign in</button>
</SignInButton>

<SignUpButton mode="modal">
  <button>Sign up</button>
</SignUpButton>
```

## Homepage Redirect

If an authenticated user navigates to `/`, they must be redirected to `/dashboard`. This is handled in `proxy.ts` (see snippet above).

# Authentication — Coding Standards

This project uses **Clerk v7** (`@clerk/nextjs`) for authentication.

## Setup

| File             | Purpose                                                    |
| ---------------- | ---------------------------------------------------------- |
| `proxy.ts`       | Clerk middleware — protects routes and attaches auth state |
| `app/layout.tsx` | `<ClerkProvider>` wraps the entire app                     |

## `proxy.ts` — Clerk Middleware

The `proxy.ts` file at the project root runs `clerkMiddleware()` on every request. Do **not** rename it to `middleware.ts` — that convention is deprecated in Next.js 16.

```ts
// proxy.ts
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

To protect specific routes (require authentication), use `clerkMiddleware` with route protection logic:

```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/links(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
```

## `ClerkProvider`

`<ClerkProvider>` must wrap the entire app in `app/layout.tsx`. It is already present — do not remove it or move it below the `<html>` element.

## Clerk UI Components

Import Clerk UI components from `@clerk/nextjs`. They are **Server Components** and can be used directly in layouts and pages:

| Component                  | Purpose                                                    |
| -------------------------- | ---------------------------------------------------------- |
| `<SignInButton>`           | Triggers the Clerk sign-in modal/redirect                  |
| `<SignUpButton>`           | Triggers the Clerk sign-up modal/redirect                  |
| `<UserButton>`             | Avatar dropdown for the signed-in user                     |
| `<Show when="signed-in">`  | Conditionally renders children when the user is signed in  |
| `<Show when="signed-out">` | Conditionally renders children when the user is signed out |

```tsx
import { SignInButton, SignUpButton, UserButton, Show } from '@clerk/nextjs'

<Show when="signed-out">
  <SignInButton />
  <SignUpButton />
</Show>
<Show when="signed-in">
  <UserButton />
</Show>
```

## Reading Auth State on the Server

Use `auth()` from `@clerk/nextjs/server` inside Server Components, Server Actions, and Route Handlers:

```ts
import { auth } from '@clerk/nextjs/server';

const { userId } = await auth();
if (!userId) {
  // user is not signed in
}
```

Use `currentUser()` when you need the full user object (name, email, etc.):

```ts
import { currentUser } from '@clerk/nextjs/server';

const user = await currentUser();
```

## Reading Auth State on the Client

Use Clerk's React hooks inside Client Components:

```tsx
'use client';

import { useUser, useAuth } from '@clerk/nextjs';

const { isSignedIn, user } = useUser();
const { userId } = useAuth();
```

## Protecting Server Actions

**Every Server Action that mutates data must verify authentication.** Check the user's identity at the start of the function — before any database access:

```ts
'use server';

import { auth } from '@clerk/nextjs/server';

export async function deleteLink(id: number) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  // Verify the resource belongs to this user before mutating
  // ...
}
```

Never rely solely on the presence of a UI guard (e.g. hiding a button). Server Actions are reachable via direct POST requests.

## Protecting Route Handlers

Apply the same pattern to `route.ts` handlers:

```ts
import { auth } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export async function DELETE(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) return new Response('Unauthorized', { status: 401 });
  // ...
}
```

## Environment Variables

| Variable                            | Description                                          |
| ----------------------------------- | ---------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (safe to expose to the client) |
| `CLERK_SECRET_KEY`                  | Clerk secret key — never expose this to the client   |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`     | Optional: custom sign-in path (e.g. `/sign-in`)      |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`     | Optional: custom sign-up path (e.g. `/sign-up`)      |

Store secret values in `.env.local`. Never commit them.
