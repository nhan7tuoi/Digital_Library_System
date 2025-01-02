import { Inject, Service } from "typedi";
import Books from "./model/book.model";
import mongoose, { FilterQuery } from "mongoose";
import { Errors } from "../../helper/error";
import { BookStatus } from "./types/book.type";
import User from "../user/model/user.model";
import {
  BookCreateReqDTO,
  BookDetailsResponseDTO,
  BookResponseDTO,
  BookUpdateReqDTO,
} from "./dto/book.dto";
import axios from "axios";
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { PDFDocument } from "pdf-lib";
import pdf from "pdf-parse";
import { openai } from "../../helper";
import Chapter from "../chapter/model/chapter.model";
import { Pagination } from "../../helper/pagination";
import { ViewService } from "../view/view.service";
import { ReviewService } from "../reivew/review.service";
import { GenreService } from "../genre/genre.service";
import { MajorsService } from "../majors/majors.service";

import * as pdfjs from "pdfjs-dist";

@Service()
export class BookService {
  constructor(
    @Inject() private viewService: ViewService,
    @Inject() private reviewService: ReviewService,
    @Inject() private genreService: GenreService,
    @Inject() private majorsService: MajorsService
  ) {}

  async getPublishedBook(bookId: string) {
    return await Books.findOne({
      _id: new mongoose.Types.ObjectId(bookId),
      status: BookStatus.Published,
    }).populate("genre").populate("majors");
  }
  async checkPublishedBook(bookId: string) {
    const book = await this.getPublishedBook(bookId);
    if (!book) throw Errors.bookNotExits;
    return book;
  }

  async getBookContentByPage(params: any) {
    const { bookId, page } = params;
    const book = await this.checkPublishedBook(bookId);
    const content = book.contents.find((content) => content.page === page);
    if (!content) throw Errors.notFound;
    return { content, pages: book.contents.length };
  }

  async getAllBook() {
    return Books.find({ status: BookStatus.Published });
  }

  async getBookByMajorsUserId(userId: string, pagination: Pagination) {
    const { limit, getOffset } = pagination;
    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });

    const matchStage = { majors: user.majors, status: BookStatus.Published };

    const [books, total] = await Promise.all([
      Books.find(matchStage)
        .limit(limit)
        .skip(getOffset())
        .populate("genre")
        .populate("majors"),
      Books.countDocuments(matchStage),
    ]);

    const transformedBooks = BookResponseDTO.transformBook(books);
    pagination.total = total;
    return { books: transformedBooks, pagination };
  }

  async getTopRatedBooks() {
    const topRatedBooks = await Books.aggregate([
      {
        $match: { status: BookStatus.Published },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "book",
          as: "reviews",
        },
      },
      {
        $unwind: {
          path: "$reviews",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "genres",
          localField: "genre",
          foreignField: "_id",
          as: "genreInfo", // Tạo một mảng chứa thông tin về genre
        },
      },
      {
        $lookup: {
          from: "majors",
          localField: "major", // Giả định rằng bạn có trường `major` trong sách
          foreignField: "_id",
          as: "majorInfo", // Tạo một mảng chứa thông tin về major
        },
      },
      {
        $unwind: {
          path: "$genreInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$majorInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          author: { $first: "$author" },
          pdfLink: { $first: "$pdfLink" },
          genre: { $first: "$genreInfo" }, // Lấy thông tin từ genreInfo
          major: { $first: "$majorInfo" }, // Lấy thông tin từ majorInfo
          image: { $first: "$image" },
          pageNumber: { $first: "$pageNumber" },
          summary: { $first: "$summary" },
          averageRating: { $avg: "$reviews.rating" },
        },
      },
      {
        $sort: { averageRating: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    return BookResponseDTO.transformBook(topRatedBooks);
  }

  async getTopViewedBooks() {
    const topViewedBooks = await Books.aggregate([
      {
        $lookup: {
          from: "views",
          localField: "_id",
          foreignField: "book",
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
        $lookup: {
          from: "genres",
          localField: "genre",
          foreignField: "_id",
          as: "genreInfo", // Thêm thông tin genre
        },
      },
      {
        $lookup: {
          from: "majors",
          localField: "major", // Giả định rằng bạn có trường `major` trong sách
          foreignField: "_id",
          as: "majorInfo", // Thêm thông tin major
        },
      },
      {
        $unwind: {
          path: "$genreInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$majorInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          title: { $first: "$title" },
          author: { $first: "$author" },
          pdfLink: { $first: "$pdfLink" },
          image: { $first: "$image" },
          pageNumber: { $first: "$pageNumber" },
          summary: { $first: "$summary" },
          totalViews: { $sum: { $ifNull: ["$views.count", 0] } },
          genre: { $first: "$genreInfo" }, // Lấy thông tin từ genreInfo
          major: { $first: "$majorInfo" }, // Lấy thông tin từ majorInfo
        },
      },
      {
        $sort: { totalViews: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    return BookResponseDTO.transformBook(topViewedBooks);
  }

  async getRecommendBooks(userId: string, pagination: Pagination) {
    const { limit, getOffset } = pagination;
    const response = await axios.get(
      `http://flask:3001/api/v1/recommend/recommend_books_rating/${userId}`
    );
    const books = response.data;
    pagination.total = books.length;
    const paginatedBooks = books.slice(getOffset(), getOffset() + limit);
    return { books: BookResponseDTO.transformBook(paginatedBooks), pagination };
  }

  getPageNumber = async (filePath: string) => {
    try {
      const loadingTask = pdfjs.getDocument(filePath);
      const pdfDocument = await loadingTask.promise;
      return pdfDocument.numPages;
    } catch (err) {
      console.log(err);
    }
  };
  getPdfOutline = async (filePath: string) => {
    const loadingTask = pdfjs.getDocument(filePath);
    const pdfDocument = await loadingTask.promise;
    const outline = await pdfDocument.getOutline();
    const list = [];
    if (!outline) {
      console.log("Không tìm thấy mục lục trong tệp PDF này.");
      return list;
    }

    for (let i = 0; i < outline.length; i++) {
      const title = outline[i].title;
      let startPageNumber = null;
      let endPageNumber = null;
      // console.log(title);

      if (outline[i].dest) {
        const pageIndex = await pdfDocument.getPageIndex(outline[i].dest[0]);
        startPageNumber = pageIndex + 1;
        endPageNumber = outline[i + 1]
          ? (await pdfDocument.getPageIndex(outline[i + 1].dest[0])) - 1
          : pdfDocument.numPages - 1;
        // console.log(pageNumber);
      }

      console.log(
        `Title: ${title}, startPage: ${startPageNumber},end:${endPageNumber}`
      );
      list.push({ title: title, startPage: startPageNumber, endPageNumber });
    }
    return list;
  };

  processPdfPages = async (pathFile: string) => {
    try {
      const response = await axios.get(pathFile, {
        responseType: "arraybuffer",
      });
      const data = await pdf(response.data.buffer);

      const textByPage = data.text.split(/\f|\n\n/);

      const contents = textByPage.map((content, index) => ({
        page: index + 1,
        content: content.trim(),
      }));

      return contents;
    } catch (error) {
      console.error("Error processing PDF:", error);
      return [];
    }
  };

  //api
  getSummaryByBookId = async (bookId: string) => {
    const book = await Books.findOne({
      _id: new mongoose.Types.ObjectId(bookId),
      status: BookStatus.Published,
    });
    return book.summary;
  };

  generateSummaryByOpenAI = async (title: string, tableOfContents: any) => {
    const outline = tableOfContents
      .map((chapter: any, index: number) => `${index + 1}. ${chapter.title}`)
      .join("\n");
    const prompt = `
  Hãy đóng vai là một nhà tóm tắt sách hãy 20 đến 30 câu về nội dung của quyển sách
  Tóm tắt quyển sách "${title}" 
  dựa trên mục lục sau:\n${outline}\n
  `;
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          {
            role: "user",
            content: prompt,
          },
        ],
      });
      return completion.choices[0].message.content;
    } catch (error) {
      console.error(error);
    }
  };

  addBook = async (params: BookCreateReqDTO) => {
    const { author, genre, image, majors, pdfLink, publisher, title, yob } =
      params;

    const pageNumber = await this.getPageNumber(pdfLink);
    let contents = await this.processPdfPages(pdfLink);

    const newBook = new Books({
      title: title,
      author: author,
      pdfLink: pdfLink,
      genre: new mongoose.Types.ObjectId(genre),
      image: image,
      pageNumber: pageNumber,
      majors: new mongoose.Types.ObjectId(majors),
      contents: contents,
      publisher: publisher,
      yob: yob,
    });

    await newBook.save();
    const outline = await this.getPdfOutline(pdfLink);

    let tableOfContent = [];

    if (outline.length > 1) {
      for (let i = 0; i < outline.length; i++) {
        const newChapter = new Chapter({
          book: newBook._id,
          title: outline[i].title,
          startPage: outline[i].startPage ? outline[i].startPage : 0,
          endPage: outline[i].endPageNumber,
        });
        tableOfContent.push(newChapter);
        await newChapter.save();
      }
      const summary = await this.generateSummaryByOpenAI(
        newBook.title,
        tableOfContent
      );
      newBook.summary = summary;
      await newBook.save();
    } else {
      return { book: newBook, chapter: false };
    }
    console.log("Thêm thành công", newBook.title);
    return {book: newBook, chapter: true};
  };

  createSummary = async (params: any) => {
    const { bookId, title } = params;
    console.log(bookId + " " + title);
    const chapters = await Chapter.find({ book: bookId });
    const summary = await this.generateSummaryByOpenAI(title, chapters);
    const book = await Books.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(bookId) },
      {
        $set: { summary: summary },
      },
      { new: true }
    );
    return true;
  };

  getBookDetails = async (bookId: string) => {
    const book = BookResponseDTO.transformBook(
      await this.checkPublishedBook(bookId)
    );

    const totalView = await this.viewService.getTotalView(bookId);
    const avgRating = await this.reviewService.getAvgRating(bookId);
    const bookDetails = book as BookResponseDTO & {
      totalView: number;
      avgRating: number;
    };
    bookDetails.totalView = totalView;
    bookDetails.avgRating = avgRating;
    return bookDetails;
  };

  findBooksByKeyword = async (keyword: string, pagination: Pagination) => {
    console.log(keyword);
    const { getOffset, limit } = pagination;
    const matchStage: FilterQuery<any> = {
      status: BookStatus.Published,
    };
    if (keyword) {
      const genres = await this.genreService.getGenresByKeyword(keyword);
      const majors = await this.majorsService.getMajorsByKeyword(keyword);
      const genreIds = genres.map((genre: any) => genre._id);
      const majorIds = majors.map((major: any) => major._id);
      matchStage.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { author: { $regex: keyword, $options: "i" } },
        { publisher: { $regex: keyword, $options: "i" } },
        { genre: { $in: genreIds } },
        { majors: { $in: majorIds } },
      ];
    }
    const [books, total] = await Promise.all([
      Books.find(matchStage)
        .skip(getOffset())
        .limit(limit)
        .populate("genre")
        .populate("majors"),
      Books.countDocuments(matchStage),
    ]);
    pagination.total = total;
    const transformedList = BookResponseDTO.transformBook(books);
    return { books: transformedList, pagination };
  };

  deleteBook = async (bookId: string) => {
    console.log(bookId);
    const book = await this.checkPublishedBook(bookId);
    book.status = BookStatus.Deleted;
    await book.save();
    return true;
  };

  updateBook = async (params: BookUpdateReqDTO) => {
    const { bookId, author, genre, majors, image, publisher, yob } =
      params;
    const book = await this.checkPublishedBook(bookId);
    const fieldsToUpdate = {
      author,
      genre: genre ? new mongoose.Types.ObjectId(genre) : null,
      majors: majors ? new mongoose.Types.ObjectId(majors) : null,
      image,
      publisher,
      yob,
    };

    for (const field in fieldsToUpdate) {
      if (fieldsToUpdate[field]) {
        book[field] = fieldsToUpdate[field];
      }
    }
    await book.save();
    return true;
  };

  getBooksByGenre = async (genreId: string, pagination: Pagination) => {
    const { limit, getOffset } = pagination;
    const matchStage = {
      genre: new mongoose.Types.ObjectId(genreId),
      status: BookStatus.Published,
    };
    const [books, total] = await Promise.all([
      Books.find(matchStage)
        .limit(limit)
        .skip(getOffset())
        .populate("genre")
        .populate("majors"),
      Books.countDocuments(matchStage),
    ]);

    const transformedBooks = BookResponseDTO.transformBook(books);
    pagination.total = total;
    return { books: transformedBooks, pagination };
  };
}
