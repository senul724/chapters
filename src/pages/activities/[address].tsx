import Link from "next/link";
import { prisma } from "~/server/db";

interface IProps {
  user_name: string | null;
  chapters: {
    title: string;
    id: number;
  }[];
}

export default function UserDash(props: IProps) {
  return (
    <main className="flex justify-center items-center w-full bg-[#0C0A00]">
      <div className="flex flex-col justify-center items-center w-3/5 min-h-screen">
        <h1 className="mb-10 text-6xl font-bold text-white drop-shadow">These are all the chapter you published!</h1>
        {props.chapters.map((el) => (
          <Link
            href={{ pathname: "/story", query: { chapterId: el.id } }}
            className="pb-1 m-2 w-full text-2xl font-medium text-white overflow-hidden text-clip line-clamp-1 drop-shadow border-b border-[#ffc400] cursor-pointer hover:scale-105"
            key={el.id}
          >
            <span className="mr-2 text-xl">{el.id}.</span> {el.title}
          </Link>
        ))}
      </div>
    </main>
  );
}

export async function getStaticPaths() {
  const users = await prisma.user.findMany({
    select: {
      address: true,
    },
  });

  const paths = users.map((user) => ({
    params: { address: user.address },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps(props: { params: { address: string } }) {
  const { params } = props;
  const data = await prisma.user.findUnique({
    where: {
      address: params.address,
    },
    select: {
      user_name: true,
      chapters: {
        select: {
          title: true,
          id: true,
        },
      },
    },
  });

  return {
    props: data,
    revalidate: 60,
  };
}
