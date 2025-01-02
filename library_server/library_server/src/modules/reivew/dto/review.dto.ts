import { IsNumber, IsString } from "class-validator";

export class ReviewCreateReqDTO {
  @IsString()
  userId: string;
  @IsString()
  bookId: string;
  @IsString()
  content: string;
  @IsNumber()
  rating: number;
}
