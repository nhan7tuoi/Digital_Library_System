import mongoose from "mongoose";
import { Service } from "typedi";
import View from "./model/view.model";
import { eachDayOfInterval, format } from "date-fns";

@Service()
export class ViewService {
  async updateView(bookId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    await View.updateOne(
      { book: new mongoose.Types.ObjectId(bookId), viewDate: today },
      { $inc: { count: 1 } },
      { upsert: true }
    );
    return true;
  }

  async getTotalView(bookId: string) {
    const result = await View.aggregate([
      { $match: { book: new mongoose.Types.ObjectId(bookId) } },
      { $group: { _id: null, totalViews: { $sum: "$count" } } },
    ]);
    return result.length > 0 ? result[0].totalViews : 0;
  }

  async countViewByDate(fromDate: Date, toDate: Date, majorsId?: string) {
    const pipeline: any[] = [
      {
        $match: {
          viewDate: { $gte: fromDate, $lte: toDate },
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
            day: { $dateToString: { format: "%Y-%m-%d", date: "$viewDate" } },
          },
          totalViews: { $sum: "$count" },
        },
      },
      {
        $sort: { "_id.day": 1 },
      }
    );
    const result = await View.aggregate(pipeline);

    const allDates = eachDayOfInterval({ start: fromDate, end: toDate }).map(
      (date) => format(date, "yyyy-MM-dd")
    );

    const viewCountsByDate = allDates.map((date) => {
      const dayData = result.find((item) => item._id.day === date);
      return {
        date: date,
        totalViews: dayData ? dayData.totalViews : 0,
      };
    });

    return viewCountsByDate;
  }

  async totalViewsByDate(fromDate: Date, toDate: Date, majorsId?: string) {
    const pipeline: any[] = [
      {
        $match: {
          viewDate: { $gte: fromDate, $lte: toDate },
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
        totalViews: { $sum: "$count" },
      },
    });
    const result = await View.aggregate(pipeline);
    return result.length > 0 ? result[0].totalViews : 0;
  }
}
