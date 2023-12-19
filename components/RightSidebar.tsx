import * as React from "react";
import Link from "next/link";
import Image from "next/image";

import RenderTag from "@/components/shared/RenderTag";
import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopPopularTags } from "@/lib/actions/tag.action";

const RightSidebar = async () => {
  const hotQuestions = await getHotQuestions();
  const topPopularTags = await getTopPopularTags();
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[330px] flex-col overflow-y-auto border-l p-6 pt-36 dark:shadow-none max-xl:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-6 flex flex-col gap-[30px]">
          {hotQuestions.map(({ title, _id }) => (
            <Link
              key={_id}
              href={`/question/${_id}`}
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
          {topPopularTags.map(
            ({ name: label, numberOfQuestions: count, _id }) => (
              <RenderTag
                key={label}
                _id={_id}
                name={label}
                totalQuestions={count}
                showCount
              />
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
