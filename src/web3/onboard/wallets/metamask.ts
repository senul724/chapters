import type { ExternalProvider, JsonRpcSigner } from "@ethersproject/providers";
import { providers } from "ethers";
import toast from "react-hot-toast";
import { getErrorMsg } from "src/data/error-list";

interface IWindowWeb3 {
  providers?: ExternalProvider[];
  isMetaMask?: boolean;
  request?: (request: { method: string }) => Promise<unknown>;
}

const metamask = () => {
  // walletId = "1"

  // Setting up the metamask provider from injected web3
  let metamaskProvider: ExternalProvider | undefined | IWindowWeb3;

  /**
   * @description ethereum,providers object will only be available if there are
   * multiple wallets installed by the user. So setting provider accordingly to
   * avoid any runtime errors
   */
  const windowWeb3 = window.ethereum as undefined | IWindowWeb3;
  if (windowWeb3) {
    if (windowWeb3.providers) {
      metamaskProvider = windowWeb3.providers.find(
        (injectedWallet: ExternalProvider) => injectedWallet.isMetaMask,
      );
      // If not checking if metamask is available
    } else if (windowWeb3.isMetaMask) {
      metamaskProvider = windowWeb3;
    } else {
      metamaskProvider = undefined;
    }
  } else {
    metamaskProvider = undefined;
  }

  // checking of the wallet is available
  if (!metamaskProvider) {
    return { login: undefined };
  }

  // Function for Initializing the wallet and updating the context
  const initiate = async () => {
    let confirmation = false;
    let signer: undefined | JsonRpcSigner = undefined;

    if (!metamaskProvider?.request) {
      return { signer, confirmation };
    }

    try {
      await metamaskProvider.request({ method: "eth_requestAccounts" });
      const provider = new providers.Web3Provider(metamaskProvider);
      signer = provider.getSigner();
      confirmation = true;
    } catch (err) {
      const error = err as { code: string | number };
      if (error.code === -32002) {
        toast.error(
          "You've already requested to onboard, please unlock your wallet and accept the request.",
        );
      } else if (error.code === 4001 || error.code === "ACTION_REJECTED") {
        toast.error("Please accept the signature request");
      } else {
        toast.error(getErrorMsg("sww"));
      }
    }

    return { confirmation, signer };
  };

  // Events
  /**
   * @description user is logged out(only the context will be removed) if address
   * is changed cause an address is unique to an account
   */
  // metamaskProvider.on("accountsChanged", async (accountChanged: string[]) => {
  //   const changedAdddress = accountChanged[0]?.toLowerCase();
  //   (if anything, add here)
  // });
  //
  // // Handles context when chain is changed
  // metamaskProvider.on("chainChanged", async (chain: string) => {
  //   const network = String(parseInt(chain, 16));
  //   (if anything, add here)
  // });
  //
  // // Handles if user disconnect the Dapp
  // metamaskProvider.on("disconnect", async () => (if anything add here);

  return {
    login: initiate,
  };
};

export default metamask;
