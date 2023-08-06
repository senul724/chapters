import toast from "react-hot-toast";
import { getErrorMsg } from "src/data/error-list";
import type { AvailableWallets } from "src/types/web3";
import coinbase from "./wallets/coinbase";
import fortmatic from "./wallets/fortmatic";
import metamask from "./wallets/metamask";

/**
 * @description function to onBoard the user using any wallet of their choice for
 * moving on with the application. Wallets have specific ids.
 */
export const onBoard = async (
  walletId: AvailableWallets,
) => {
  const wallets = {
    "1": metamask(),
    "2": fortmatic(),
    "3": coinbase(),
  };

  // return values
  let token: string | undefined = undefined;
  let account: string | undefined = undefined;

  /**
   * @description wallet object returns 3 ansync function(login(network id), logout,
   * changeNetwork(network id)
   */
  const wallet = wallets[walletId];

  /** checking if the wallet is undefined, whicj is caused by trying to onboard
   * with a non-existing wallet provider */
  if (!wallet.login) {
    return { token, account, walletFound: false };
  }

  /**
   * @description signed hash of this message will be used to uniquely
   * identify the user
   */

  // Initiating the wallet object
  toast.loading("connecting to wallet...");
  const { signer } = await wallet.login();
  toast.dismiss();

  if (!signer) {
    return { token, account, walletFound: false };
  }

  // User account
  account = await signer?.getAddress();

  const message = `I am willing to log into nftshoutout.com with the address "${account}"`;
  try {
    token = await signer.signMessage(message);
  } catch (err) {
    const error = err as { code: string | number | undefined };
    if (error.code === 4001 || error.code === "ACTION_REJECTED") {
      toast.error("please sign the message to move forward");
    } else {
      toast.error(getErrorMsg("sww"));
    }
  }
  return {
    token,
    account,
    walletFound: true,
  };
};
