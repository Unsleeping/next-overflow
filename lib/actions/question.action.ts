"use server";

import { revalidatePath } from "next/cache";

import {
  GetQuestionByIdParams,
  CreateQuestionParams,
  GetQuestionsParams,
} from "./shared.types.d";
import { connectToDatabase } from "@/lib/mongoose";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import User from "@/database/user.model";

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
