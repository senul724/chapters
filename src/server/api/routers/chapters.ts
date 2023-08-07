import { JsonRpcProvider } from "@ethersproject/providers";
import { TRPCError } from "@trpc/server";
import { Contract, type ContractFunction } from "ethers";
import { z } from "zod";
import { getErrorMsg } from "~/data/error-list";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { ZodAvailableNetworks } from "~/types/web3";
import { getNetworkArray } from "~/utils/type_helper";
import * as pvtRPCs from "~/web3/rpcs/private-rpcs.json";

export const chaptersRouter = createTRPCRouter({
  getChapters: privateProcedure
    .input(z.object({ chapterId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const payload = await ctx.prisma.chapter.findUnique({
          where: {
            id: input.chapterId,
          },
          select: {
            rootId: input.chapterId !== 1,
            level: true,
            authorAddress: true,
            content: true,
            branches: {
              select: {
                id: true,
                rootId: true,
                content: true,
              },
            },
          },
        });
        return { payload };
      } catch {
        return { payload: null };
      }
    }),
  publishChapter: privateProcedure
    .input(z.object({ rootId: z.number(), level: z.number(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { rootId, level, content } = input;
      try {
        await prisma.chapter.create({
          data: {
            authorAddress: ctx.session.address,
            rootId,
            level,
            content,
          },
        });
        return { success: true };
      } catch {
        return { success: false };
      }
    }),
});
