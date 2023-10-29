import type { AppProps, AppType } from "next/app";
import Head from "next/head";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactElement, ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  const router = useRouter();

  const { mutateAsync: logout } = api.auth.logout.useMutation();

  const handleLogout = async () => {
    await logout();
    await router.push("/");
  };
  return (
    <>
      <Head>
        <title>Chapters</title>
        <meta name="description" content="Complete the story and mint your chapter!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster
        position="top-left"
        toastOptions={{
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
      <nav className="flex justify-center items-center w-full py-4 bg-[#0C0A00] border-b border-[#ffc400]">
        <div
          className="cursor-pointer w-1/2 text-[#ffc400] font-bold text-4xl px-2"
          onClick={() => void router.push("/")}
        >
          Chapters
        </div>
        <div className="w-1/2 text-[#ffc400] flex  font-medium text-xl">
          <Link href={"/story"} className="w-full text-center hover:scale-110">story</Link>
          <Link href={"/activities"} className="w-full text-center hover:scale-110">my commitment</Link>
          <Link href={"/complete"} className="w-full text-center hover:scale-110">full story</Link>
          {router.pathname !== "/"
            ? (
              <button className="w-full text-center hover:scale-110" onClick={() => void handleLogout()}>
                Sign Out
              </button>
            )
            : <Link href={"/"} className="w-full text-center hover:scale-110">Sign In</Link>}
        </div>
      </nav>
      {getLayout(<Component {...pageProps} />)}
    </>
  );
};

export default api.withTRPC(MyApp);
