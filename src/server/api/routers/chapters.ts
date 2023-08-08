import { JsonRpcProvider } from "@ethersproject/providers";
import { TRPCError } from "@trpc/server";
import { Contract, type ContractFunction } from "ethers";
import { z } from "zod";
import { getErrorMsg } from "~/data/error-list";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { mongoDB, mongoDBCount } from "~/server/mongo";
import { ZodAvailableNetworks } from "~/types/web3";
import { getNetworkArray } from "~/utils/type_helper";
import * as pvtRPCs from "~/web3/rpcs/private-rpcs.json";

export const chaptersRouter = createTRPCRouter({
  getBranchChapters: privateProcedure
    .input(z.object({ chapterId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { chapterId } = input;
      try {
        const payload = await ctx.prisma.chapter.findUnique({
          where: {
            id: chapterId,
          },
          select: {
            rootId: chapterId !== 1,
            level: true,
            authorAddress: true,
            branches: {
              select: {
                id: true,
                rootId: true,
              },
            },
          },
        });
        let contentList: { content: string; id: number }[] | null = null;
        if (payload) {
          const content = await mongoDB.find({ rootId: chapterId }).toArray();
          contentList = content.map((el) => {
            return { content: el.content, id: el.chapterId };
          });
        }
        return { payload, contentList };
      } catch {
        return { payload: null, contentList: null };
      }
    }),
  publishChapter: privateProcedure
    .input(z.object({ rootId: z.number(), level: z.number(), content: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const { rootId, level, content } = input;
      try {
        const payload = await mongoDBCount.findOne();
        if (!payload?.nextId) {
          return { success: false };
        }
        const nextId = Number(payload.nextId);
        if (!nextId) {
          return { success: false };
        }
        await mongoDB.insertOne({ chapterId: nextId, content, rootId });
        await mongoDBCount.updateOne({ name: "count" }, { $set: { "nextId": nextId + 1 } });
        await prisma.chapter.create({
          data: {
            id: nextId,
            authorAddress: ctx.session.address,
            rootId,
            level,
          },
        });
        return { success: true };
      } catch {
        return { success: false };
      }
    }),
});
