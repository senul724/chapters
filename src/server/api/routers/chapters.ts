import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { mongoDB, mongoDBCount } from "~/server/mongo";

export const chaptersRouter = createTRPCRouter({
  getChapter: privateProcedure
    .input(z.object({ chapterId: z.number() }))
    .mutation(async ({ input }) => {
      const { chapterId } = input;
      console.log(chapterId);
      const content = await mongoDB.find({ chapterId }).toArray();
      console.log(content);
      if (content && content[0]) {
        return {
          payload: {
            content: content[0].content as string,
            rootId: content[0].rootId as number | undefined,
            chapterId: content[0].chapterId as number,
          },
        };
      }
      return { payload: null };
    }),
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
            title: true,
            author: {
              select: {
                address: true,
                user_name: true,
              },
            },
            branches: {
              select: {
                id: true,
                rootId: true,
                title: true,
              },
            },
          },
        });
        if (!payload) {
          return { payload };
        }
        const content = await mongoDB.find({ chapterId }).toArray();
        return { payload: { ...payload, rootContent: content && content[0] ? content[0].content as string : "..." } };
      } catch {
        return { payload: null };
      }
    }),
  publishChapter: privateProcedure
    .input(z.object({ rootId: z.number(), level: z.number(), content: z.string(), title: z.string().max(121) }))
    .mutation(async ({ input, ctx }) => {
      const { rootId, level, content, title } = input;
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
            title,
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
