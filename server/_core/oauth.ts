import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { randomBytes } from "crypto";
import bcrypt from "bcrypt";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { ENV } from "./env";

const adminResetTokens = new Map<
  string,
  { token: string; expiresAt: number }
>();

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

async function ensureDefaultAdminAccount() {
  const adminEmail = ENV.adminEmail;
  const adminPassword = ENV.adminPassword;

  if (!adminEmail || !adminPassword) {
    console.warn(
      "[Admin Setup] ADMIN_EMAIL or ADMIN_PASSWORD is not configured; skipping default admin setup"
    );
    return undefined;
  }

  const existingUser = await db.getUserByEmail(adminEmail);
  const shouldWriteConfiguredCredentials =
    !existingUser ||
    existingUser.role !== "admin" ||
    !existingUser.passwordHash;

  if (!shouldWriteConfiguredCredentials) {
    return existingUser;
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await db.upsertUser({
    openId: existingUser?.openId ?? ENV.adminOpenId,
    name: existingUser?.name || "Admin",
    email: adminEmail,
    loginMethod: "admin",
    role: "admin",
    passwordHash,
    lastSignedIn: existingUser?.lastSignedIn ?? new Date(),
  });

  const adminUser = await db.getUserByEmail(adminEmail);
  if (!adminUser) {
    throw new Error("Default admin account could not be loaded after setup");
  }

  console.log("[Admin Setup] Default admin account is ready for:", adminEmail);
  return adminUser;
}

export function registerOAuthRoutes(app: Express) {
  void ensureDefaultAdminAccount().catch(error => {
    console.error(
      "[Admin Setup] Failed to prepare default admin account:",
      error
    );
  });

  app.get("/api/oauth/callback", async (req: Request, res: Response) => {
    const code = getQueryParam(req, "code");
    const state = getQueryParam(req, "state");

    if (!code || !state) {
      res.status(400).json({ error: "code and state are required" });
      return;
    }

    try {
      const tokenResponse = await sdk.exchangeCodeForToken(code, state);
      const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);

      if (!userInfo.openId) {
        res.status(400).json({ error: "openId missing from user info" });
        return;
      }

      await db.upsertUser({
        openId: userInfo.openId,
        name: userInfo.name || null,
        email: userInfo.email ?? null,
        loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(userInfo.openId, {
        name: userInfo.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.redirect(302, "/");
    } catch (error) {
      console.error("[OAuth] Callback failed", error);
      res.status(500).json({ error: "OAuth callback failed" });
    }
  });

  // Development-only login endpoint (when Manus OAuth is not available or DEV_ADMIN_EMAIL is set)
  if (process.env.NODE_ENV === "development" || ENV.devAdminEmail) {
    app.get("/api/dev-login", async (req: Request, res: Response) => {
      try {
        const queryEmail = getQueryParam(req, "email");
        const queryName = getQueryParam(req, "name");
        const queryOpenId = getQueryParam(req, "openId");

        const testEmail = queryEmail ?? ENV.devAdminEmail;
        const testName = queryName ?? ENV.devAdminName;
        const testOpenId = queryOpenId ?? testEmail ?? ENV.devAdminOpenId;

        console.log(
          "[Dev Login] Creating/updating user with openId:",
          testOpenId
        );

        // Upsert user with explicit admin role
        await db.upsertUser({
          openId: testOpenId,
          name: testName,
          email: testEmail,
          loginMethod: "development",
          role: "admin",
          lastSignedIn: new Date(),
        });

        console.log(
          "[Dev Login] User ensured as admin, generating session token..."
        );

        const sessionToken = await sdk.createSessionToken(testOpenId, {
          name: testName,
          expiresInMs: ONE_YEAR_MS,
        });

        console.log("[Dev Login] Session token created, setting cookie...");

        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        console.log("[Dev Login] Login successful, redirecting to admin...");
        res.redirect(302, "/admin");
      } catch (error) {
        console.error("[Dev Login] Failed:", error);
        res
          .status(500)
          .json({ error: "Dev login failed", details: String(error) });
      }
    });

    // Development-only logout endpoint
    app.get("/api/dev-logout", (req: Request, res: Response) => {
      const cookieOptions = getSessionCookieOptions(req);
      res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      res.redirect(302, "/");
    });

    console.log("[Dev Mode] Development login enabled at /api/dev-login");
  }

  // Secret admin login route
  app.post("/api/admin-login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const adminEmail = ENV.adminEmail;
      const adminPassword = ENV.adminPassword;

      console.log(
        "[Admin Login] Received email:",
        JSON.stringify(email),
        "expected:",
        JSON.stringify(adminEmail)
      );

      if (!adminEmail || !adminPassword) {
        console.error("[Admin Login] Admin credentials are not configured");
        return res.status(503).json({ error: "Admin login is not available" });
      }

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      if (email !== adminEmail) {
        console.log("[Admin Login] Email mismatch");
        return res.status(403).json({ error: "Access Denied" });
      }

      console.log("[Admin Login] Email check passed");

      let user;
      try {
        user = await ensureDefaultAdminAccount();
        console.log("[Admin Login] Admin user ready:", !!user);
      } catch (error) {
        console.error("[Admin Login] DB error preparing admin user:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!user || user.role !== "admin") {
        console.log("[Admin Login] User role check failed");
        return res.status(403).json({ error: "Access Denied" });
      }

      console.log("[Admin Login] Password check");
      try {
        console.log("[Admin Login] user.passwordHash:", !!user.passwordHash);
        if (!user.passwordHash) {
          console.log(
            "[Admin Login] No stored admin password hash, writing configured admin hash"
          );
          user = await ensureDefaultAdminAccount();
          if (!user?.passwordHash) {
            console.error(
              "[Admin Login] Failed to reload admin user after writing password hash"
            );
            return res.status(500).json({ error: "Internal server error" });
          }
        }

        let passwordMatch = false;
        if (user?.passwordHash) {
          passwordMatch = await bcrypt.compare(password, user.passwordHash);
        }

        if (!passwordMatch && password === ENV.adminPassword) {
          console.log(
            "[Admin Login] Admin password fallback matched configured ADMIN_PASSWORD, refreshing stored hash"
          );
          const passwordHash = await bcrypt.hash(password, 10);
          await db.upsertUser({
            openId: user.openId,
            name: user.name || "Admin",
            email,
            loginMethod: "admin",
            role: "admin",
            passwordHash,
            lastSignedIn: new Date(),
          });
          passwordMatch = true;
        }

        if (!passwordMatch) {
          console.log("[Admin Login] Password mismatch");
          return res.status(403).json({ error: "Access Denied" });
        }
        console.log("[Admin Login] Password match");
      } catch (error) {
        console.error("[Admin Login] Password check error:", error);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Create session
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOptions,
        maxAge: ONE_YEAR_MS,
      });

      res.json({ success: true, message: "Admin logged in successfully" });
    } catch (error) {
      console.error("[Admin Login] Failed:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Admin forgot password
  app.post(
    "/api/admin-forgot-password",
    async (req: Request, res: Response) => {
      try {
        const { email } = req.body;
        const adminEmail = ENV.adminEmail;
        if (!email) {
          return res.status(400).json({ error: "Email is required" });
        }

        if (email !== adminEmail) {
          return res.status(403).json({ error: "Access Denied" });
        }

        const resetToken = randomBytes(24).toString("hex");
        const resetExpires = Date.now() + 3600000; // 1 hour
        adminResetTokens.set(email, {
          token: resetToken,
          expiresAt: resetExpires,
        });

        const protocol = req.protocol || "http";
        const host = req.get("host") ?? "localhost:3000";
        const resetUrl = `${protocol}://${host}/api/admin-reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

        console.log(`[Admin Forgot Password] Reset URL: ${resetUrl}`);

        res.json({
          success: true,
          message: "Reset instructions logged to console",
        });
      } catch (error) {
        console.error("[Admin Forgot Password] Failed:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    }
  );

  // Admin reset password
  app.post("/api/admin-reset-password", async (req: Request, res: Response) => {
    try {
      const { token, email, newPassword } = req.body;
      const adminEmail = ENV.adminEmail;
      if (!token || !email || !newPassword) {
        return res
          .status(400)
          .json({ error: "Token, email, and new password are required" });
      }

      if (email !== adminEmail) {
        return res.status(403).json({ error: "Access Denied" });
      }

      const tokenEntry = adminResetTokens.get(email);
      if (
        !tokenEntry ||
        tokenEntry.token !== token ||
        tokenEntry.expiresAt < Date.now()
      ) {
        return res
          .status(403)
          .json({ error: "Invalid or expired reset token" });
      }

      adminResetTokens.delete(email);

      const passwordHash = await bcrypt.hash(newPassword, 10);
      await db.upsertUser({
        openId: `admin-${email}`,
        name: "Admin",
        email,
        loginMethod: "admin",
        role: "admin",
        passwordHash,
        lastSignedIn: new Date(),
      });

      res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
      console.error("[Admin Reset Password] Failed:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
}
