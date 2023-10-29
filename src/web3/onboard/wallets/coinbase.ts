import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import type { JsonRpcSigner } from "@ethersproject/providers";
import { providers } from "ethers";
import toast from "react-hot-toast";
import { getErrorMsg } from "src/data/error-list";

const coinbase = () => {
  // const walletId = '5'

  // Initializing the Coinbase SDK
  const cb = new CoinbaseWalletSDK({
    appName: "chapter",
    appLogoUrl: "",
    darkMode: false,
  });

  // Getting the coinbase provider from injected web3
  const cbProvider = cb.makeWeb3Provider();

  // checking of the wallet is available
  if (!cbProvider) {
    return { login: undefined };
  }

  // Function to initiate the wallet instance
  const initiate = async () => {
    let confirmation = false;
    let signer: undefined | JsonRpcSigner = undefined;

    try {
      await cbProvider.enable();
      // eslint-disable-next-line
      const provider = new providers.Web3Provider(cbProvider as any);
      signer = provider.getSigner();
      confirmation = true;
    } catch {
      toast.error(getErrorMsg("sww"));
    }
    return { confirmation, signer };
  };

  // Events
  /**
   * @description user is logged out(only the context will be removed) if address
   * is changed cause an address is unique to an account
   */
  // cbProvider.on("accountsChanged", async (accountChanged: string[]) => {
  // //   const changedAdddress = accountChanged[0]?.toLowerCase();
  // //   (if anything, add here)
  // });

  // Handles context when chain is changed
  // cbProvider.on("chainChanged", async (chain: string) => {
  //   const network = String(parseInt(chain, 16));
  // //   (if anything, add here)
  // });

  // Handles if user disconnect the Dapp
  // cbProvider.on("disconnect", async () => if anything add here());

  return {
    login: initiate,
  };
};

export default coinbase;
