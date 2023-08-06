import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [connectWalletOpen, setConnectWalletOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstRender, setFirstRender] = useState(true);

  const Modal = dynamic(() =>
    import("src/web3/onboard/connect-wallet").then(
      (mod) => mod.ConnectWallet,
    )
  );
  return (
    <>
      <Head>
        <title>Chapters</title>
        <meta name="description" content="Complete the story and mint your chapter!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-center items-center min-h-screen">
        <div className="container flex flex-col gap-12 justify-center items-center py-16 px-4">
          <div className="flex gap-4 text-8xl font-extrabold tracking-tight text-white drop-shadow-xl">
            Complete The Story And Mint Your Chapter
          </div>
          <p className="mt-10 text-2xl font-medium text-gray-600 drop-shadow">
            Send a private shoutout to your NFT holders in just a click!
          </p>
          <div className="-mt-5 w-1/5 bg-emerald-500 h-[2px]" />
          <button
            className="py-2 px-4 -mt-5 font-bold text-white bg-emerald-500 rounded-xl shadow-lg hover:scale-105"
            disabled={connectWalletOpen || loading}
            onClick={() => setConnectWalletOpen(true)}
          >
            Get Started
          </button>
        </div>
      </main>
      <Modal
        setConnectWalletOpen={setConnectWalletOpen}
        connectWalletOpen={connectWalletOpen}
        firstRender={firstRender}
        setFirstRender={setFirstRender}
        setLoading={setLoading}
      />
    </>
  );
}
