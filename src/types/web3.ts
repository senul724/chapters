import { z } from "zod";

export const ZodAvailableNetworks = z.enum([
  "1",
  "56",
  "137",
]);
export const ZodAvailableWallets = z.enum(["1", "2", "3"]);
export const ZodAvailableTiers = z.enum([
  "TIER1",
  "TIER2",
  "TIER3",
  "TIER4",
  "TIER5",
]);
export const ZodNFTData = z.object({
  cid: z.string(),
  collectionName: z.string(),
  nftName: z.string(),
  symbol: z.string(),
  description: z.string(),
  choice: z.enum(["custom", "native"]),
  contractAddress: z.string(),
  checkPoint: z.number(),
});
export const ZodChainAndTokens = z.array(z.object({
  chain: z.string(),
  receiver: z.string(),
  tokens: z.boolean(),
}));

export type AvailableNetworks = z.infer<typeof ZodAvailableNetworks>;
export type AvailableNetworkShorts = "eth" | "matic" | "bsc";
export type AvailableWallets = z.infer<typeof ZodAvailableWallets>;
export type AvailableTiers = z.infer<typeof ZodAvailableTiers>;
export type NFTData = z.infer<typeof ZodNFTData>;
export type ChainAndTokens = z.infer<typeof ZodChainAndTokens>;
