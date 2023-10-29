import { useRef } from "react";
import { toast } from "react-hot-toast";
import { GrClose } from "react-icons/gr";
import { getErrorMsg } from "~/data/error-list";
import { api } from "~/utils/api";

export default function Compose(
  props: { rootId: number; level: number; closeAction: () => void; refetch: () => Promise<void>; prevContent: string },
) {
  const { rootId, level, closeAction, refetch, prevContent } = props;
  const { mutateAsync: publish, isLoading } = api.chapters.publishChapter.useMutation();

  const contentRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    if (!isLoading) {
      closeAction();
    }
  };

  const handleShoutout = async () => {
    const content = contentRef.current?.value;
    const title = titleRef.current?.value;
    if (isLoading) return;

    if (!content || !title) {
      return toast.error("please add your story and title to move forward");
    }

    toast.loading("publishing...");
    const res = await publish({ title, rootId, level, content });
    toast.dismiss();

    if (res.success) {
      toast.success("successfully published chapter!");
      await refetch();
    } else {
      toast.error(getErrorMsg("sww"));
    }
    closeAction();
  };

  return (
    <div className="flex flex-col gap-10 justify-center items-center w-full min-h-screen">
      <div className="flex justify-end w-2/3">
        <GrClose
          size={30}
          onClick={() => void handleClose()}
          className="cursor-pointer hover:scale-110 bg-[#ffe57f] rounded-full p-1"
        />
      </div>
      <p className="mb-10 text-4xl font-bold text-[#ffe57f]">{prevContent}</p>
      <textarea
        className="p-4 w-2/3 h-48 text-xl bg-[#0C0A00] rounded-lg border-2 text-[#ffe57f] border-[#ffe57f]"
        placeholder="continue the story from here..."
        ref={contentRef}
      />
      <textarea
        className="p-4 w-2/3 h-20 text-xl bg-[#0C0A00] rounded-lg border-2 text-[#ffe57f] border-[#ffe57f]"
        placeholder="enter a title for your chapter"
        ref={titleRef}
        maxLength={120}
      />
      <button
        className="py-1 px-3 text-2xl font-semibold text-[#ffe57f] rounded-lg w-1/4 border border-[#ffe57f] hover:scale-105"
        onClick={() => void handleShoutout()}
      >
        publish
      </button>
    </div>
  );
}
