import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { web3Router } from "./routers/web3";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  web3: web3Router,
});

// export type definition of API
export type AppRouter = typeof appRouter;
