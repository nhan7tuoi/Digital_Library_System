import { Service } from "typedi";
import { HistoryCreateDTO } from "./dto/history.dto";
import Histories from "./model/history.mode";
import mongoose from "mongoose";
import { HistoryStatus } from "./types/history.type";
import axios from "axios";
import { Length } from "class-validator";

@Service()
export class HistoryService {
  async createHistory(params: HistoryCreateDTO) {
    const { book, page, userId } = params;
    let history = await this.getHistory(userId, book);
    if (!history) {
      history = new Histories({
        user: new mongoose.Types.ObjectId(userId),
        book: new mongoose.Types.ObjectId(book),
        page: page,
      });
      await history.save();
      const response = await axios.post(
        `http://flask:3001/api/v1/recommend/create_model_rating`,
        { userId: userId }
      );
    } else {
      history.page = page;
      await history.save();
    }

    return history;
  }
  async getOneHistory(userId: string, bookId: string) {
    const history = await this.getHistory(userId, bookId);
    if (!history) return { page: 1 };
    return history;
  }

  async getHistory(userId: string, bookId: string) {
    const history = await Histories.findOne({
      user: new mongoose.Types.ObjectId(userId),
      book: new mongoose.Types.ObjectId(bookId),
      status: HistoryStatus.Saved,
    });
    return history;
  }

  async getHistoriesByUserId(userId: string) {
    const histories = await Histories.find({
      user: new mongoose.Types.ObjectId(userId),
      status: HistoryStatus.Saved,
    }).populate({
      path: "book",
      populate: {
        path: "genre", // Populate thêm genre trong book
      },
    });

    return histories;
  }

  async deleteHistory(historyId: string) {
    await Histories.updateOne(
      { _id: new mongoose.Types.ObjectId(historyId) },
      { $set: { status: HistoryStatus.Deleted } }
    );
    return true;
  }
}
