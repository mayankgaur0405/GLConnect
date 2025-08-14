import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    collegeId: { type: String, required: true, unique: true },
    course: { type: String, required: true },
    branch: { type: String, required: true },
    year: { type: Number, required: true },
    password: { type: String, required: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    sections: [
      {
        title: String,
        resources: [
          {
            name: String,
            type: String,
            url: String,
          },
        ],
      },
    ],
  },
  { timestamps: true }
);


export default mongoose.model("User", UserSchema);