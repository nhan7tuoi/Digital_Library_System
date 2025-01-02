import mongoose from "mongoose";

const viewSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Books" },
    viewDate: { type: Date },
    count: { type: Number },
  },
  { timestamps: true }
);

const View = mongoose.model("View", viewSchema);
export default View;