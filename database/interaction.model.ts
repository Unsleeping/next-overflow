import { Schema, models, model, Document } from "mongoose";

export interface IInteraction extends Document {
  user: Schema.Types.ObjectId; // reference to user
  action: string; // which action did the user take
  question: Schema.Types.ObjectId; // maybe this interaction connected to a specific type of question , we wanna keep track of that
  answer: Schema.Types.ObjectId; // viewed, like, seen, whatever to answers
  tags: Schema.Types.ObjectId[]; // same with tags;
  createdAt: Date;
}

const InteractionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  question: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
  answer: {
    type: Schema.Types.ObjectId,
    ref: "Answer",
  },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Interaction =
  models.Interaction || model("Interaction", InteractionSchema);

export default Interaction;
