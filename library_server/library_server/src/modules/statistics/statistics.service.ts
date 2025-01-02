import { BookAvgRatingDTO, BookTotalViewDTO } from "./../book/dto/book.dto";
import { Inject, Service } from "typedi";
import Books from "../book/model/book.model";
import { Errors } from "../../helper/error";
import mongoose from "mongoose";
import User from "../user/model/user.model";
import Histories from "../history/model/history.mode";
import { ViewService } from "../view/view.service";
import { ReviewService } from "../reivew/review.service";
import { UserResponseDTO } from "../user/dto/user.dto";

@Service()
export class StatisticsService {
  constructor(
    @Inject() private viewService: ViewService,
    @Inject() private reviewService: ReviewService
  ) {}

  async getTop10HighestViewsBooks(params: any) {
    const { startDate, endDate, majorsId, limit } = params;
    if (!startDate || !endDate) {
      throw Errors.badRequest;
    }
    const matchStage: any = {};
    if (majorsId) {
      matchStage.majors = new mongoose.Types.ObjectId(majorsId);
    }

    const result = await Books.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "views",
          let: { bookId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$book", "$$bookId"] },
                    {
                      $gte: ["$viewDate", new Date(startDate)],
                    },
                    {
                      $lte: ["$viewDate", new Date(endDate)],
                    },
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                totalViews: { $sum: "$count" },
              },
            },
          ],
          as: "views",
        },
      },
      {
        $unwind: {
          path: "$views",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          totalViews: { $ifNull: ["$views.totalViews", 0] },
        },
      },
      {
        $lookup: {
          from: "majors",
          localField: "majors",
          foreignField: "_id",
          as: "majorInfo",
        },
      },
      {
        $unwind: {
          path: "$majorInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { totalViews: -1 },
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          _id: 1,
          title: 1,
          totalViews: 1,
          author: 1,
          pageNumber: 1,
          majors: "$majorInfo.name",
          createdAt: 1,
        },
      },
    ]);
    const resResult = result;
    return resResult;
  }

  async getTopHighestRatingsBooks(params: any) {
    const { startDate, endDate, majorsId, limit } = params;
    if (!startDate || !endDate) {
      throw Errors.badRequest;
    }
    const matchStage: any = {};
    if (majorsId) {
      matchStage.majors = new mongoose.Types.ObjectId(majorsId);
    }

    const result = await Books.aggregate([
      {
        $match: matchStage,
      },
      {
        $lookup: {
          from: "reviews", // Tên collection reviews
          let: { bookId: "$_id" }, // Truyền giá trị _id của sách vào biến bookId
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$book", "$$bookId"] }, // So sánh bookId với _id của sách
                    { $gte: [{ $toDate: "$createdAt" }, new Date(startDate)] }, // Lọc theo startDate
                    { $lte: [{ $toDate: "$createdAt" }, new Date(endDate)] }, // Lọc theo endDate
                  ],
                },
              },
            },
            {
              $group: {
                _id: null, // Gộp các bản ghi review của sách đó lại
                avgRating: { $avg: "$rating" }, // Tính trung bình rating
                reviewCount: { $sum: 1 }, // Đếm số lượng review
              },
            },
            {
              $match: {
                reviewCount: { $gte: 0 }, // Chỉ lấy các sách có từ 2 review trở lên
              },
            },
          ],
          as: "ratings",
        },
      },
      {
        $unwind: {
          path: "$ratings",
          preserveNullAndEmptyArrays: true, // Giữ lại các sách không có bản ghi review (cho phép giá trị null)
        },
      },
      {
        $addFields: {
          avgRating: { $ifNull: ["$ratings.avgRating", 0] }, // Gán avgRating là 0 nếu không có bản ghi reviews nào
        },
      },
      {
        $lookup: {
          from: "majors",
          localField: "majors",
          foreignField: "_id",
          as: "majorInfo",
        },
      },
      {
        $unwind: {
          path: "$majorInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { avgRating: -1 }, // Sắp xếp theo rating trung bình giảm dần
      },
      {
        $limit: parseInt(limit),
      },
      {
        $project: {
          _id: 1,
          title: 1,
          avgRating: 1,
          author: 1,
          pageNumber: 1,
          majors: "$majorInfo.name",
          createdAt: 1,
        },
      },
    ]);

    const resResult = result;
    return resResult;
  }

  async getNumOfNewUser(params: any) {
    const { startDate, endDate } = params;
    if (!startDate || !endDate) {
      throw Errors.badRequest;
    }
    const result = await User.aggregate([
      {
        // Chọn các tài liệu bạn muốn, có thể thêm điều kiện nếu cần
        $match: {
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        // Nhóm theo ngày
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }, // Format theo ngày
          },
          userCount: { $sum: 1 }, // Đếm số lượng user mỗi ngày
        },
      },
      {
        // Chuyển đổi kết quả về định dạng mong muốn
        $project: {
          title: "$_id", // Đặt trường title là ngày
          userCount: 1, // Giữ lại trường userCount
          _id: 0, // Không trả về _id
        },
      },
      {
        // Sắp xếp kết quả theo ngày (tăng dần)
        $sort: { title: 1 },
      },
    ]);
    return result;
  }

  statisticsViewsReviews = async (
    fromDateStr: string,
    toDateStr: string,
    majorsId?: string
  ) => {
    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);
    const listViews = await this.viewService.countViewByDate(
      fromDate,
      toDate,
      majorsId
    );
    const listReviews = await this.reviewService.countReviewByDate(
      fromDate,
      toDate,
      majorsId
    );
    const totalViews = await this.viewService.totalViewsByDate(
      fromDate,
      toDate,
      majorsId
    );
    const totalReviews = await this.reviewService.totalReviewByDate(
      fromDate,
      toDate,
      majorsId
    );

    return { listViews, listReviews, totalViews, totalReviews };
  };

  statisticsUser = async (
    fromDateStr: string,
    toDateStr: string,
    majorsId?: string
  ) => {
    const fromDate = new Date(fromDateStr);
    const toDate = new Date(toDateStr);
    const pipeline: any[] = [
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
          ...(majorsId ? { majors: new mongoose.Types.ObjectId(majorsId) } : {}),
        },
      },
      {
        $lookup: {
          from: "majors", // Name of the Majors collection
          localField: "majors",
          foreignField: "_id",
          as: "majorsInfo",
        },
      },
      // Unwind to flatten the array returned from the lookup
      {
        $unwind: {
          path: "$majorsInfo",
          preserveNullAndEmptyArrays: true, // To handle cases where majorsInfo might be empty
        },
      },
      {
        $facet: {
          userList: [
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
                createdAt: 1,
                gender: 1,
                majors: "$majorsInfo.name",
                image: 1,
                code: 1,
                dob: 1,
                status: 1,
              },
            },
          ],
          countFemale: [
            { $match: { gender: "Female" } },
            { $count: "countFemale" },
          ],
          countMale: [
            { $match: { gender: "Male" } },
            { $count: "countMale" },
          ],
        },
      },
      {
        $project: {
          userList: 1,
          countFemale: { $arrayElemAt: ["$countFemale.countFemale", 0] },
          countMale: { $arrayElemAt: ["$countMale.countMale", 0] },
        },
      },
    ];

    const [result] = await User.aggregate(pipeline);
    console.log(result.userList[0]);

    return {
      userList: result.userList,
      countFemale: result.countFemale || 0,
      countMale: result.countMale || 0,
    };
  };
}
