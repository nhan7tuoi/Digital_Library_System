import { api } from '../../../apis/configAPI';

//book

export const _getBooksMajors = async (page?: number, limit?: number) => {
    const url = '/book/get-by-majors-user';
    return api.get(url, {
        params: {
            limit: limit || 10,
            page: page || 1,
        },
    });
};

export const _getBooksTopRated = async (page?: number, limit?: number) => {
    const url = '/book/get-top-rated';
    return api.get(url, {
        params: {
            limit: limit || 8,
            page: page || 1,
        },
    });
};

export const _getBooksTopViewed = async (page?: number, limit?: number) => {
    const url = '/book/get-top-viewed';
    return api.get(url, {
        params: {
            limit: limit || 8,
            page: page || 1,
        },
    });
};

export const _getRecommendBooks = async (page?: number, limit?: number) => {
    const url = '/book/recommend-books';
    return api.get(url, {
        params: {
            limit: limit || 8,
            page: page || 1,
        },
    });
};

export const _getBookDetail = async (bookId: string) => {
    const url = '/books/book-details';
    return api.get(url, {
        params: {
            bookId: bookId,
        },
    });
};

export const _findBooks = async (
    keyword: string,
    page?: number,
    limit?: number,
) => {
    const url = '/books/find-books';
    return api.post(url, {
        keyword: keyword,
        page: page || 1,
        limit: limit || 5,
    });
};
export type iBookContent = {
    bookId: string,
    page: number,
};
export const _getBookContent = async (data: iBookContent) => {
    const url = '/book/get-content';
    return api.get(url, {
        params: {
            bookId: data.bookId,
            page: data.page,
        },
    });
};

//notification
export const _getNotifications = async () => {
    const url = '/user/notifications';
    return api.get(url);
};

export const _markAsRead = async (id: string) => {
    const url = '/notification/mark-as-read';
    return api.post(url, {
        id,
    });
};
export const _getNotificationById = async (id: string) => {
    const url = '/notification';
    return api.get(url, {
        params: {
            id,
        },
    });
};

//review
export const _getNewReview = (bookId: string) => {
    const url = '/review-newest';
    return api.get(url, {
        params: {
            bookId,
        },
    });
};

export const _getReviews = (bookId: string) => {
    const url = '/reviews';
    return api.get(url, {
        params: {
            bookId,
        },
    });
};
export type iCreateReview = {
    bookId: string,
    content: string,
    rating: number,
};
export const _createReview = (data: iCreateReview) => {
    const url = '/review';
    return api.post(url, data);
};

//chapter
export const _getChapters = (bookId: string) => {
    const url = '/book/chapters';
    return api.get(url, {
        params: {
            bookId,
        },
    });
};

//history
export const _getHistories = (bookId: string) => {
    const url = '/history';
    return api.get(url, {
        params: {
            bookId,
        },
    });
};

//note

export const _getNotes = (bookId: string) => {
    const url = '/notes';
    return api.get(url, {
        params: {
            bookId,
        },
    });
};

export type iCreateNote = {
    bookId: string,
    content: string,
    page: number,
};

export const _createNote = (data: iCreateNote) => {
    const url = '/note';
    return api.post(url, data);
};

export type iUpdateNote = {
    bookId: string,
    noteId: string,
    content: string,
    page: number,
};

export const _updateNote = (data: iUpdateNote) => {
    const url = '/note';
    return api.put(url, data);
};

export const _deleteNote = (noteId: string) => {
    const url = `/note/${noteId}`;
    return api.delete(url, {
        params: {
            noteId,
        },
    });
};

//view 
export const _createView = async (bookId:string) => {
    const url = "/view/update";
    return await api.post(url, { bookId: bookId });
  };
