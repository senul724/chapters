export const jwt_key = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "",
);
