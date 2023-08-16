import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Compose from "~/components/dashboard/compose";
import { api } from "~/utils/api";

export default function Home() {
  const [chapterId, setChapterId] = useState(1);
  const [composing, setComposing] = useState(false);

  const router = useRouter();

  const { data, isLoading, refetch } = api.chapters.getBranchChapters.useQuery({ chapterId }, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const payload = data?.payload;

  useEffect(() => {
    const receivedChapterId = Number(router.query.chapterId);
    if (!receivedChapterId || receivedChapterId === chapterId) {
      return;
    }
    setChapterId(receivedChapterId);
  }, []);

  return (
    <main className="flex flex-col justify-center items-center min-h-screen bg-black">
      <div className="container flex flex-col gap-12 justify-center items-center py-16 px-4">
        {payload
          ? (
            <>
              {composing
                ? (
                  <Compose
                    level={payload.level + 1}
                    rootId={chapterId}
                    closeAction={() => setComposing(false)}
                    prevContent={payload.rootContent}
                    refetch={async () => {
                      await refetch();
                    }}
                  />
                )
                : (
                  <>
                    <p className="w-2/3 text-center drop-shadow-xl text-xl font-medium text-[#ffc400] -mb-5 overflow-hidden text-clip line-clamp-1">
                      {payload.title}
                    </p>
                    <div className="flex flex-col gap-10 tracking-tight border-2 pt-10 w-2/3 border-[#ffc400] rounded-xl ">
                      <p className="w-full text-center drop-shadow-xl text-4xl font-semibold text-[#ffc400] ">
                        {payload.rootContent}
                      </p>
                      <p className="my-5 ml-10 text-white">
                        by {payload.author?.user_name ?? payload.author.address}
                      </p>
                    </div>
                    <div className="-mt-5 w-1/5 bg-white h-[2px]" />
                    <div className="grid grid-cols-3 gap-4 w-full">
                      {payload.branches.map((el, index) => (
                        <div
                          className="tracking-tight border-2 py-5 border-[#ffc400] rounded-xl hover:scale-105 cursor-pointer"
                          key={index}
                          onClick={() => setChapterId(el.id)}
                        >
                          <p className="w-full text-center drop-shadow-xl text-2xl font-semibold text-[#ffc400] overflow-hidden text-clip line-clamp-1">
                            {el.title}
                          </p>
                        </div>
                      ))}
                      {payload.branches.length < 6 && (
                        <div
                          className="tracking-tight border-2 py-5 border-[#ffe57f] rounded-xl hover:scale-105 cursor-pointer"
                          onClick={() => setComposing(true)}
                        >
                          <p className="w-full text-center drop-shadow-xl text-2xl font-semibold text-[#ffe57f] ">
                            Start your own Chapter
                          </p>
                        </div>
                      )}
                    </div>
                    {payload.rootId
                      && (
                        <div className="grid grid-cols-2 gap-4 w-3/4">
                          <div
                            className="py-2 text-2xl text-center text-white rounded-xl border-2 border-white cursor-pointer hover:scale-105"
                            onClick={() => setChapterId(payload.rootId ?? 1)}
                          >
                            go back
                          </div>
                          <div
                            className="py-2 text-2xl text-center text-white rounded-xl border-2 border-white cursor-pointer hover:scale-105"
                            onClick={() => setChapterId(1)}
                          >
                            move to the begining
                          </div>
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
  );
}
