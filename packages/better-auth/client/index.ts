import { createAuthClient } from "better-auth/client";

const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_URL!,
});

export type Session = typeof authClient.$Infer.Session;

export const { signIn, signUp, useSession, signOut } = authClient;
