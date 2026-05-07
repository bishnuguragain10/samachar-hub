import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  bio: text("bio"),
  avatarUrl: text("avatarUrl"),
  passwordHash: text("passwordHash"), // New field for admin password
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  nameNe: varchar("nameNe", { length: 100 }),
  slug: varchar("slug", { length: 100 }).notNull(),
  description: text("description"),
  descriptionNe: text("descriptionNe"),
  color: varchar("color", { length: 20 }).default("#dc2626"),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const articles = mysqlTable("articles", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  titleNe: text("titleNe"),
  slug: varchar("slug", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  excerptNe: text("excerptNe"),
  content: text("content").notNull(),
  contentNe: text("contentNe"),
  aiSummary: text("aiSummary"),
  aiSummaryNe: text("aiSummaryNe"),
  coverImage: text("coverImage"),
  coverImageKey: text("coverImageKey"),
  categoryId: int("categoryId"),
  authorId: int("authorId"),
  status: mysqlEnum("status", ["draft", "published", "scheduled"]).default("draft").notNull(),
  isBreaking: boolean("isBreaking").default(false).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isSponsored: boolean("isSponsored").default(false).notNull(),
  youtubeUrl: text("youtubeUrl"),
  tags: text("tags"),
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  viewCount: int("viewCount").default(0).notNull(),
  scheduledAt: timestamp("scheduledAt"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const bookmarks = mysqlTable("bookmarks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  articleId: int("articleId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const comments = mysqlTable("comments", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId").notNull(),
  userId: int("userId"),
  guestName: varchar("guestName", { length: 100 }),
  guestEmail: varchar("guestEmail", { length: 320 }),
  content: text("content").notNull(),
  status: mysqlEnum("status", ["pending", "approved", "rejected"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const newsletterSubscribers = mysqlTable("newsletter_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 100 }),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = typeof articles.$inferInsert;