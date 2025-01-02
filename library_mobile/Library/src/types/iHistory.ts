import { iBook } from './iBook';
import { IChapter } from './iChapter';
import { iUser } from './iUser';

export interface iHistory {
    _id: string;
    user?: iUser;
    book: iBook;
    page: number;
    chapter: IChapter;
    createdAt: Date;
    updatedAt: Date;
}
