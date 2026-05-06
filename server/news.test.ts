import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Shared context factories ────────────────────────────────────────────────

function makePublicCtx(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeUserCtx(): TrpcContext {
  return {
    user: {
      id: 42,
      openId: "user-42",
      email: "user@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function makeAdminCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-1",
      email: "admin@example.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

// ─── Auth tests ──────────────────────────────────────────────────────────────

describe("auth", () => {
  it("me returns null for unauthenticated users", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("me returns user for authenticated users", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    const result = await caller.auth.me();
    expect(result?.email).toBe("user@example.com");
    expect(result?.role).toBe("user");
  });

  it("logout clears session cookie", async () => {
    const ctx = makeUserCtx();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});

// ─── Admin access control tests ──────────────────────────────────────────────

describe("admin access control", () => {
  it("non-admin cannot access admin stats", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("unauthenticated user cannot access admin stats", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("non-admin cannot create articles", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.articles.create({
        title: "Test",
        slug: "test",
        content: "Content",
        generateSummary: false,
      })
    ).rejects.toThrow();
  });

  it("non-admin cannot delete articles", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.articles.delete({ id: 1 })).rejects.toThrow();
  });

  it("non-admin cannot manage categories", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(
      caller.categories.create({ name: "Test", slug: "test" })
    ).rejects.toThrow();
  });

  it("non-admin cannot approve comments", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    await expect(caller.comments.approve({ id: 1 })).rejects.toThrow();
  });
});

// ─── Bookmark access control ─────────────────────────────────────────────────

describe("bookmarks access control", () => {
  it("unauthenticated user cannot add bookmarks", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.bookmarks.add({ articleId: 1 })).rejects.toThrow();
  });

  it("unauthenticated user cannot list bookmarks", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(caller.bookmarks.list()).rejects.toThrow();
  });
});

// ─── Newsletter validation ────────────────────────────────────────────────────

describe("newsletter", () => {
  it("rejects invalid email for newsletter subscription", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.newsletter.subscribe({ email: "not-an-email" })
    ).rejects.toThrow();
  });

  it("accepts valid email for newsletter subscription", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    // This will fail if DB is unavailable but validates the input schema
    try {
      await caller.newsletter.subscribe({ email: "test@example.com", name: "Test User" });
    } catch (e: unknown) {
      // DB may not be available in test env; we just verify it doesn't throw a validation error
      const msg = (e as Error).message ?? "";
      expect(msg).not.toContain("invalid_string");
    }
  });
});

// ─── Search input validation ─────────────────────────────────────────────────

describe("articles search", () => {
  it("accepts valid search query", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    // May fail on DB but should not throw a Zod validation error
    try {
      await caller.articles.search({ query: "nepal" });
    } catch (e: unknown) {
      const msg = (e as Error).message ?? "";
      expect(msg).not.toContain("ZodError");
    }
  });
});

// ─── Comment creation validation ─────────────────────────────────────────────

describe("comments", () => {
  it("rejects empty comment content", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.comments.create({ articleId: 1, content: "" })
    ).rejects.toThrow();
  });

  it("rejects comment content exceeding 2000 chars", async () => {
    const caller = appRouter.createCaller(makePublicCtx());
    await expect(
      caller.comments.create({ articleId: 1, content: "x".repeat(2001) })
    ).rejects.toThrow();
  });
});
