"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Answer from "@/database/answer.model";
import Question from "@/database/question.model";
import User from "@/database/user.model";
import {
  getDownvoteUpdateQuery,
  getUpvoteUpdateQuery,
} from "@/lib/actions/utils";

export async function createAnswer(params: CreateAnswerParams) {
  try {
    connectToDatabase();

    const { content, author, question, path } = params;

    const newAnswer = await Answer.create({
      content,
      author,
      question,
    });

    // Add the answer to the question's answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });

    // TODO: Add interaction...

    // to update the page with new answer appeared
    revalidatePath(path);
  } catch (error) {
    console.log("createAnswer error: ", error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const answers = await Answer.find({ question: questionId })
      // to get not the author references but the users themselves
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture", // select specific properties
      })
      // to sort the answers by their createdAt date, descending order
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log("error getting answers", error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;

    const updateQuery = getDownvoteUpdateQuery({
      hasUpvoted,
      hasDownvoted,
      userId,
    });

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) {
      throw new Error("Answer not found");
    }

    // increment author's reputatuon by +10 for downvoting an answer

    revalidatePath(path);
  } catch (error) {
    console.log("error downvoting answer", error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDatabase();

    const { answerId, userId, hasUpvoted, hasDownvoted, path } = params;
    console.log("answerId: ", answerId);

    const updateQuery = getUpvoteUpdateQuery({
      hasUpvoted,
      hasDownvoted,
      userId,
    });

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) {
      throw new Error("Answer not found");
    }

    // increment author's reputatuon by +10 for upvoting an answer

    revalidatePath(path);
  } catch (error) {
    console.log("error upvoting answer", error);
    throw error;
  }
}
