import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import RenderTag from "@/components/shared/RenderTag";

const dummyTags = [
  { label: "Next.js", count: 18493, _id: "1" },
  { label: "Javascript", count: 20152, _id: "2" },
  { label: "React.js", count: 16269, _id: "3" },
  { label: "Node.js", count: 15121, _id: "4" },
  { label: "Python", count: 14431, _id: "5" },
  { label: "Microsoft azure", count: 9429, _id: "6" },
  { label: "PostgreSQL", count: 4390, _id: "7" },
  { label: "Machine learning", count: 3042, _id: "8" },
];

const dummyNetworks = [
  {
    title:
      "Would it be appropriate to point out an error in another paper during a referee report?",
    _id: "1",
  },
  { title: "How can an airconditioning machine exist?", _id: "2" },
  { title: "Interrogated every time crossing UK Border as citizen", _id: "3" },
  { title: "Low digit addition generator", _id: "4" },
  {
    title: "What is an example of 3 numbers that do not make up a vector?",
    _id: "5",
  },
];

const RightSidebar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[330px] flex-col overflow-y-auto border-l p-6 pt-36 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-6 flex flex-col gap-[30px]">
          {dummyNetworks.map(({ title, _id }) => (
            <Link
              key={_id}
              href={`/questions/${_id}`}
              className="flex cursor-pointer items-center justify-between text-dark-500 hover:text-primary-500 dark:text-light-700 hover:dark:text-primary-500"
            >
              <p className="body-medium mr-2.5">{title}</p>
              <Image
                width={20}
                height={20}
                alt="arrow"
                src="/assets/icons/chevron-right.svg"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-[30px]">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-6 flex flex-col gap-4">
          {dummyTags.map(({ label, count, _id }) => (
            <RenderTag
              key={label}
              _id={_id}
              name={label}
              totalQuestions={count}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
