import Head from "next/head";
import { useEffect, useState } from "react";
import Compose from "~/components/dashboard/compose";
import { api } from "~/utils/api";

export default function Home() {
  const [chapterId, setChapterId] = useState(1);
  const [composing, setComposing] = useState(false);
  const [rootContent, setRootContent] = useState<{ [key: number]: string }>({ 1: "Once upon a time..." });

  const { data, isLoading, refetch } = api.chapters.getBranchChapters.useQuery({ chapterId }, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
  useEffect(() => {
    console.log(data);
  }, [data, chapterId]);

  const getContent = (id: number) => {
    return data?.contentList?.find((el) => el.id === id)?.content ?? "...";
  };

  return (
    <>
      <Head>
        <title>Chapters</title>
        <meta name="description" content="Complete the story and mint your chapter!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-center items-center min-h-screen bg-black">
        <div className="container flex flex-col gap-12 justify-center items-center py-16 px-4">
          {data?.payload && data.contentList
            ? (
              <>
                {composing
                  ? (
                    <Compose
                      level={data.payload.level + 1}
                      rootId={chapterId}
                      closeAction={() => setComposing(false)}
                      prevContent={rootContent[chapterId] ?? "..."}
                      refetch={async () => {
                        await refetch();
                      }}
                    />
                  )
                  : (
                    <>
                      <div className="flex gap-4 tracking-tight border-2 py-10 w-2/3 border-[#ffc400] rounded-xl ">
                        <p className="w-full text-center drop-shadow-xl text-6xl font-semibold text-[#ffc400] ">
                          {rootContent[chapterId] ?? "..."}
                        </p>
                      </div>
                      <div className="-mt-5 w-1/5 bg-white h-[2px]" />
                      <div className="grid grid-cols-3 gap-4 w-full">
                        {data.payload.branches.map((el, index) => (
                          <div
                            className="tracking-tight border-2 py-5 border-[#ffc400] rounded-xl hover:scale-105"
                            key={index}
                            onClick={() => {
                              setRootContent((prev) => {
                                prev[el.id] = getContent(el.id);
                                return prev;
                              });
                              setChapterId(el.id);
                            }}
                          >
                            <p className="w-full text-center drop-shadow-xl text-2xl font-semibold text-[#ffc400] overflow-hidden text-clip line-clamp-1">
                              {getContent(el.id)}
                            </p>
                          </div>
                        ))}
                        {data.payload.branches.length < 6 && (
                          <div
                            className="tracking-tight border-2 py-5 border-[#ffe57f] rounded-xl hover:scale-105"
                            onClick={() => setComposing(true)}
                          >
                            <p className="w-full text-center drop-shadow-xl text-2xl font-semibold text-[#ffe57f] ">
                              Start your own Chapter
                            </p>
                          </div>
                        )}
                      </div>
                      {data.payload.rootId
                        && (
                          <div
                            className="py-2 w-2/3 text-2xl text-center text-white rounded-xl border-2 border-white hover:scale-105"
                            onClick={() => setChapterId(data.payload?.rootId ?? 1)}
                          >
                            go back
                          </div>
                        )}
                    </>
                  )}
              </>
            )
            : isLoading
            ? (
              <div className="flex gap-4 tracking-tight border-2 py-10 w-2/3 border-[#ffc400] rounded-xl ">
                <p className="w-full text-center drop-shadow-xl text-6xl font-semibold text-[#ffc400] ">
                  Loading...
                </p>
              </div>
            )
            : (
              <div className="flex gap-4 tracking-tight border-2 py-10 w-2/3 border-[#ffc400] rounded-xl ">
                <p className="w-full text-center drop-shadow-xl text-6xl font-semibold text-[#ffc400] ">
                  OOps! Something went wrong.
                </p>
              </div>
            )}
        </div>
      </main>
    </>
  );
}
