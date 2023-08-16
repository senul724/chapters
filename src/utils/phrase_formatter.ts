import { env } from "~/env.mjs";

export const jwt_key = new TextEncoder().encode(
  env.JWT_SECRET,
);
