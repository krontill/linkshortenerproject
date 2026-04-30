'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { updateLink, deleteLink } from '@/data/links';

const editSchema = z.object({
  id: z.number().int().positive(),
  url: z
    .string()
    .url()
    .refine(
      (url) => {
        try {
          return ['http:', 'https:'].includes(new URL(url).protocol);
        } catch {
          return false;
        }
      },
      { message: 'URL must use http or https protocol' },
    ),
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
  } catch (err) {
    if (
      err instanceof Error &&
      'code' in err &&
      (err as { code: string }).code === '23505'
    ) {
      return { error: 'A link with this slug already exists. Please choose a different slug.' };
    }
    console.error('[updateLinkAction]', err);
    return { error: 'Failed to update link. Please try again.' };
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
  } catch (err) {
    console.error('[deleteLinkAction]', err);
    return { error: 'Failed to delete link. Please try again.' };
  }
}
