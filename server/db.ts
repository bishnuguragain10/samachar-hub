import { and, desc, eq, ilike, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  Article,
  InsertArticle,
  InsertUser,
  HomepageSetting,
  InsertHomepageSetting,
  articles,
  bookmarks,
  categories,
  comments,
  newsletterSubscribers,
  homepageSettings,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available. Check DATABASE_URL and MySQL connectivity.");
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod", "passwordHash"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    }
    // Set admin role if this is the owner
    if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── Categories ────────────────────────────────────────────────────────────
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(categories).where(eq(categories.isActive, true)).orderBy(categories.sortOrder, categories.name);
}

export async function getNavCategories() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(categories)
    .where(and(eq(categories.isActive, true), eq(categories.isVisibleInNav, true)))
    .orderBy(categories.sortOrder, categories.name);
}

export async function getFeaturedCategories() {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(categories)
    .where(and(eq(categories.isActive, true), eq(categories.isFeatured, true)))
    .orderBy(categories.sortOrder, categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(categories)
    .where(and(eq(categories.slug, slug), eq(categories.isActive, true)))
    .limit(1);
  return result[0];
}

export async function getCategoryById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, id), eq(categories.isActive, true)))
    .limit(1);
  return result[0];
}

export async function createCategory(data: {
  name: string;
  nameNe?: string;
  slug: string;
  description?: string;
  descriptionNe?: string;
  color?: string;
  iconUrl?: string;
  iconKey?: string;
  sortOrder?: number;
  parentId?: number;
  isVisibleInNav?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(categories).values(data);
  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, data.slug))
    .limit(1);
  return result[0];
}

export async function updateCategory(
  id: number,
  data: Partial<{
    name: string;
    nameNe: string;
    slug: string;
    description: string;
    descriptionNe: string;
    color: string;
    iconUrl: string;
    iconKey: string;
    sortOrder: number;
    parentId: number;
    isVisibleInNav: boolean;
    isFeatured: boolean;
    isActive: boolean;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(categories).set({ ...data, updatedAt: new Date() }).where(eq(categories.id, id));
}

export async function deleteCategory(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  // Soft delete by setting isActive to false
  await db.update(categories).set({ isActive: false, updatedAt: new Date() }).where(eq(categories.id, id));
}

export async function reorderCategories(categoryOrders: { id: number; sortOrder: number }[]) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  
  await db.transaction(async (tx) => {
    for (const { id, sortOrder } of categoryOrders) {
      await tx
        .update(categories)
        .set({ sortOrder, updatedAt: new Date() })
        .where(eq(categories.id, id));
    }
  });
}

// ─── Articles ──────────────────────────────────────────────────────────────
export async function getPublishedArticles(opts: {
  limit?: number;
  offset?: number;
  categoryId?: number;
  featured?: boolean;
  breaking?: boolean;
  trending?: boolean;
}) {
  const db = await getDb();
  if (!db) return { articles: [], total: 0 };
  const { limit = 10, offset = 0, categoryId, featured, breaking, trending } = opts;

  const conditions = [eq(articles.status, "published")];
  if (categoryId) conditions.push(eq(articles.categoryId, categoryId));
  if (featured) conditions.push(eq(articles.isFeatured, true));
  if (breaking) conditions.push(eq(articles.isBreaking, true));

  const orderBy = trending ? desc(articles.viewCount) : desc(articles.publishedAt);

  const rows = await db
    .select({
      article: articles,
      category: categories,
      author: { id: users.id, name: users.name, avatarUrl: users.avatarUrl },
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(and(...conditions))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(articles)
    .where(and(...conditions));

  return { articles: rows, total: Number(countResult[0]?.count ?? 0) };
}

export async function getArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select({
      article: articles,
      category: categories,
      author: { id: users.id, name: users.name, avatarUrl: users.avatarUrl, bio: users.bio },
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(and(eq(articles.slug, slug), eq(articles.status, "published")))
    .limit(1);
  return rows[0];
}

export async function getArticleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select({
      article: articles,
      category: categories,
      author: { id: users.id, name: users.name, avatarUrl: users.avatarUrl },
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(eq(articles.id, id))
    .limit(1);
  return rows[0];
}

export async function incrementViewCount(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(articles).set({ viewCount: sql`${articles.viewCount} + 1` }).where(eq(articles.id, id));
}

export async function getRelatedArticles(articleId: number, categoryId: number | null, limit = 4) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(articles.status, "published")];
  if (categoryId) conditions.push(eq(articles.categoryId, categoryId));
  return db
    .select({
      article: articles,
      category: categories,
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .where(and(...conditions, sql`${articles.id} != ${articleId}`))
    .orderBy(desc(articles.publishedAt))
    .limit(limit);
}

export async function searchArticles(query: string, limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return { articles: [], total: 0 };
  const pattern = `%${query}%`;
  const conditions = [
    eq(articles.status, "published"),
    or(
      like(articles.title, pattern),
      like(articles.excerpt, pattern),
      like(articles.content, pattern),
      like(articles.tags, pattern)
    ),
  ];
  const rows = await db
    .select({
      article: articles,
      category: categories,
      author: { id: users.id, name: users.name },
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .leftJoin(users, eq(articles.authorId, users.id))
    .where(and(...conditions))
    .orderBy(desc(articles.publishedAt))
    .limit(limit)
    .offset(offset);
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(articles)
    .where(and(...conditions));
  return { articles: rows, total: Number(countResult[0]?.count ?? 0) };
}

export async function createArticle(data: {
  title: string;
  titleNe?: string;
  slug: string;
  excerpt?: string;
  excerptNe?: string;
  content: string;
  contentNe?: string;
  coverImage?: string;
  coverImageKey?: string;
  categoryId?: number;
  authorId?: number;
  status?: "draft" | "published" | "scheduled";
  isBreaking?: boolean;
  isFeatured?: boolean;
  isSponsored?: boolean;
  youtubeUrl?: string;
  tags?: string;
  metaTitle?: string;
  metaDescription?: string;
  scheduledAt?: Date;
  publishedAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const insertData: Record<string, unknown> = { ...data };
  if (data.status === "published" && !data.publishedAt) {
    insertData.publishedAt = new Date();
  }
  await db.insert(articles).values(insertData as InsertArticle);
  const result = await db.select().from(articles).where(eq(articles.slug, data.slug)).limit(1);
  return result[0];
}

export async function updateArticle(
  id: number,
  data: Partial<{
    title: string;
    titleNe: string;
    slug: string;
    excerpt: string;
    excerptNe: string;
    content: string;
    contentNe: string;
    aiSummary: string;
    aiSummaryNe: string;
    coverImage: string;
    coverImageKey: string;
    categoryId: number;
    authorId: number;
    status: "draft" | "published" | "scheduled";
    isBreaking: boolean;
    isFeatured: boolean;
    isSponsored: boolean;
    youtubeUrl: string;
    tags: string;
    metaTitle: string;
    metaDescription: string;
    scheduledAt: Date;
    publishedAt: Date;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const updateData: Record<string, unknown> = { ...data };
  if (data.status === "published") {
    const existing = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
    if (existing[0] && existing[0].status !== "published") {
      updateData.publishedAt = new Date();
    }
  }
  await db.update(articles).set(updateData as Partial<Article>).where(eq(articles.id, id));
}

export async function deleteArticle(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(bookmarks).where(eq(bookmarks.articleId, id));
  await db.delete(comments).where(eq(comments.articleId, id));
  await db.delete(articles).where(eq(articles.id, id));
}

export async function getAllArticlesAdmin(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return { articles: [], total: 0 };
  const rows = await db
    .select({
      article: articles,
      category: categories,
      author: { id: users.id, name: users.name },
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .leftJoin(users, eq(articles.authorId, users.id))
    .orderBy(desc(articles.createdAt))
    .limit(limit)
    .offset(offset);
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(articles);
  return { articles: rows, total: Number(countResult[0]?.count ?? 0) };
}

// ─── Comments ──────────────────────────────────────────────────────────────
export async function getApprovedComments(articleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      comment: comments,
      user: { id: users.id, name: users.name, avatarUrl: users.avatarUrl },
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .where(and(eq(comments.articleId, articleId), eq(comments.status, "approved")))
    .orderBy(desc(comments.createdAt));
}

export async function getAllCommentsAdmin(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return { comments: [], total: 0 };
  const rows = await db
    .select({
      comment: comments,
      user: { id: users.id, name: users.name },
      article: { id: articles.id, title: articles.title, slug: articles.slug },
    })
    .from(comments)
    .leftJoin(users, eq(comments.userId, users.id))
    .leftJoin(articles, eq(comments.articleId, articles.id))
    .orderBy(desc(comments.createdAt))
    .limit(limit)
    .offset(offset);
  const countResult = await db.select({ count: sql<number>`count(*)` }).from(comments);
  return { comments: rows, total: Number(countResult[0]?.count ?? 0) };
}

export async function createComment(data: {
  articleId: number;
  userId?: number;
  guestName?: string;
  guestEmail?: string;
  content: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(comments).values({ ...data, status: "pending" });
}

export async function updateCommentStatus(id: number, status: "approved" | "rejected") {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.update(comments).set({ status }).where(eq(comments.id, id));
}

export async function deleteComment(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(comments).where(eq(comments.id, id));
}

// ─── Bookmarks ─────────────────────────────────────────────────────────────
export async function getUserBookmarks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      bookmark: bookmarks,
      article: articles,
      category: categories,
    })
    .from(bookmarks)
    .leftJoin(articles, eq(bookmarks.articleId, articles.id))
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .where(eq(bookmarks.userId, userId))
    .orderBy(desc(bookmarks.createdAt));
}

export async function addBookmark(userId: number, articleId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const existing = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)))
    .limit(1);
  if (existing.length > 0) return;
  await db.insert(bookmarks).values({ userId, articleId });
}

export async function removeBookmark(userId: number, articleId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(bookmarks).where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)));
}

export async function isBookmarked(userId: number, articleId: number) {
  const db = await getDb();
  if (!db) return false;
  const result = await db
    .select()
    .from(bookmarks)
    .where(and(eq(bookmarks.userId, userId), eq(bookmarks.articleId, articleId)))
    .limit(1);
  return result.length > 0;
}

// ─── Newsletter ────────────────────────────────────────────────────────────
export async function subscribeNewsletter(email: string, name?: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db
    .insert(newsletterSubscribers)
    .values({ email, name, isActive: true })
    .onDuplicateKeyUpdate({ set: { isActive: true, name: name ?? undefined } });
}

export async function getNewsletterSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true)).orderBy(desc(newsletterSubscribers.createdAt));
}

// ─── Dashboard Stats ───────────────────────────────────────────────────────
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { totalArticles: 0, publishedArticles: 0, totalComments: 0, pendingComments: 0, totalSubscribers: 0, totalUsers: 0 };
  const [artTotal] = await db.select({ count: sql<number>`count(*)` }).from(articles);
  const [artPublished] = await db.select({ count: sql<number>`count(*)` }).from(articles).where(eq(articles.status, "published"));
  const [commTotal] = await db.select({ count: sql<number>`count(*)` }).from(comments);
  const [commPending] = await db.select({ count: sql<number>`count(*)` }).from(comments).where(eq(comments.status, "pending"));
  const [subTotal] = await db.select({ count: sql<number>`count(*)` }).from(newsletterSubscribers).where(eq(newsletterSubscribers.isActive, true));
  const [userTotal] = await db.select({ count: sql<number>`count(*)` }).from(users);
  return {
    totalArticles: Number(artTotal?.count ?? 0),
    publishedArticles: Number(artPublished?.count ?? 0),
    totalComments: Number(commTotal?.count ?? 0),
    pendingComments: Number(commPending?.count ?? 0),
    totalSubscribers: Number(subTotal?.count ?? 0),
    totalUsers: Number(userTotal?.count ?? 0),
  };
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(desc(users.createdAt));
}

// ─── Homepage Settings ───────────────────────────────────────────────────────
export async function getHomepageSettings() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(homepageSettings);
}

export async function getHomepageSetting(key: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(homepageSettings).where(eq(homepageSettings.key, key)).limit(1);
  return result[0];
}

export async function updateHomepageSetting(key: string, value: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(homepageSettings).values({ key, value, description }).onDuplicateKeyUpdate({ 
    set: { value, description, updatedAt: new Date() } 
  });
}

export async function createHomepageSetting(data: InsertHomepageSetting) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.insert(homepageSettings).values(data);
  const result = await db.select().from(homepageSettings).where(eq(homepageSettings.key, data.key)).limit(1);
  return result[0];
}

export async function deleteHomepageSetting(key: string) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  await db.delete(homepageSettings).where(eq(homepageSettings.key, key));
}
