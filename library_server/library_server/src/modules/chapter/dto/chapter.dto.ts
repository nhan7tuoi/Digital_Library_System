import { IsNumber, IsOptional, IsString } from "class-validator";

export class ChapterCreateDTO {
  book: string;
  @IsString()
  title: string;
  @IsNumber()
  startPage: number;
  @IsNumber()

  endPage: number;
}
export class ChapterUpdateDTO {
  chapterId: string;
  @IsString()
  @IsOptional()
  title: string;
  @IsNumber()
  @IsOptional()
  startPage: number;
  @IsNumber()
  @IsOptional()
  endPage: number;
}