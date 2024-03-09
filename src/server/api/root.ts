import { createTRPCRouter } from "~/server/api/trpc";
import {dependentRouter} from "~/server/api/routers/dependent"
import {authRouter} from "~/server/api/routers/auth"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  dependent: dependentRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
