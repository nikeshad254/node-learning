import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
  subscriber: {
    type: Schema.Types.ObjectId, // who subscribes
    ref: "User",
    required: true,
  },
  channel: {
    type: Schema.Types.ObjectId, // who is subscribed to
    ref: "User",
    required: true,
  },
});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
