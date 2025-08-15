import mongoose from "mongoose";

const ResourceSchema = new mongoose.Schema({
  name: String,
  type: String, // pdf / yt link etc.
  url: String,
});

const SubjectSchema = new mongoose.Schema({
  name: String, // subject ka naam
  resources: [ResourceSchema], // subject ke resources
});

const SectionSchema = new mongoose.Schema({
  type: { type: String, enum: ["semester", "topic"], required: true },
  title: String, // e.g. "Year 1 - Semester 2" ya "DSA"
  subjects: [SubjectSchema], // sirf semester ke liye
  resources: [ResourceSchema], // sirf topic ke liye
});

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
    sections: [SectionSchema],
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
