import { Expose, plainToInstance, Transform } from "class-transformer";

export class GenreResponeDTO {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Expose()
  name: string;
  static transformGenre(params: any | any[]) {
    return plainToInstance(GenreResponeDTO, params, {
      excludeExtraneousValues: true,
    });
  }
}
