import type { AvailableNetworks } from "src/types/web3";

const chainIndexes = {
  "1": "1",
  "56": "2",
  "137": "3",
};

export const dummyChainData = [
  [1, "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"],
  [2, "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"],
  [3, "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"],
];

export function getNetworkEventHash(eventId: number, netId: AvailableNetworks) {
  return Number(`${chainIndexes[netId]}${eventId}`);
}
