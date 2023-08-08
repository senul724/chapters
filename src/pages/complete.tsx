import { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { mongoDB } from "~/server/mongo";

interface IChapter {
  chapterId: number;
  rootId: number;
  content: string;
}

interface IModelObj {
  content: string;
  branches: { [key: number]: IModelObj };
}

export default function Complete({ chapters }: InferGetStaticPropsType<typeof getStaticProps>) {
  const modler = (value: number) => {
    const elementContent = chapters.find(el => el.chapterId === value)?.content;
    const branches = chapters.filter(el => el.rootId === value);
    const obj: IModelObj = { branches: {}, content: elementContent ?? "..." };

    branches.forEach(el => {
      const { chapterId } = el;
      obj.branches[chapterId] = modler(chapterId);
    });

    return obj;
  };

  return (
    <>
      <Head>
        <title>Chapters</title>
        <meta name="description" content="Complete the story and mint your chapter!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-center items-center w-full min-h-screen bg-black">
        <h1 className="mb-10 text-6xl font-bold text-white drop-shadow">These are all the chapter!</h1>
        <ListValue obj={modler(1)} />
      </main>
    </>
  );
}

const ListValue = (props: { obj: IModelObj }) => {
  const { obj } = props;
  return (
    <div className="flex flex-col ml-10 w-full">
      <p className="p-2 w-full text-white rounded border border-white lg">{obj.content}</p>
      {Object.keys(obj.branches).map((el) => <ListValue obj={obj.branches[Number(el)] as IModelObj} />)}
    </div>
  );
};

export const getStaticProps: GetStaticProps<{
  chapters: IChapter[];
}> = async () => {
  const payload = await mongoDB.find().toArray();
  const chapters = payload.map((el) => {
    return {
      chapterId: el.chapterId as number,
      content: el.content as string,
      rootId: el.rootId as number | undefined ?? 0,
    };
  });

  return { props: { chapters } };
};
