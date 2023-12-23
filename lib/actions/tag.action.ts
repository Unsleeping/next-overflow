"use server";

import { FilterQuery } from "mongoose";

import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types.d";
import Tag from "@/database/tag.model";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();
    const {
      userId,
      //  limit = 3
    } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // find interactions for the user and group by tags
    // interaction...
    return [
      { _id: "1", name: "next.js" },
      { _id: "2", name: "clerk" },
      { _id: "3", name: "web3" },
    ];
  } catch (error) {
    console.log("error getting top interacted tags", error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();
    const {
      // page = 1, pageSize = 10,
      filter,
      searchQuery,
    } = params;

    const query: FilterQuery<typeof Tag> = {};

    if (searchQuery) {
      query.$or = [
        {
          name: { $regex: new RegExp(searchQuery, "i") },
        },
      ];
    }

    let sortOptions = {};

    switch (filter) {
      case "popular":
        sortOptions = { questions: -1 };
        break;
      case "recent":
        sortOptions = { createdOn: -1 };
        break;
      case "name":
        sortOptions = { name: 1 };
        break;
      case "old":
        sortOptions = { createdOn: 1 };
        break;
    }

    const tags = await Tag.find(query).sort(sortOptions);
    return tags;
  } catch (error) {
    console.log("error getting all tags", error);
    throw error;
  }
}

export async function getTopPopularTags() {
  try {
    connectToDatabase();
    const tags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);
    return tags;
  } catch (error) {
    console.log("error getting top popular tags", error);
    throw error;
  }
}
