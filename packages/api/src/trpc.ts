import { initTRPC, TRPCError } from "@trpc/server";
import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { auth } from "@interview.ai/better-auth/server";
import { fromNodeHeaders } from "better-auth/node";

// 1. Create the context builder
export async function createTRPCContext({
  req,
  res,
}: CreateExpressContextOptions) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  return {
    req,
    res,
    session,
  };
}
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;

// 2. Initialize tRPC with the context type
const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(async ({ next, ctx }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.session.user.id,
      session: ctx.session,
    },
  });
});
