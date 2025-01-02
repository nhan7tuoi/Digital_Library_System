import { Inject, Service } from "typedi";
import { GenreService } from "./genre.service";
import { NextFunction, Request, Response } from "express";
import { ResponseCustom } from "../../helper/response";

@Service()
export class GenreController {
  constructor(@Inject() private genreService: GenreService) {}

  _getListGenres = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.genreService.getListGenres();
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  };

  _createGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.genreService.createGenre(req.body);
      res.send(new ResponseCustom(result));
    } catch (error) {
      next(error);
    }
  }
}
