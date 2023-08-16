import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";
import { uploadObjectToIPFS } from "~/server/ipfs";
import { mongoDBCount } from "~/server/mongo";

export const ipfsRouter = createTRPCRouter({
  getCid: privateProcedure
    .input(z.object({ content: z.string(), title: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { title, content } = input;

      try {
        const chapterCount = await mongoDBCount.findOne();
        if (!chapterCount?.nextId) {
          return { cid: undefined };
        }
        const chapterId = Number(chapterCount.nextId);
        if (!chapterId) {
          return { cid: undefined };
        }
        const metaDataBlob = {
          "collection name": "Chapters",
          name: `Chapter ${chapterId}`,
          image: env.NFT_IMAGE,
          description: `This is a chapter that ${ctx.session.address} wrote for the chapters collection`,
          attributes: [
            { trait_type: "chapter id", value: String(chapterId) },
            { trait_type: "title", value: title },
            { trait_type: "story", value: content },
            { trait_type: "author", value: ctx.session.address },
          ],
        };
        return { cid: await uploadObjectToIPFS(metaDataBlob) };
      } catch {
        return { cid: undefined };
      }
    }),
});
