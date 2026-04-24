"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createLink } from "@/data/links";

const schema = z.object({
  url: z.string().url(),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, {
    message: "Slug may only contain lowercase letters, numbers, and hyphens",
  }),
});

export async function createLinkAction(data: {
  url: string;
  slug: string;
}): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    await createLink({ userId, ...parsed.data });
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to create link. The slug may already be in use." };
  }
}
