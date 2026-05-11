import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { storagePut } from "./storage";
import {
  addBookmark,
  createArticle,
  createCategory,
  createComment,
  deleteArticle,
  deleteCategory,
  deleteComment,
  getAllArticlesAdmin,
  getAllCategories,
  getAllCommentsAdmin,
  getAllUsers,
  getApprovedComments,
  getArticleById,
  getArticleBySlug,
  getDashboardStats,
  getHomepageSettings,
  getHomepageSetting,
  createHomepageSetting,
  updateHomepageSetting,
  deleteHomepageSetting,
  getNewsletterSubscribers,
  getPublishedArticles,
  getRelatedArticles,
  getUserBookmarks,
  incrementViewCount,
  isBookmarked,
  removeBookmark,
  searchArticles,
  subscribeNewsletter,
  updateArticle,
  updateCategory,
  updateCommentStatus,
} from "./db";

// Admin guard middleware
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      // Clear the cookie with multiple approaches to ensure it's removed
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, expires: new Date(0) });
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: 0 });
      // Also clear any potential Runway Auth cookies
      ctx.res.clearCookie("runway-auth-token", { ...cookieOptions, maxAge: -1 });
      ctx.res.clearCookie("runway-auth-state", { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Categories ────────────────────────────────────────────────────
  categories: router({
    list: publicProcedure.query(() => getAllCategories()),

    navList: publicProcedure.query(() => getNavCategories()),

    featured: publicProcedure.query(() => getFeaturedCategories()),

    create: adminProcedure
      .input(
        z.object({
          name: z.string().min(1),
          nameNe: z.string().optional(),
          slug: z.string().min(1),
          description: z.string().optional(),
          descriptionNe: z.string().optional(),
          color: z.string().optional(),
          iconUrl: z.string().optional(),
          iconKey: z.string().optional(),
          sortOrder: z.number().optional(),
          parentId: z.number().optional(),
          isVisibleInNav: z.boolean().optional(),
          isFeatured: z.boolean().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(({ input }) => createCategory(input)),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          nameNe: z.string().optional(),
          slug: z.string().optional(),
          description: z.string().optional(),
          descriptionNe: z.string().optional(),
          color: z.string().optional(),
          iconUrl: z.string().optional(),
          iconKey: z.string().optional(),
          sortOrder: z.number().optional(),
          parentId: z.number().optional(),
          isVisibleInNav: z.boolean().optional(),
          isFeatured: z.boolean().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(({ input }) => {
        const { id, ...data } = input;
        return updateCategory(id, data);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteCategory(input.id)),

    reorder: adminProcedure
      .input(
        z.object({
          categories: z.array(
            z.object({ id: z.number(), sortOrder: z.number() })
          ),
        })
      )
      .mutation(({ input }) => reorderCategories(input.categories)),

    getById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getCategoryById(input.id)),
  }),

  // ─── Articles ──────────────────────────────────────────────────────
  articles: router({
    list: publicProcedure
      .input(
        z.object({
          limit: z.number().default(10),
          offset: z.number().default(0),
          categoryId: z.number().optional(),
          featured: z.boolean().optional(),
          breaking: z.boolean().optional(),
          trending: z.boolean().optional(),
        })
      )
      .query(({ input }) => getPublishedArticles(input)),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const article = await getArticleBySlug(input.slug);
        if (!article) throw new TRPCError({ code: "NOT_FOUND" });
        await incrementViewCount(article.article.id);
        return article;
      }),

    related: publicProcedure
      .input(
        z.object({ articleId: z.number(), categoryId: z.number().nullable() })
      )
      .query(({ input }) =>
        getRelatedArticles(input.articleId, input.categoryId)
      ),

    search: publicProcedure
      .input(
        z.object({
          query: z.string(),
          limit: z.number().default(10),
          offset: z.number().default(0),
        })
      )
      .query(({ input }) =>
        searchArticles(input.query, input.limit, input.offset)
      ),

    // Admin procedures
    adminList: adminProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(({ input }) => getAllArticlesAdmin(input.limit, input.offset)),

    adminGetById: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(({ input }) => getArticleById(input.id)),

    create: adminProcedure
      .input(
        z.object({
          title: z.string().min(1),
          titleNe: z.string().optional(),
          slug: z.string().min(1),
          excerpt: z.string().optional(),
          excerptNe: z.string().optional(),
          content: z.string().min(1),
          contentNe: z.string().optional(),
          coverImage: z.string().optional(),
          coverImageKey: z.string().optional(),
          categoryId: z.number().optional(),
          status: z.enum(["draft", "published", "scheduled"]).default("draft"),
          isBreaking: z.boolean().default(false),
          isFeatured: z.boolean().default(false),
          isSponsored: z.boolean().default(false),
          youtubeUrl: z.string().optional(),
          tags: z.string().optional(),
          metaTitle: z.string().optional(),
          metaDescription: z.string().optional(),
          scheduledAt: z.date().optional(),
          generateSummary: z.boolean().default(false),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const { generateSummary, ...articleData } = input;
        let aiSummary: string | undefined;
        if (generateSummary && input.content) {
          try {
            const resp = await invokeLLM({
              messages: [
                {
                  role: "system",
                  content:
                    "You are a news editor. Write a concise 2-3 sentence summary of the following news article. Be factual and neutral.",
                },
                {
                  role: "user",
                  content: `Title: ${input.title}\n\n${input.content.substring(0, 3000)}`,
                },
              ],
            });
            const content = resp.choices[0]?.message?.content;
            aiSummary = typeof content === "string" ? content : undefined;
          } catch (e) {
            console.error("AI summary failed:", e);
          }
        }
        return createArticle({
          ...articleData,
          authorId: ctx.user.id,
          aiSummary,
        } as Parameters<typeof createArticle>[0]);
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          titleNe: z.string().optional(),
          slug: z.string().optional(),
          excerpt: z.string().optional(),
          excerptNe: z.string().optional(),
          content: z.string().optional(),
          contentNe: z.string().optional(),
          aiSummary: z.string().optional(),
          coverImage: z.string().optional(),
          coverImageKey: z.string().optional(),
          categoryId: z.number().optional(),
          authorId: z.number().optional(),
          status: z.enum(["draft", "published", "scheduled"]).optional(),
          isBreaking: z.boolean().optional(),
          isFeatured: z.boolean().optional(),
          isSponsored: z.boolean().optional(),
          youtubeUrl: z.string().optional(),
          tags: z.string().optional(),
          metaTitle: z.string().optional(),
          metaDescription: z.string().optional(),
          scheduledAt: z.date().optional(),
          generateSummary: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, generateSummary, ...data } = input;
        if (generateSummary && data.content) {
          try {
            const resp = await invokeLLM({
              messages: [
                {
                  role: "system",
                  content:
                    "You are a news editor. Write a concise 2-3 sentence summary of the following news article. Be factual and neutral.",
                },
                {
                  role: "user",
                  content: `Title: ${data.title ?? ""}\n\n${data.content.substring(0, 3000)}`,
                },
              ],
            });
            const content2 = resp.choices[0]?.message?.content;
            data.aiSummary =
              typeof content2 === "string" ? content2 : undefined;
          } catch (e) {
            console.error("AI summary failed:", e);
          }
        }
        await updateArticle(id, data);
        return getArticleById(id);
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteArticle(input.id)),

    uploadImage: adminProcedure
      .input(
        z.object({
          base64: z.string(),
          filename: z.string(),
          mimeType: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const buffer = Buffer.from(input.base64, "base64");
        const key = `articles/${Date.now()}-${input.filename}`;
        const { url } = await storagePut(key, buffer, input.mimeType);
        return { url, key };
      }),
  }),

  // ─── Comments ──────────────────────────────────────────────────────
  comments: router({
    list: publicProcedure
      .input(z.object({ articleId: z.number() }))
      .query(({ input }) => getApprovedComments(input.articleId)),

    create: publicProcedure
      .input(
        z.object({
          articleId: z.number(),
          content: z.string().min(1).max(2000),
          guestName: z.string().optional(),
          guestEmail: z.string().email().optional(),
        })
      )
      .mutation(({ input, ctx }) => {
        return createComment({
          articleId: input.articleId,
          content: input.content,
          userId: ctx.user?.id,
          guestName: input.guestName,
          guestEmail: input.guestEmail,
        });
      }),

    adminList: adminProcedure
      .input(
        z.object({
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(({ input }) => getAllCommentsAdmin(input.limit, input.offset)),

    approve: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => updateCommentStatus(input.id, "approved")),

    reject: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => updateCommentStatus(input.id, "rejected")),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteComment(input.id)),
  }),

  // ─── Bookmarks ─────────────────────────────────────────────────────
  bookmarks: router({
    list: protectedProcedure.query(({ ctx }) => getUserBookmarks(ctx.user.id)),

    add: protectedProcedure
      .input(z.object({ articleId: z.number() }))
      .mutation(({ input, ctx }) => addBookmark(ctx.user.id, input.articleId)),

    remove: protectedProcedure
      .input(z.object({ articleId: z.number() }))
      .mutation(({ input, ctx }) =>
        removeBookmark(ctx.user.id, input.articleId)
      ),

    check: protectedProcedure
      .input(z.object({ articleId: z.number() }))
      .query(({ input, ctx }) => isBookmarked(ctx.user.id, input.articleId)),
  }),

  // ─── Newsletter ────────────────────────────────────────────────────
  newsletter: router({
    subscribe: publicProcedure
      .input(
        z.object({ email: z.string().email(), name: z.string().optional() })
      )
      .mutation(({ input }) => subscribeNewsletter(input.email, input.name)),

    adminList: adminProcedure.query(() => getNewsletterSubscribers()),
  }),

  // ─── Homepage Settings ───────────────────────────────────────────────────
  homepage: router({
    getSettings: publicProcedure.query(() => getHomepageSettings()),

    getSetting: publicProcedure
      .input(z.object({ key: z.string() }))
      .query(({ input }) => getHomepageSetting(input.key)),

    // Admin procedures
    adminList: adminProcedure.query(() => getHomepageSettings()),

    updateSetting: adminProcedure
      .input(
        z.object({
          key: z.string(),
          value: z.string(),
          description: z.string().optional(),
        })
      )
      .mutation(({ input }) =>
        updateHomepageSetting(input.key, input.value, input.description)
      ),

    createSetting: adminProcedure
      .input(
        z.object({
          key: z.string(),
          value: z.string(),
          description: z.string().optional(),
        })
      )
      .mutation(({ input }) => createHomepageSetting(input)),

    deleteSetting: adminProcedure
      .input(z.object({ key: z.string() }))
      .mutation(({ input }) => deleteHomepageSetting(input.key)),
  }),

  // ─── Admin ─────────────────────────────────────────────────────────
  admin: router({
    stats: adminProcedure.query(() => getDashboardStats()),
    users: adminProcedure.query(() => getAllUsers()),
    promoteUser: adminProcedure
      .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
      .mutation(async ({ input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        const { users: usersTable } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        await db
          .update(usersTable)
          .set({ role: input.role })
          .where(eq(usersTable.id, input.userId));
        return { success: true };
      }),
  }),

  // ─── Scheduled posts ───────────────────────────────────────────────
  scheduled: router({
    processScheduled: publicProcedure.mutation(async () => {
      const db = await import("./db").then(m => m.getDb());
      if (!db) return { processed: 0 };
      const { articles: articlesTable } = await import("../drizzle/schema");
      const { and, eq, lte } = await import("drizzle-orm");
      const now = new Date();
      await db
        .update(articlesTable)
        .set({ status: "published", publishedAt: now })
        .where(
          and(
            eq(articlesTable.status, "scheduled"),
            lte(articlesTable.scheduledAt, now)
          )
        );
      return { processed: 1 };
    }),
  }),
});

export type AppRouter = typeof appRouter;
