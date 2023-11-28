import * as React from "react";
import Link from "next/link";
import Image from "next/image";

const dummyTags = [
  { label: "Next.js", count: "18493", route: "" },
  { label: "Javascript", count: "20152", route: "" },
  { label: "React.js", count: "16269", route: "" },
  { label: "Node.js", count: "15121", route: "" },
  { label: "Python", count: "14431", route: "" },
  { label: "Microsoft azure", count: "9429", route: "" },
  { label: "PostgreSQL", count: "4390", route: "" },
  { label: "Machine learning", count: "3042", route: "" },
];

const dummyNetworks = [
  {
    title:
      "Would it be appropriate to point out an error in another paper during a referee report?",
    route: "",
  },
  { title: "How can an airconditioning machine exist?", route: "" },
  { title: "Interrogated every time crossing UK Border as citizen", route: "" },
  { title: "Low digit addition generator", route: "" },
  {
    title: "What is an example of 3 numbers that do not make up a vector?",
    route: "",
  },
];

const RightSidebar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[330px] flex-col justify-between overflow-y-auto border-l p-6 pt-36 max-xl:hidden">
      <div>
        <h3 className="h3-bold mb-6 text-dark-500 dark:text-light-900">
          Top Questions
        </h3>
        {dummyNetworks.map(({ title, route }) => (
          <Link
            key={route}
            href={route}
            className="mb-[30px] flex justify-between text-dark-500 hover:text-primary-500 dark:text-light-700 hover:dark:text-primary-500"
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
      <div className="mt-[30px]">
        <h3 className="h3-bold mb-6 text-dark-500 dark:text-light-900">
          Popular Tags
        </h3>
        {dummyTags.map(({ label, count, route }) => (
          <div key={label} className="flex justify-between">
            <Link
              href={route}
              className="small-medium mb-4 rounded-md border border-transparent bg-light-800 px-4 py-2 text-light-400 last:mb-0 hover:border-light-400 dark:bg-dark-300  dark:text-light-500 hover:dark:border-light-400"
            >
              {label.toUpperCase()}
            </Link>
            <p className="small-medium text-dark-500 dark:text-light-700">
              {count}+
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RightSidebar;
