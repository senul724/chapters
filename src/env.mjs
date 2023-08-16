import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    INFURA_PROJECT_ID:z.string(),
    INFURA_PROJECT_SECRET:z.string(),
    JWT_SECRET:z.string(),
    NFT_IMAGE:z.string(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_FORTMATIC_MAIN:z.string(),
    NEXT_PUBLIC_FORTMATIC_TEST:z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    INFURA_PROJECT_ID: process.env.INFURA_PROJECT_ID,
    INFURA_PROJECT_SECRET: process.env.INFURA_PROJECT_SECRET,
    NEXT_PUBLIC_FORTMATIC_TEST:process.env.NEXT_PUBLIC_FORTMATIC_TEST,
    NEXT_PUBLIC_FORTMATIC_MAIN:process.env.NEXT_PUBLIC_FORTMATIC_MAIN,
    JWT_SECRET:process.env.JWT_SECRET,
    NFT_IMAGE:process.env.NFT_IMAGE,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
