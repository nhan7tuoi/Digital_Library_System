import { Inject, Service } from "typedi";
import Chapter from "./model/chapter.model";
import mongoose from "mongoose";
import { BookService } from "../book/book.service";
import { Errors } from "../../helper/error";
import { ChapterCreateDTO, ChapterUpdateDTO } from "./dto/chapter.dto";

@Service()
export class ChapterService {
  constructor(@Inject() private bookService: BookService) {}
  async getChapters(bookId: string) {
    await this.bookService.checkPublishedBook(bookId);
    return await Chapter.find({ book: new mongoose.Types.ObjectId(bookId) });
  }

  async getChapterById(chapterId: string) {
    return await Chapter.findOne({
      _id: new mongoose.Types.ObjectId(chapterId),
    });
  }

  async checkExistedChapter(chapterId: string) {
    const chapter = await this.getChapterById(chapterId);
    if (!chapter) throw Errors.ChapterNotExits;
    const bookId = chapter.book.toString();
    await this.bookService.checkPublishedBook(bookId);
    return chapter;
  }

  async addChapter(params: ChapterCreateDTO) {
    const { book, title, startPage, endPage } = params;
    console.log("aaa",book);
    await this.bookService.checkPublishedBook(book);
    const chapter = new Chapter({
      book: new mongoose.Types.ObjectId(book),
      title,
      startPage,
      endPage,
    });
    await chapter.save();
    return chapter;
  }

  async deleteChapter(chapterId: string) {
    const chapter = await this.checkExistedChapter(chapterId);
    await Chapter.deleteOne({ _id: chapter._id });
    return true;
  }

  async updateChapter(params: ChapterUpdateDTO) {
    const { chapterId, endPage, startPage, title } = params;
    const chapter = await this.checkExistedChapter(chapterId);
    if (title) chapter.title = title;
    if (startPage) chapter.startPage = startPage;
    if (endPage) chapter.endPage = endPage;
    await chapter.save();
  }
}
