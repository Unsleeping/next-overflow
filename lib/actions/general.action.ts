"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { SearchParams } from "./shared.types";
import User from "@/database/user.model";
import Answer from "@/database/answer.model";
import Tag from "@/database/tag.model";

const SearchableTypes = ["question", "answer", "user", "tag"];

const itemToRenderableItemFactory =
  (
    type: string | null | undefined,
    query: string | null | undefined,
    searchField: string
  ) =>
  (item: any) => ({
    title:
      type === "answer" ? `Answers containing ${query}` : item[searchField],
    type,
    id:
      type === "user"
        ? item.clerkId
        : type === "answer"
          ? item.question
          : item._id,
  });

export async function globalSearch(params: SearchParams) {
  try {
    connectToDatabase();

    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };
    let results = [];

    const modelsAndTypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: Answer, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];

    const lowercasedType = type?.toLowerCase();

    if (!lowercasedType || !SearchableTypes.includes(lowercasedType)) {
      // search across everything
      for (const { model, searchField, type } of modelsAndTypes) {
        const queryResults = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        const itemToRenderableItem = itemToRenderableItemFactory(
          type,
          query,
          searchField
        );

        results.push(...queryResults.map(itemToRenderableItem));
      }
    } else {
      // search in the specified model type
      const modelInfo = modelsAndTypes.find((i) => i.type === lowercasedType);

      if (!modelInfo) {
        throw new Error("Invalid search type");
      }

      const queryResults = await modelInfo.model
        .find({
          [modelInfo.searchField]: regexQuery,
        })
        .limit(8);

      const itemToRenderableItem = itemToRenderableItemFactory(
        type,
        query,
        modelInfo.searchField
      );

      results = queryResults.map(itemToRenderableItem);
    }
    return JSON.stringify(results);
  } catch (error) {
    console.error(`Error fetching global results: ${error}`);
    throw error;
  }
}
