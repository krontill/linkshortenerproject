'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { updateLink, deleteLink } from '@/data/links';

const editSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, {
      message: 'Slug may only contain lowercase letters, numbers, and hyphens',
    }),
});

const deleteSchema = z.object({
  id: z.number().int().positive(),
});

export async function updateLinkAction(data: {
  id: number;
  url: string;
  slug: string;
}): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = editSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  try {
    const result = await updateLink(parsed.data.id, userId, {
      url: parsed.data.url,
      slug: parsed.data.slug,
    });
    if (!result) return { error: 'Link not found or access denied' };
    revalidatePath('/dashboard');
    return { success: true };
  } catch {
    return { error: 'Failed to update link. The slug may already be in use.' };
  }
}

export async function deleteLinkAction(data: {
  id: number;
}): Promise<{ success: true } | { error: string }> {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = deleteSchema.safeParse(data);
  if (!parsed.success) return { error: 'Invalid input' };

  try {
    await deleteLink(parsed.data.id, userId);
    revalidatePath('/dashboard');
    return { success: true };
  } catch {
    return { error: 'Failed to delete link' };
  }
}
