import * as React from "react";

import { getQuestionByTagId } from "@/lib/actions/question.action";
import NoResult from "@/components/shared/NoResult";
import QuestionCard from "@/components/cards/QuestionCard";

interface PageProps {
  params: { id: string };
  searchParams: any;
}

const Page: React.FC<PageProps> = async ({
  params,
  searchParams,
}: PageProps) => {
  const questions = await getQuestionByTagId({ tagId: params.id });
  return (
    <div>
      {questions.length > 0 ? (
        questions.map((question) => (
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
          />
        ))
      ) : (
        <NoResult
          title="There's no question to show"
          description="Be the first to break the silence! 🚀 Ask a Question and kickstart the discussion. our query could be the next big thing others learn from. Get involved! 💡"
          link="/ask-question"
          linkTitle="Ask a Question"
        />
      )}
    </div>
  );
};

export default Page;
