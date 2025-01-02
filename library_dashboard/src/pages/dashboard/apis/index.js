import { api } from "../../../apis/config";

export const _getStatisticsDashBoard = async (data) => {
    const url ="/get-statistics-dashboard";
    return await api.get(url,{
        params: {
            fromDate:data.fromDate,
            toDate:data.toDate,
            majorsId:data?.majorsId
        }
    });
}

export const _getStatisticsDashBoardUser = async (data) => {
    const url ="/get-statistics-user";
    return await api.get(url,{
        params: {
            fromDate:data.fromDate,
            toDate:data.toDate,
            majorsId:data?.majorsId
        }
    });
}