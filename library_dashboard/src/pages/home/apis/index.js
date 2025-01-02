import {api} from '../../../apis/config';

export const _getTopViews = async (startDate, endDate, genreId) => {
    try {
        const resTopViews = await api.get(
        `/get-highest-views-books?startDate=${startDate}&endDate=${endDate}&genreId=${genreId}`
        );
        return resTopViews;
    } catch (error) {
        console.log(error);
    }
    }

export const _getTopRatings = async (startDate, endDate, genreId) => {
    try {
        const resTopRatings = await api.get(
        `/get-highest-rating-books?startDate=${startDate}&endDate=${endDate}&genreId=${genreId}`
        );
        return resTopRatings;
    } catch (error) {
        console.log(error);
    }
    }

export const _getListNumUsers = async (startDate, endDate) => {
    try {
        const resListNumUsers = await api.get(
        `/get-num-users?startDate=${startDate}&endDate=${endDate}`
        );
        return resListNumUsers;
    } catch (error) {
        console.log(error);
    }
    }

export const _getSummary = async (startDate, endDate, genreId) => {
    try {
        const resSummary = await api.get(
        `/get-summary?startDate=${startDate}&endDate=${endDate}&genreId=${genreId}`
        );
        return resSummary;
    } catch (error) {
        console.log(error);
    }
    }

export const _getGenres = async () => {
    try {
        const resListGenres = await api.get(
        "/genres"
        );
        return resListGenres;
    } catch (error) {
        console.log(error);
    }
    }