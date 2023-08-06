import type { AvailableWallets } from "src/types/web3";
import { getOsName } from "src/utils/cookies";

const downloadLink = {
  "1": "https://metamask.io/download/",
  "2": "",
  "3": "https://www.coinbase.com",
};

export function walletNotFound(walletId: AvailableWallets, destination: string) {
  let deepLink: string;

  switch (walletId) {
    case "1":
      deepLink = `https://metamask.app.link/dapp/szeeta.com/${destination}`;
      break;
    case "3":
      if (getOsName() === "MAC") {
        deepLink = encodeURIComponent(`cbwallet://dapp?url=${destination}`);
        break;
      }

      deepLink = encodeURIComponent(`https://go.cb-w.com/dapp?cb_url=${destination}`);
      break;
    default:
      deepLink = "";
  }
  const deepLinkCallback = () => {
    window.open(deepLink, "_blank");
  };

  const dowloadCallback = () => {
    window.open(downloadLink[walletId], "_blank");
  };

  return [
    {
      buttonText: "dowload wallet",
      buttonOnClick: dowloadCallback,
    },
    {
      buttonText: "open mobile app",
      buttonOnClick: deepLinkCallback,
    },
  ];
}
