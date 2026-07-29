import { createAuthClient } from "better-auth/react";

const getBaseUrl = () => {
  const nextPublicProdAuth = process?.env?.NEXT_PUBLIC_PROD_AUTH_URL || process?.env?.NEXT_PUBLIC_PROD_API_URL;
  const nextPublicDevAuth = process?.env?.NEXT_PUBLIC_DEV_AUTH_URL || process?.env?.NEXT_PUBLIC_DEV_API_URL || process?.env?.NEXT_PUBLIC_API_URL;

  if (nextPublicProdAuth || nextPublicDevAuth) {
    const isProd = process?.env?.NODE_ENV === "production";
    if (isProd && nextPublicProdAuth) return nextPublicProdAuth;
    if (nextPublicDevAuth) return nextPublicDevAuth;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "http://localhost:3001";
};

const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

export type Session = typeof authClient.$Infer.Session;

export const { signIn, signUp, useSession, signOut } = authClient;
