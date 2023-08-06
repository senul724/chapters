import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { deleteCookie, setCookie } from "cookies-next";
import { SignJWT } from "jose";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { jwt_key } from "~/utils/phrase_formatter";

export const authRouter = createTRPCRouter({
  getSession: privateProcedure
    .input(z.object({ forward: z.boolean() }))
    .query(({ ctx }) => {
      return { session: ctx.session };
    }),
  logout: privateProcedure.mutation(({ ctx }) => {
    deleteCookie("_session", { req: ctx.req, res: ctx.res });
  }),
  login: publicProcedure
    .input(z.object({ address: z.string(), signature: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { address, signature } = input;
      try {
        let payload = {};
        const user = await ctx.prisma.user.findUnique({
          where: {
            address,
          },
          select: {
            signature: true,
            user_name: true,
          },
        });

        if (!user) {
          // hashing the signature to maximize the security
          const signatureHash = await bcrypt.hash(signature, 10);
          await ctx.prisma.user.create({
            data: {
              address,
              signature: signatureHash,
            },
          });
          payload = { address, userName: undefined };
        } else {
          if (!await bcrypt.compare(signature, user.signature)) {
            throw new TRPCError({ code: "CONFLICT" });
          }
          payload = { address, userName: user.user_name };
        }
        const token = await new SignJWT(payload)
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("1d")
          .sign(jwt_key);

        setCookie("_session", token, {
          req: ctx.req,
          res: ctx.res,
          maxAge: 60 * 60 * 24,
          path: "/",
          secure: env.NODE_ENV === "production",
          httpOnly: true,
        });
        return true;
      } catch {
        throw new TRPCError({ code: "PRECONDITION_FAILED" });
      }
    }),
});
