import { IsString } from "class-validator";


export class NotificationCreateDTO {
    @IsString()
    title: string;
    @IsString()
    content: string;
    @IsString()
    filterCondition: string;
    @IsString()
    data: string;
    @IsString()
    image: string;
    @IsString()
    status: string;
}