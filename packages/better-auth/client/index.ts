import { createAuthClient } from "better-auth/react";

const getBaseUrl = () => {
  const isProd = import.meta.env.PROD || import.meta.env.MODE === "production";
  if (isProd) {
    return (
      import.meta.env.VITE_PROD_AUTH_URL ||
      import.meta.env.VITE_PROD_API_URL ||
      (globalThis as unknown as { location?: { origin: string } }).location?.origin ||
      ""
    );
  }
  return (
    import.meta.env.VITE_DEV_AUTH_URL ||
    import.meta.env.VITE_DEV_API_URL ||
    import.meta.env.VITE_AUTH_URL ||
    "http://localhost:3001"
  );
};

const authClient = createAuthClient({
  baseURL: getBaseUrl(),
});

export type Session = typeof authClient.$Infer.Session;

export const { signIn, signUp, useSession, signOut } = authClient;
