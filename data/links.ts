import { db } from "@/db";
import { links, type Link, type NewLink } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getLinksByUserId(userId: string): Promise<Link[]> {
  return db.select().from(links).where(eq(links.userId, userId)).orderBy(desc(links.updatedAt));
}

export async function createLink(
  data: Pick<NewLink, "slug" | "url" | "userId">
): Promise<Link> {
  const [link] = await db.insert(links).values(data).returning();
  return link;
}
