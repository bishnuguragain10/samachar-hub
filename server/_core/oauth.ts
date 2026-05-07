import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import { ENV } from "./env";

function getQueryParam(req: Request, key: string): string | undefined {
  const value = req.query[key];
  return typeof value === "string" ? value : undefined;
}

export function registerOAuthRoutes(app: Express) {
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
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

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

        console.log("[Dev Login] Creating/updating user with openId:", testOpenId);

        // Upsert user with explicit admin role
        await db.upsertUser({
          openId: testOpenId,
          name: testName,
          email: testEmail,
          loginMethod: "development",
          role: "admin",
          lastSignedIn: new Date(),
        });

        console.log("[Dev Login] User ensured as admin, generating session token...");

        const sessionToken = await sdk.createSessionToken(testOpenId, {
          name: testName,
          expiresInMs: ONE_YEAR_MS,
        });

        console.log("[Dev Login] Session token created, setting cookie...");

        const cookieOptions = getSessionCookieOptions(req);
        res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

        console.log("[Dev Login] Login successful, redirecting to admin...");
        res.redirect(302, "/admin");
      } catch (error) {
        console.error("[Dev Login] Failed:", error);
        res.status(500).json({ error: "Dev login failed", details: String(error) });
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
}
