import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;

  try {
    // Check for logout flag in request headers to prevent session restoration
    const logoutFlag = opts.req.headers["x-auth-logout-flag"];
    if (logoutFlag === "true") {
      console.log("[Context] Logout flag detected, skipping authentication");
      return {
        req: opts.req,
        res: opts.res,
        user: null,
      };
    }

    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
