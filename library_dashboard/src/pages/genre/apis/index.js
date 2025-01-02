import { api } from "../../../apis/config"

export const _createGenre = async (name) => {
    const url = "/genre"
    return await api.post(url, { name })
}

export const _deleteGenre = async (id) => {
    const url = `/genre/${id}`
    return await api.delete(url)
}