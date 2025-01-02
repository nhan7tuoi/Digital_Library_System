import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: { type: String, default: "" },
    page: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Books" },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
