import { HistoryService } from "./../history/history.service";
import { Inject, Service } from "typedi";
import Reviews from "./model/review.model";
import mongoose from "mongoose";
import { ReviewCreateReqDTO } from "./dto/review.dto";
import axios from "axios";
import { ReviewStatus } from "./types/review.type";
import { eachDayOfInterval, format } from "date-fns";
import Histories from "../history/model/history.mode";

@Service()
export class ReviewService {
  constructor(@Inject() private historyService: HistoryService) {}
  async createReview(params: ReviewCreateReqDTO) {
    const { bookId, userId, content, rating } = params;
    
    let history = await this.historyService.getHistory(userId, bookId);
    console.log(history);
    
    if(!history){
      history = new Histories({
        user: new mongoose.Types.ObjectId(userId),
        book: new mongoose.Types.ObjectId(bookId),
        page: 0,
      });
      await history.save();
    }
    const review = await Reviews.findOneAndUpdate(
      {
        book: new mongoose.Types.ObjectId(bookId),
        user: new mongoose.Types.ObjectId(userId),
      },
      { content: content, rating: rating },
      { new: true, upsert: true }
    );

    const response = await axios.post(
      `http://flask:3001/api/v1/recommend/create_model_rating`,
      { userId: userId }
    );
    return review;
  }

  async getReviewByBookId(book: string) {
    console.log(book);
    const review = await Reviews.find({
      book: new mongoose.Types.ObjectId(book),
    })
      .sort({ createdAt: -1 })
      .populate("user", "_id name image");
    return review;
  }

  async getReviewNewestByBookId(book: string) {
    return await Reviews.find({ book: new mongoose.Types.ObjectId(book) })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "_id name image");
  }

  async getAvgRating(bookId: string) {
    const result = await Reviews.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(bookId) } },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    return result.length > 0 ? result[0].avgRating : 0;
  }

  async countReviewByDate(fromDate: Date, toDate: Date, majorsId?: string) {
    const pipeline: any[] = [
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
        },
      },
    ];
    if (majorsId) {
      pipeline.push(
        {
          $lookup: {
            from: "books",
            localField: "book",
            foreignField: "_id",
            as: "bookInfo",
          },
        },
        {
          $unwind: "$bookInfo",
        },
        {
          $match: {
            "bookInfo.majors": new mongoose.Types.ObjectId(majorsId),
          },
        }
      );
    }
    pipeline.push(
      {
        $group: {
          _id: {
            day: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          },
          reviewCount: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.day": 1 },
      }
    );
    const result = await Reviews.aggregate(pipeline);
    const allDates = eachDayOfInterval({ start: fromDate, end: toDate }).map(
      (date) => format(date, "yyyy-MM-dd")
    );
    const reviewCountsByDate = allDates.map((date) => {
      const dayData = result.find((item) => item._id.day === date);
      return {
        date: date,
        reviewCount: dayData ? dayData.reviewCount : 0,
      };
    });

    return reviewCountsByDate;
  }

  async totalReviewByDate(fromDate: Date, toDate: Date, majorsId?: string) {
    const pipeline: any[] = [
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
        },
      },
    ];

    if (majorsId) {
      pipeline.push(
        {
          $lookup: {
            from: "books",
            localField: "book",
            foreignField: "_id",
            as: "bookInfo",
          },
        },
        {
          $unwind: "$bookInfo",
        },
        {
          $match: {
            "bookInfo.majors": new mongoose.Types.ObjectId(majorsId),
          },
        }
      );
    }

    pipeline.push({
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
      },
    });

    const result = await Reviews.aggregate(pipeline);
    return result.length > 0 ? result[0].totalReviews : 0;
  }
}
