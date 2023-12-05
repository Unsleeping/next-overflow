"use server";

import { revalidatePath } from "next/cache";

import {
  GetQuestionByIdParams,
  CreateQuestionParams,
  GetQuestionsParams,
  QuestionVoteParams,
  ToggleSaveQuestionParams,
  GetSavedQuestionsParams,
} from "./shared.types.d";
import { connectToDatabase } from "@/lib/mongoose";
import Question, { IQuestion } from "@/database/question.model";
import Tag from "@/database/tag.model";
import User, { SavedQuestion } from "@/database/user.model";
import {
  getDownvoteUpdateQuery,
  getUpvoteUpdateQuery,
} from "@/lib/actions/utils";
import { getUserById } from "./user.action";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const questions = await Question.find({})
      // to get not the tag references but the tags themselves
      .populate({
        path: "tags",
        model: Tag,
      })
      // to get not the author references but the users themselves
      .populate({ path: "author", model: User })
      // to sort the questions by their createdAt date, descending order
      .sort({ createdAt: -1 });

    return { questions };
  } catch (error) {
    console.log("error getting questions", error);
    throw error;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectToDatabase();

    const { title, content, tags, author, path } = params;

    const question = await Question.create({
      title,
      content,
      author,
    });

    const tagDocuments = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, "i") },
        },
        { $setOnInsert: { name: tag }, $push: { questions: question._id } },
        { upsert: true, new: true }
      );

      tagDocuments.push(existingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });

    // create an interaction record for the user's ask_question action

    // increment author's reputation by +5 for creating a question

    // purge the cached page for the question's path
    revalidatePath(path);
  } catch (e) {
    console.log("createQuestion error: ", e);
    throw e;
  }
}

export async function getQuestionById(params: GetQuestionByIdParams) {
  try {
    connectToDatabase();

    const { questionId } = params;

    const question = await Question.findById(questionId)
      // to get not the tag references but the tags themselves
      .populate({
        path: "tags",
        model: Tag,
        select: "_id name", // select specific properties
      })
      // to get not the author references but the users themselves
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture", // select specific properties
      })
      // to sort the questions by their createdAt date, descending order
      .sort({ createdAt: -1 });

    return question;
  } catch (error) {
    console.log("error getting question by id", error);
    throw error;
  }
}

export async function upvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

    const updateQuery = getUpvoteUpdateQuery({
      hasUpvoted,
      hasDownvoted,
      userId,
    });

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // increment author's reputatuon by +10 for upvoting a question

    revalidatePath(path);
  } catch (error) {
    console.log("error upvoting question", error);
    throw error;
  }
}

export async function downvoteQuestion(params: QuestionVoteParams) {
  try {
    connectToDatabase();

    const { questionId, userId, hasUpvoted, hasDownvoted, path } = params;

    const updateQuery = getDownvoteUpdateQuery({
      hasUpvoted,
      hasDownvoted,
      userId,
    });

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });

    if (!question) {
      throw new Error("Question not found");
    }

    // increment author's reputatuon by +10 for downvoting a question

    revalidatePath(path);
  } catch (error) {
    console.log("error downvoting question", error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    const user = await User.findById(userId).populate({
      path: "saved",
      model: Question,
    });

    if (!user) {
      throw new Error("User not found");
    }

    let updateQuery = {};

    const isQuestionSaved = !!user.saved.find((q: IQuestion) => {
      return JSON.stringify(q._id) === JSON.stringify(questionId);
    });

    if (isQuestionSaved) {
      updateQuery = {
        $pull: { saved: { _id: questionId } },
      };
    } else {
      updateQuery = {
        $addToSet: { saved: { _id: questionId, savedAt: new Date() } },
      };
    }

    await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log("error toggling save question", error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const {
      clerkId,
      // page, pageSize, filter, searchQuery
    } = params;

    const mongoUser = await getUserById({ userId: clerkId });

    const user = await User.findById(mongoUser._id);

    if (!user) {
      throw new Error("User not found");
    }

    const questions = await Question.find({ _id: { $in: user.saved } })
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({ path: "author", model: User });

    const sortedQuestions = questions.sort((first, second) => {
      const userQuestionFirst = user.saved.find(
        (q: SavedQuestion) =>
          JSON.stringify(q._id) === JSON.stringify(first._id)
      );
      const userQuestionSecond = user.saved.find(
        (q: SavedQuestion) =>
          JSON.stringify(q._id) === JSON.stringify(second._id)
      );
      if (userQuestionFirst && userQuestionSecond) {
        const savedAtFirst = userQuestionFirst.savedAt;
        const savedAtSecond = userQuestionSecond.savedAt;
        return savedAtSecond.getTime() - savedAtFirst.getTime();
      }
      return -1;
    });

    return { questions: sortedQuestions };
  } catch (error) {
    console.log("error getting saved questions", error);
    throw error;
  }
}
