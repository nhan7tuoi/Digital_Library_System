import {api, api2} from '../../../apis/config';


const _getGenres = async () => {
    return await api.get('/genres');
};

const _getMajors = async () => {
    return await api.get('/majors');
}

const _createBook = async (data) => {
    const resonpse = await api.post("/books/add-book", data,{
        headers: {
            'Content-Type': 'multipart/form-data',
        }
        });
        return resonpse;
}
const _updateBook = async (data) => {
    const resonpse = await api.post("/books/update-book", data,{
        headers: {
            'Content-Type': 'multipart/form-data',
        }
        });
        return resonpse;
}

const _createChapter = async (data) => {
    return await api.post('/book/chapter', data);
}

const _createSummary = async (data) => {
    return await api.post('/books/create-summary', data);
}

const _getChapters = async (bookId) => {
    const url = "/book/chapters";
    return await api.get(url, {
        params: {
            bookId
        }
    });
}

const _getBook = async (page, limit, keyword) => {
    const url = "/books/find-books";
    return await api.post(url,{
        page,
        limit,
        keyword
    });
}

const _getBookById = async (id) => {
    const url = "/books/book-details"
    return await api.get(url, {
        params: {
            bookId: id
        }
    });
}

const _deleteBook = async (bookId) => {
    const url = `/books/${bookId}`;
    return await api.delete(url);
}

const _getTopView = async (data) => {
    const url = "/get-highest-views-books"
    return await api.get(url,{
        params: {
            startDate: data.startDate,
            endDate: data.endDate,
            limit: data.limit,
            majorsId: data.majorsId
        }
    });
}

const _getTopRating = async (data) => {
    const url = "/get-highest-rating-books";
    return await api.get(url,{
        params: {
            startDate: data.startDate,
            endDate: data.endDate,
            limit: data.limit,
            majorsId: data.majorsId
        }
    });
}

const _deleteChapter = async (chapterId) => {
    const url = `/book/chapters/${chapterId}`;
    return await api.delete(url);
}

export {
    _getGenres,
    _getMajors,
    _createBook,
    _createChapter,
    _createSummary,
    _getChapters,
    _getBook,
    _getBookById,
    _deleteBook ,
    _getTopView,
    _getTopRating,
    _deleteChapter,
    _updateBook
}