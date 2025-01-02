import { iBook } from './iBook';
import { iUserReview } from './iUser';

export interface IReview {
    _id: string;
    book: iBook;
    user: iUserReview;
    content: string;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}
