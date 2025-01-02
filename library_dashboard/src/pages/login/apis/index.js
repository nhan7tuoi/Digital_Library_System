import { api } from "../../../apis/config";

export const _login = async (data) => {
    const url = '/auth/login';
    return  await api.post(url, data);
}