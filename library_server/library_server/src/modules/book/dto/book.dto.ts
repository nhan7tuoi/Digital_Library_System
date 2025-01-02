import {
  Exclude,
  Expose,
  plainToInstance,
  Transform,
  Type,
} from "class-transformer";
import { IsOptional, IsString, Matches } from "class-validator";

export class BookTotalViewDTO {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Expose()
  title: string;
  @Exclude()
  author: string;
  @Exclude()
  pdfLink: string;
  @Exclude()
  genre: string;
  @Exclude()
  image: string;
  @Exclude()
  pageNumber: number;
  @Exclude()
  majors: string;
  @Exclude()
  summary: string;
  @Expose()
  totalViews: number;

  static transformBook(params: any | any[]) {
    return plainToInstance(BookTotalViewDTO, params, {
      excludeExtraneousValues: true,
    });
  }
}

export class BookAvgRatingDTO {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Expose()
  title: string;
  @Expose()
  avgRating: number;

  static transformBook(params: any | any[]) {
    return plainToInstance(BookAvgRatingDTO, params, {
      excludeExtraneousValues: true,
    });
  }
}
class Content {
  page: number;
  content: string;

  constructor(page: number, content: string) {
    this.page = page;
    this.content = content;
  }
}
export class BookResponseDTO {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Expose()
  title: string;
  @Expose()
  author: string;
  @Expose()
  pdfLink: string;
  @Expose()
  @Transform(({ obj }) => obj.genre?.name || null)
  genre: string;
  @Expose()
  image: string;
  @Expose()
  pageNumber: number;
  @Expose()
  @Transform(({ obj }) => obj.majors?.name || null)
  majors: string | null;
  @Type(() => Content)
  contents: Content[];
  @Expose()
  summary: string;
  @Expose()
  yob: string;
  @Expose()
  publisher: string;

  static transformBook(params: any | any[]) {
    return plainToInstance(BookResponseDTO, params, {
      excludeExtraneousValues: true,
    });
  }
}

export class BookCreateReqDTO {
  @IsString()
  title: string;
  @IsString()
  author: string;
  @IsString()
  genre: string;
  @IsString()
  majors: string;
  @IsString()
  @IsOptional()
  image: string;
  @IsString()
  @IsOptional()
  pdfLink: string;
  @IsString()
  publisher: string;
  @IsString()
  @Matches(/^[1-2]\d{3}$/, {
    message: "Năm gồm 4 chữ số từ 1xxx đền 2xxx",
  })
  yob: string;
}

export class BookDetailsResponseDTO {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Expose()
  title: string;
  @Expose()
  author: string;
  @Expose()
  pdfLink: string;
  @Expose()
  @Transform(({ obj }) => obj.genre?.name || null)
  genre: string;
  @Expose()
  image: string;
  @Expose()
  pageNumber: number;
  @Expose()
  @Transform(({ obj }) => obj.majors?.name || null)
  majors: string | null;
  @Type(() => Content)
  contents: Content[];
  @Expose()
  summary: string;
  @Expose()
  yob: string;
  @Expose()
  publisher: string;
  @Expose()
  totalView: number;
  @Expose()
  avgRating: number;
  static transformBook(params: any | any[]) {
    return plainToInstance(BookDetailsResponseDTO, params, {
      excludeExtraneousValues: true,
    });
  }
}

export class BookUpdateReqDTO {
  @IsString()
  bookId:string;
  @IsString()
  @IsOptional()
  author: string;
  @IsString()
  @IsOptional()
  image: string;
  @IsString()
  @IsOptional()
  genre: string;
  @IsString()
  @IsOptional()
  majors: string;
  @IsString()
  @IsOptional()
  publisher: string;
  @IsString()
  @IsOptional()
  yob: string;
}