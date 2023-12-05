"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { GetTopInteractedTagsParams } from "./shared.types.d";

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
