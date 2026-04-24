---
description: Read this file before implementing any UI-related features. It describes the UI framework used in this project and the coding standards to follow when building UI components.
---

# UI Components — shadcn/ui

All UI elements in this project use **shadcn/ui** exclusively. Do **not** create custom components.

## Rules

- **Never** build custom UI components (buttons, inputs, dialogs, cards, etc.). Always use a shadcn/ui component.
- Install missing components with the CLI: `npx shadcn@latest add <component>`.
- Components are installed into `@/components/ui/` — import from there.
- Style: `radix-nova`, base color: `neutral`, CSS variables enabled.
- Icons must use **lucide-react** — do not add other icon libraries.
- Use **Tailwind CSS v4** utility classes for layout and spacing; do not write custom CSS.

## Adding Components

```bash
npx shadcn@latest add button
npx shadcn@latest add input dialog card # multiple at once
```

## Usage

```tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
```

## Icon Usage

```tsx
import { LinkIcon, Copy } from "lucide-react";

<Button>
  <LinkIcon className="mr-2 h-4 w-4" />
  Shorten URL
</Button>
```
