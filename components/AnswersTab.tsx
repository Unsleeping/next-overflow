import * as React from "react";

import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import AnswerCard from "./cards/AnswerCard";

interface AnswersTabProps extends SearchParamsProps {
  clerkId?: string | null;
  userId: string;
}

const AnswersTab: React.FC<AnswersTabProps> = async ({
  searchParams,
  userId,
  clerkId,
}) => {
  const result = await getUserAnswers({
    userId,
    page: 1,
  });
  return (
    <div className="mt-10 flex w-full flex-col gap-6">
      {result.answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes}
          createdAt={answer.createdAt}
          clerkId={clerkId}
        />
      ))}
    </div>
  );
};

export default AnswersTab;
