"use server";

import { revalidatePath } from "next/cache";
import { FilterQuery } from "mongoose";

import {
  GetQuestionByIdParams,
  CreateQuestionParams,
  GetQuestionsParams,
  QuestionVoteParams,
  ToggleSaveQuestionParams,
  GetSavedQuestionsParams,
  GetQuestionsByTagIdParams,
  DeleteQuestionParams,
  EditQuestionParams,
} from "./shared.types.d";
import Question from "@/database/question.model";
import User, { SavedQuestion } from "@/database/user.model";
import Tag from "@/database/tag.model";
import Interaction from "@/database/interaction.model";
import Answer from "@/database/answer.model";
import { connectToDatabase } from "@/lib/mongoose";
import {
  getDownvoteUpdateQuery,
  getUpvoteUpdateQuery,
} from "@/lib/actions/utils";

export async function getQuestions(params: GetQuestionsParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 20, searchQuery, filter } = params;

    // calculate the number of posts to skip based on the page number and page size
    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "newest":
        sortOptions = { createdAt: -1 };
        break;
      case "unanswered":
        query.answers = { $size: 0 };
        break;
      case "frequent":
        sortOptions = { views: -1 };
        break;
    }

    const questions = await Question.find(query)
      // to get not the tag references but the tags themselves
      .populate({
        path: "tags",
        model: Tag,
      })
      // to get not the author references but the users themselves
      .populate({ path: "author", model: User })
      // to sort the questions by their createdAt date, descending order
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    const totalQuestions = await Question.countDocuments(query);
    const isNext = totalQuestions > skipAmount + questions.length;

    return { questions, isNext };
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
    await Interaction.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });

    // increment author's reputation by +5 for creating a question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });

    // purge the cached page for the question's path
    revalidatePath(path);
  } catch (e) {
    console.log("createQuestion error: ", e);
    throw e;
  }
}

export async function editQuestion(params: EditQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, title, content, path } = params;

    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not found");
    }

    question.title = title;
    question.content = content;

    await question.save();

    // purge the cached page for the question's path
    revalidatePath(path);
  } catch (e) {
    console.log("editQuestion error: ", e);
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
      });

    return question;
  } catch (error) {
    console.log("error getting question by id", error);
    throw error;
  }
}

export async function getQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    connectToDatabase();

    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const skipAmount = (page - 1) * pageSize;

    const tagFilter: FilterQuery<typeof Tag> = { _id: tagId };

    const query = searchQuery
      ? { title: { $regex: searchQuery, $options: "i" } }
      : {};

    const tag = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: query,
      options: {
        sort: { createdAt: -1 },
        skip: skipAmount,
        limit: pageSize,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tag) {
      throw new Error("Tag not found");
    }

    const questions = tag.questions;

    const tags = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: query,
    });
    const totalQuestions = tags.questions.length;
    const isNext = totalQuestions > skipAmount + questions.length;

    return {
      tagTitle: tag.name,
      questions,
      isNext,
    };
  } catch (error) {
    console.log("error getting question by tag id", error);
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

    // increment user's reputatuon by +1/-1 for upvoting/revoking a question
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasUpvoted ? -1 : 1 }, // hasUpvoted === has upvoted before the user click upvote
    });

    // increment author's reputation by +10/-10 for recieving an upvote/downvote to the question
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasUpvoted ? -10 : 10 },
    });

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
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasDownvoted ? -1 : 1 },
    });

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasDownvoted ? -10 : 10 },
    });

    // todo: check the interaciton to your own to prevent exploit the rep

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

    const isQuestionSaved = !!user.saved.find((q: SavedQuestion) => {
      return JSON.stringify(q.question) === JSON.stringify(questionId);
    });

    if (isQuestionSaved) {
      updateQuery = {
        $pull: { saved: { question: questionId } },
      };
    } else {
      updateQuery = {
        $addToSet: { saved: { question: questionId, savedAt: new Date() } },
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

    const { clerkId, filter, searchQuery, page = 1, pageSize = 20 } = params;

    const skipAmount = (page - 1) * pageSize;

    const query: FilterQuery<typeof Question> = searchQuery
      ? {
          "saved.question.title": {
            $regex: new RegExp(searchQuery, "i"),
          },
        }
      : {};

    let sortOptions: Record<string, 1 | -1> = {
      "savedQuestions.savedAt": -1,
    };

    switch (filter) {
      case "most_recent":
        sortOptions = { "savedQuestions.createdAt": -1 };
        break;
      case "oldest":
        sortOptions = { "savedQuestions.createdAt": 1 };
        break;
      case "most_voted":
        sortOptions = { "savedQuestions.upvotes": -1 };
        break;
      case "most_viewed":
        sortOptions = { "savedQuestions.views": -1 };
        break;
      case "most_answered":
        sortOptions = { "savedQuestions.answers": -1 };
        break;
    }

    const userAggregation = await User.aggregate([
      { $match: { clerkId } },
      {
        $lookup: {
          from: "questions",
          localField: "saved.question",
          foreignField: "_id",
          as: "savedQuestions",
        },
      },
      { $unwind: "$savedQuestions" },
      {
        $lookup: {
          from: "tags",
          localField: "savedQuestions.tags",
          foreignField: "_id",
          as: "savedQuestions.tags",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "savedQuestions.author",
          foreignField: "_id",
          as: "savedQuestions.author",
        },
      },
      { $unwind: "$savedQuestions.author" },
      {
        $addFields: {
          "savedQuestions.savedAt": {
            $arrayElemAt: [
              "$saved.savedAt",
              { $indexOfArray: ["$saved.question", "$savedQuestions._id"] },
            ],
          },
        },
      },
      { $match: query },
      { $sort: sortOptions },
      { $skip: skipAmount },
      { $limit: pageSize },
      {
        $group: {
          _id: "$_id",
          savedQuestions: { $push: "$savedQuestions" },
        },
      },
    ]);

    if (!userAggregation || userAggregation.length === 0) {
      throw new Error("User not found or no saved questions");
    }

    const user = userAggregation[0];

    const savedQuestionAggregationArray = await User.aggregate([
      { $match: { clerkId } },
      {
        $lookup: {
          from: "questions",
          localField: "saved.question",
          foreignField: "_id",
          as: "savedQuestions",
        },
      },
      { $unwind: "$savedQuestions" },
      {
        $group: {
          _id: "$_id",
          savedQuestions: { $push: "$savedQuestions" },
        },
      },
    ]);
    const totalSavedQuestions =
      savedQuestionAggregationArray[0].savedQuestions.length;

    const isNext =
      totalSavedQuestions > skipAmount + user.savedQuestions.length;
    return { questions: user.savedQuestions, isNext };
  } catch (error) {
    console.log("error getting saved questions", error);
    throw error;
  }
}

export async function deleteQuestion(params: DeleteQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, path } = params;

    await Question.deleteOne({ _id: questionId });
    await Answer.deleteMany({ question: questionId });
    await Interaction.deleteMany({ question: questionId });
    await Tag.updateMany(
      { questions: questionId },
      {
        $pull: {
          getSavedQuestions: questionId,
        },
      }
    );

    revalidatePath(path);
  } catch (error) {
    console.log("error deleting question", error);
    throw error;
  }
}

export async function getHotQuestions() {
  try {
    connectToDatabase();

    const questions = await Question.find()
      .sort({ views: -1, upvotes: -1 })
      .limit(5);

    return questions;
  } catch (error) {
    console.log("error getting hot questions", error);
    throw error;
  }
}
