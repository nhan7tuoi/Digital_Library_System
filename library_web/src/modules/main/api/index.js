import axiosInstance from "../../../axios/axiosConfig";

export const getHistories = async () => {
  const url = "/histories";
  return await axiosInstance.get(url);
};

export const getRecommendedBooksByPreference = async () => {};
export const getGenres = async () => {
  const url = "/genres";
  return await axiosInstance.get(url);
};

export const _getBookByMajorsUser = async (page, limit) => {
  const url = "/book/get-by-majors-user";
  return axiosInstance.get(url, {
    params: {
      limit: limit || 10,
      page: page || 1,
    },
  });
};

export const _getBooksTopRated = async (page, limit) => {
  const url = "/book/get-top-rated";
  return axiosInstance.get(url, {
    params: {
      limit: limit || 10,
      page: page || 1,
    },
  });
};

export const _getBooksTopViewed = async (page, limit) => {
  const url = "/book/get-top-viewed";
  return axiosInstance.get(url, {
    params: {
      limit: limit || 10,
      page: page || 1,
    },
  });
};

export const _getRecommendBooks = async () => {
  const url = "/book/recommend-books";
  return await axiosInstance.get(url);
};

export const _findBooks = async (keyword, page, limit) => {
  const url = "/books/find-books";
  return await axiosInstance.post(url, {
    keyword: keyword,
    params: { page: page, limit: limit },
  });
};

export const _deleteHistory = async (historyId) => {
  const url = `/histories/${historyId}`;
  return await axiosInstance.delete(url);
};
