import { auth } from "@clerk/nextjs";
import * as React from "react";

import QuestionForm from "@/components/forms/QuestionForm";
import { getUserById } from "@/lib/actions/user.action";
import { getQuestionById } from "@/lib/actions/question.action";
import { ParamsProps } from "@/types";

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.id });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <QuestionForm
          type="edit"
          mongoUserId={mongoUser._id}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
