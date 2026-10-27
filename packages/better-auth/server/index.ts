import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@interview.ai/db";
import { isAllowedOrigin } from "./origins";

export { allowAnyOrigin, isAllowedOrigin } from "./origins";

const isProd =
  process.env.NODE_ENV === "production" ||
  Boolean(process.env.RENDER) ||
  Boolean(process.env.VERCEL);

const clientUrl = isProd
  ? process.env.PROD_CLIENT_URL || "https://interview-ai-client-umber.vercel.app"
  : process.env.DEV_CLIENT_URL || process.env.CLIENT_URL || "http://localhost:5173";

const authUrl = isProd
  ? process.env.PROD_API_URL || "https://interview-ai-y31s.onrender.com"
  : process.env.DEV_API_URL || process.env.BETTER_AUTH_URL || "http://localhost:3001";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  baseURL: authUrl,
  // Echo the caller's origin when the shared policy allows it, so every frontend domain can sign in
  trustedOrigins: (request) => {
    const origin = request?.headers.get("origin");
    return origin && isAllowedOrigin(origin) ? [origin] : [];
  },
  advanced: {
    disableCSRFCheck: true,
    defaultCookieAttributes: {
      sameSite: isProd ? "none" : "lax",
      secure: isProd,
    },
  },
  account: {
    storeStateStrategy: "database",
  },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8, // keep in sync with MIN_PASSWORD_LENGTH in @interview.ai/ui email-auth-form
    maxPasswordLength: 128,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});

export type Session = typeof auth.$Infer.Session;
