import mongoose from "mongoose"; // require 대신 import 사용

const chatSchema = new mongoose.Schema(
  {
    chat: String,
    user: {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
      name: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema); // module.exports 대신 export default 사용