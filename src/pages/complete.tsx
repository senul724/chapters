import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { prisma } from "~/server/db";
import type { IModelObj } from "~/types/data";

export default function Complete({ chapters }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <main className="flex justify-center items-center w-full bg-[#0C0A00]">
      <div className="flex flex-col justify-center items-center w-3/5 min-h-screen">
        <h1 className="mb-10 text-6xl font-bold text-white drop-shadow">These are all the chapter!</h1>
        <ListValue obj={chapters} />
      </div>
    </main>
  );
}

const ListValue = (props: { obj: IModelObj }) => {
  const { obj } = props;
  return (
    <div className="flex flex-col gap-1 ml-10 w-full">
      <Link
        href={{ pathname: "/story", query: { chapterId: obj.chapterId } }}
        className="overflow-hidden p-2 w-full text-white rounded border-b border-l border-white text-clip line-clamp-1"
      >
        {obj.content}
      </Link>
      {Object.keys(obj.branches).map((el) => {
        const data = obj.branches[Number(el)];
        return data ? <ListValue obj={data} key={el} /> : <></>;
      })}
    </div>
  );
};

export const getStaticProps: GetStaticProps<{
  chapters: IModelObj;
}> = async () => {
  const chapters = await prisma.chapter.findMany({
    select: {
      id: true,
      title: true,
      rootId: true,
    },
  });

  const modler = (value: number) => {
    const elementContent = chapters.find(el => el.id === value)?.title;
    const branches = chapters.filter(el => el.rootId === value);
    const obj: IModelObj = { branches: {}, content: elementContent ?? "...", chapterId: value };

    branches.forEach(el => {
      const { id: chapterId } = el;
      obj.branches[chapterId] = modler(chapterId);
    });

    return obj;
  };

  return {
    props: { chapters: modler(1) },
    revalidate: 60,
  };
};
