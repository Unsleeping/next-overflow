import * as React from "react";

import { getUserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import QuestionCard from "./cards/QuestionCard";
import Pagination from "./shared/Pagination";

interface QuestionsTabProps extends SearchParamsProps {
  clerkId?: string | null;
  userId: string;
}

const QuestionsTab: React.FC<QuestionsTabProps> = async ({
  searchParams,
  userId,
  clerkId,
}) => {
  const result = await getUserQuestions({
    userId,
    page: searchParams?.page ? +searchParams.page : 1,
  });
  return (
    <>
      <div className="mt-5 flex w-full flex-col gap-6">
        {result.questions.map((question) => (
          <QuestionCard
            key={question._id}
            _id={question._id}
            title={question.title}
            tags={question.tags}
            author={question.author}
            upvotes={question.upvotes}
            views={question.views}
            answers={question.answers}
            createdAt={question.createdAt}
            clerkId={clerkId}
          />
        ))}
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  );
};

export default QuestionsTab;
