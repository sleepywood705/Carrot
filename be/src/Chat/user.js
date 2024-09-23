import mongoose from "mongoose"; // require 대신 import 사용

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must type name"],
    unique: true,
  },
  token: {
    type: String,
  },
  online: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("User", userSchema); // module.exports 대신 export default 사용