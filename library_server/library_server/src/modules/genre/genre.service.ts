import { Service } from "typedi";
import Genres from "./model/genre.model";
import { GenreResponeDTO } from "./dto/genre.dto";

@Service()
export class GenreService {
  async getListGenres() {
    return GenreResponeDTO.transformGenre(await Genres.find());
  }

  async createGenre(params: any) {
    const { name } = params;
    const genres = await Genres.create({
      name,
    });
    return genres;
  }

  async getGenresByKeyword(keyword: string) {
    return await Genres.find(
      { name: { $regex: keyword, $options: "i" } },
      { _id: 1 }
    );
  }
}
