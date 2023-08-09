import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { mongoDB } from "~/server/mongo";
import type { IModelObj } from "~/types/data";

export default function Complete({ chapters }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>Chapters</title>
        <meta name="description" content="Complete the story and mint your chapter!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex justify-center items-center w-full bg-black">
        <div className="flex flex-col justify-center items-center w-3/5 min-h-screen">
          <h1 className="mb-10 text-6xl font-bold text-white drop-shadow">These are all the chapter!</h1>
          <ListValue obj={chapters} />
        </div>
      </main>
    </>
  );
}

const ListValue = (props: { obj: IModelObj }) => {
  const { obj } = props;
  return (
    <div className="flex flex-col gap-1 ml-10 w-full">
      <p className="overflow-hidden p-2 w-full text-white rounded border-b border-l border-white text-clip line-clamp-1">
        {obj.content}
      </p>
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
  const payload = await mongoDB.find().toArray();
  const chapters = payload.map((el) => {
    return {
      chapterId: el.chapterId as number,
      content: el.content as string,
      rootId: el.rootId as number | undefined ?? 0,
    };
  });

  const modler = (value: number) => {
    const elementContent = chapters.find(el => el.chapterId === value)?.content;
    const branches = chapters.filter(el => el.rootId === value);
    const obj: IModelObj = { branches: {}, content: elementContent ?? "...", chapterId: value };

    branches.forEach(el => {
      const { chapterId } = el;
      obj.branches[chapterId] = modler(chapterId);
    });

    return obj;
  };

  return {
    props: { chapters: modler(1) },
    revalidate: 60,
  };
};
