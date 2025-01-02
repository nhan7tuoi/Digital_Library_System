import mongoose from "mongoose";
import { HistoryStatus } from "../types/history.type";

const historySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Books" },
    page: { type: Number },
    status: {
      type: Number,
      enum: [HistoryStatus.Deleted, HistoryStatus.Saved],
      default: HistoryStatus.Saved,
    },
  },
  { timestamps: true }
);

const Histories = mongoose.model("Histories", historySchema);
export default Histories;
