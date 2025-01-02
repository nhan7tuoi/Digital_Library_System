import { Router } from "express";
import Container from "typedi";
import { GenreController } from "./genre.controller";

const genreRouter = Router();
const genreController = Container.get(GenreController);

genreRouter.get("/genres", genreController._getListGenres);
genreRouter.post("/genre", genreController._createGenre);

export default genreRouter;
