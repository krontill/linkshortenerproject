import { db } from "@/db";
import { links, type Link } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getLinksByUserId(userId: string): Promise<Link[]> {
  return db.select().from(links).where(eq(links.userId, userId));
}
