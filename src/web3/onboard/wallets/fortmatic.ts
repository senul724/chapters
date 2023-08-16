import type { JsonRpcSigner } from "@ethersproject/providers";
import { providers } from "ethers";
import FortmaticProvider from "fortmatic";
import toast from "react-hot-toast";
import { getErrorMsg } from "src/data/error-list";
import { env } from "~/env.mjs";

const fortmatic = () => {
  // walletId = "2";

  // Initiating the wallet (
  const initiate = async () => {
    let confirmation = false;
    let signer: undefined | JsonRpcSigner = undefined;

    // eslint-disable-next-line
    const fm = new FortmaticProvider(env.NEXT_PUBLIC_FORTMATIC_MAIN);
    const ftmProvider = fm.getProvider();
    if (ftmProvider.isFortmatic) {
      try {
        await fm.user.login();
        // eslint-disable-next-line
        const provider = new providers.Web3Provider(ftmProvider as any);
        signer = provider.getSigner();
        confirmation = true;
      } catch {
        toast.error(getErrorMsg("sww"));
      }
    } else {
      toast.error("No Fortmatic wallet ditected");
    }

    return { confirmation, signer };
  };

  return {
    login: initiate,
  };
};

// const ftConfig = (netId: AvailableNetworks) => {
//   let net;
//   const getApi = (id: string) => {
//     if (id === "1" || id === "56" || id === "137") {
//       return env.NEXT_PUBLIC_FORTMATIC_MAIN;
//     } else {
//       return env.NEXT_PUBLIC_FORTMATIC_TEST;
//     }
//   };
//
//   if (netId === "1") {
//     net = "";
//   } else {
//     net = {
//       rpcUrl: networks[netId],
//       chainId: Number(netId),
//     };
//   }
//   return {
//     apiKey: getApi(netId),
//     network: net,
//   };
// };

export default fortmatic;
