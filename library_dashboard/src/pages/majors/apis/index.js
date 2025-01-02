import { api } from "../../../apis/config"

export const _createMajors = async (name) => {
    const url = "/majors"
    return await api.post(url, { name })
}