import { iBook } from './iBook';
import { iUserReview } from './iUser';

export interface INote {
    _id: string;
    book?: iBook;
    user?: iUserReview;
    content: string;
    page: number;
    createdAt: Date;
    updatedAt: Date;
}
