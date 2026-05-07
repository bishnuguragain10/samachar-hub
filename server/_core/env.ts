const DEFAULT_DEV_SECRET = "dev-cookie-secret";
const DEFAULT_DEV_APP_ID = "dev-app";

export const ENV = {
  appId: process.env.VITE_APP_ID || process.env.APP_ID || DEFAULT_DEV_APP_ID,
  cookieSecret: process.env.JWT_SECRET || process.env.COOKIE_SECRET || DEFAULT_DEV_SECRET,
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  devAdminName: process.env.DEV_ADMIN_NAME ?? "Development Admin",
  devAdminEmail: process.env.DEV_ADMIN_EMAIL ?? "dev@localhost",
  devAdminOpenId: process.env.DEV_ADMIN_OPEN_ID ?? "dev-admin-user",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
