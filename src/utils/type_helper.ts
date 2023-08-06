import { z } from "zod";
import { type AvailableNetworks, ZodAvailableNetworks } from "~/types/web3";

export const getNetworkArray = (arr: string[] | undefined): AvailableNetworks[] => {
  try {
    return z.array(ZodAvailableNetworks).parse(arr);
  } catch {
    return [];
  }
};
