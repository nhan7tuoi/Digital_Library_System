import { IsNumber, IsString } from "class-validator";

export class NoteCreateReqDTO {
  @IsString()
  content: string;
  @IsNumber()
  page: number;
  @IsString()
  userId: string;
  @IsString()
  bookId: string;
}
export class NoteUpdateReqDTO {
  @IsString()
  noteId:string;
  @IsString()
  content: string;
  @IsString()
  userId: string;
  @IsString()
  bookId: string;
}