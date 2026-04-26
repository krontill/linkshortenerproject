import { pgTable, integer, text, timestamp } from 'drizzle-orm/pg-core';

export const links = pgTable('links', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  slug: text('slug').notNull().unique(),
  url: text('url').notNull(),
  userId: text('user_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export type Link = typeof links.$inferSelect; // full row (all columns)
export type NewLink = typeof links.$inferInsert; // insert shape (id/timestamps optional)
