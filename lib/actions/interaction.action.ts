"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    connectToDatabase();

    const { questionId, userId } = params;

    // update view count for the question
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    const interactionData = {
      user: userId,
      action: "view",
      question: questionId,
    };

    // if the user is already viewed that question
    if (userId) {
      const existingInteraction = await Interaction.findOne(interactionData);

      if (existingInteraction) {
        console.log("User has already viewed this question.");
      }

      // create interaction
      await Interaction.create(interactionData);
    }
  } catch (error) {
    console.log("error during viewQuestion", error);
    throw error;
  }
}
