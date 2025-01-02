import { IsNumber, IsString } from "class-validator";

export class HistoryCreateDTO {
  @IsString()
  book: string;
  userId: string;
  @IsNumber()
  page: number;
}
