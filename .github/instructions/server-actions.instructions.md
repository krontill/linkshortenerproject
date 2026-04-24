---
description: Use these instructions when implementing any data mutation (create, update, delete) in this project using server actions.
---

# Server Actions

All data mutations must be performed via **server actions**. Direct database calls from components or API routes are not allowed.

## Rules

- Server actions must be called from **client components** only (`"use client"`).
- Server action files **must** be named `actions.ts` and colocated in the same directory as the component that calls them.
- All data passed to server actions must have explicit **TypeScript types** — do **not** use `FormData`.
- All input **must be validated with [Zod](https://zod.dev/)** before any database operation.
- Server actions **must check for a logged-in user** (via Clerk's `auth()`) before proceeding. Return early if no user is found.
- **Never** write Drizzle queries directly inside server actions. Use helper functions from the `/data` directory instead.
- Server actions must **never throw errors**. Instead, return an object with either a `success` or `error` property (e.g., `{ success: true }` or `{ error: "message" }`).

## Structure

```
app/
  dashboard/
    components/
      create-link-form/
        CreateLinkForm.tsx   ← client component
        actions.ts           ← server action colocated here
data/
  links.ts                   ← drizzle query helpers
```

## Example

```ts
// app/dashboard/components/create-link-form/actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { createLink } from "@/data/links";

const schema = z.object({
  url: z.string().url(),
  slug: z.string().min(1),
});

export async function createLinkAction(data: {
  url: string;
  slug: string;
}): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = schema.safeParse(data);
  if (!parsed.success) return { error: "Invalid input" };

  try {
    await createLink({ userId, ...parsed.data });
    return { success: true };
  } catch {
    return { error: "Failed to create link" };
  }
}
```
