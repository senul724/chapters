import type { providers } from "ethers";
import { isAddress } from "ethers/lib/utils";

export function isValidAddress(address: string) {
  return isAddress(address);
}

export async function isValidEOA(address: string, provider: providers.Provider) {
  if (isAddress(address)) {
    return (await provider.getCode(address)) === "0x";
  } else {
    return false;
  }
}
