import { db } from "@/db";
import { links, type Link, type NewLink } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getLinksByUserId(userId: string): Promise<Link[]> {
  return db.select().from(links).where(eq(links.userId, userId)).orderBy(desc(links.updatedAt));
}

export async function createLink(
  data: Pick<NewLink, "slug" | "url" | "userId">
): Promise<Link> {
  const [link] = await db.insert(links).values(data).returning();
  return link;
}

export async function updateLink(
  id: number,
  userId: string,
  data: Pick<NewLink, "slug" | "url">
): Promise<Link | null> {
  const [link] = await db
    .update(links)
    .set(data)
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return link ?? null;
}

export async function deleteLink(id: number, userId: string): Promise<void> {
  await db.delete(links).where(and(eq(links.id, id), eq(links.userId, userId)));
}

export async function getLinkBySlug(slug: string): Promise<Link | null> {
  const [link] = await db.select().from(links).where(eq(links.slug, slug));
  return link ?? null;
}
