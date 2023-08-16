import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { chaptersRouter } from "./routers/chapters";
import { ipfsRouter } from "./routers/ipfs";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  chapters: chaptersRouter,
  ipfs: ipfsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
