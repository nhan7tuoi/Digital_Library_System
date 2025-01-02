import axiosInstance from "../../../axios/axiosConfig";

export const _getBookContentBypage = async (id, page) => {
  const url = "/book/get-content";
  return axiosInstance.get(url, {
    params: {
      bookId: id,
      page,
    },
  });
};

export const _getChapterByIdBook = async (id) => {
  const url = "/book/chapters";
  return await axiosInstance.get(url, {
    params: {
      bookId: id,
    },
  });
};

export const _getBookDetails = async (bookId) => {
  const url = "/books/book-details";
  return await axiosInstance.get(url, { params: { bookId: bookId } });
};

export const _getReviewsNewest = async (bookId) => {
  const url = "/review-newest";
  return await axiosInstance.get(url, { params: { bookId: bookId } });
};

export const _getAllReviews = async (bookId) => {
  const url = "/reviews";
  return await axiosInstance.get(url, { params: { bookId: bookId } });
};

export const _createReview = async (review) => {
  const url = "/review";
  return await axiosInstance.post(url, review);
};

export const _getHistory = async (bookId) => {
  const url = `/histories/${bookId}`;
  return await axiosInstance.get(url);
};

export const _createHistory = async (history) => {
  const url = "/history";
  return await axiosInstance.post(url, history);
};

export const _getNotes = async (bookId) => {
  const url = "/notes";
  return await axiosInstance.get(url, { params: { bookId: bookId } });
};

export const _createNote = async (note) => {
  const url = "/note";
  return await axiosInstance.post(url, note);
};

export const _updateNote = async (note) => {
  const url = "/note";
  return await axiosInstance.put(url, note);
};

export const _deleteNote = async (noteId) => {
  const url = `/note/${noteId}`;
  return await axiosInstance.delete(url);
};

export const _createView = async (bookId) => {
  const url = "/view/update";
  return await axiosInstance.post(url, { bookId: bookId });
};

export const _getBooksByGenre = async (genreId, page, limit) => {
  const url = "/books/get-by-genre";
  return await axiosInstance.get(url, {
    params: { genreId: genreId, page: page, limit: limit },
  });
};
