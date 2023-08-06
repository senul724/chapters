import { useRef } from "react";
import { toast } from "react-hot-toast";
import { GrClose } from "react-icons/gr";
import { api } from "~/utils/api";

export default function Compose(
  props: { name: string | null | undefined; address: string | null | undefined; closeAction: () => void },
) {
  const { name, address, closeAction } = props;
  const { mutateAsync: shoutOut, isLoading } = api.web3.shoutOut.useMutation();

  const contentRef = useRef<HTMLTextAreaElement>(null);

  const handleShoutout = async () => {
    const content = contentRef.current?.value;
    if (isLoading) return;

    if (!address) {
      return toast.error("no address found!");
    }

    if (!content) {
      return toast.error("provide a message to send");
    }

    toast.loading("shouting out...");
    const res = await shoutOut({ collectionAddress: address, msg: content });
    toast.dismiss();

    res.success ? toast.success(res.msg) : toast.error(res.msg);
  };

  return (
    <>
      {address
        && (
          <div className="flex flex-col gap-10 justify-center items-center w-full min-h-screen">
            <div className="flex justify-end w-2/3">
              <GrClose size={30} onClick={() => void closeAction()} className="hover:scale-110" />
            </div>
            <p className="mb-10 text-4xl font-bold text-gray-600">shout out to {name} community!</p>
            <textarea
              className="p-4 w-2/3 h-48 text-xl rounded-lg border-2 border-gray-400"
              placeholder="enter your message here"
              ref={contentRef}
            />
            <button
              className="py-1 px-3 text-xl font-semibold text-white bg-blue-400 rounded-lg"
              onClick={() => void handleShoutout()}
            >
              shout out
            </button>
          </div>
        )}
    </>
  );
}
