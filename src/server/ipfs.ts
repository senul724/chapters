import { create } from "ipfs-http-client";
import { env } from "~/env.mjs";

export const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: `Basic ${
      Buffer.from(
        `${env.INFURA_PROJECT_ID}:${env.INFURA_PROJECT_SECRET}`,
      ).toString("base64")
    }`,
  },
});

export const uploadObjectToIPFS = async (
  // eslint-disable-next-line
  object: any,
): Promise<string | undefined> => {
  try {
    const path = await ipfs.add(JSON.stringify(object));
    return path.cid.toString();
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};
