import { Inject, Service } from "typedi";
import { ChapterService } from "./chapter.service";
import { NextFunction, Request, Response } from "express";
import { ResponseCustom } from "../../helper/response";

@Service()
export class ChapterController {
  constructor(@Inject() private chapterService: ChapterService) {}

  _getChapters = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.chapterService.getChapters(req.query.bookId as string);
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  _addChapter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.chapterService.addChapter(req.body);
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  _deleteChapter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.chapterService.deleteChapter(req.params.chapterId);
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };
}
