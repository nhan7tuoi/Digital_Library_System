import { Inject, Service } from "typedi";
import { NoteService } from "./note.service";
import { NextFunction, Request, Response } from "express";
import { ResponseCustom } from "../../helper/response";

@Service()
export class NoteController {
  constructor(@Inject() private noteService: NoteService) {}
  createNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.noteService.createNote(req.body);
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getNotesByBookId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const result = await this.noteService.getNotesByBookId(
        req.body.userId,
        req.query.bookId as string
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  updateNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.noteService.updateNote(req.body);
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  deleteNote = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.noteService.deleteNote(
        req.body.userId,
        req.params.noteId
      );
      res.send(new ResponseCustom(result));
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
