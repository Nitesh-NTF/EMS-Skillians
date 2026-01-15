import { API } from "./api"

export const addTimeEntry = async (data) => {
    return API.post("/api/time-entries", data).then(res => res.data)
}

export const updateTimeEntry = async (data) => {
    return API.put(`/api/time-entries/${data._id}`, data).then(res => res.data)
}

export const getTimeEntry = async (id) => {
    return API.get(`/api/time-entries/${id}`).then(res => res.data)
}

export const deleteTimeEntry = async (id) => {
    return API.delete(`/api/time-entries/${id}`).then(res => res.data)
}

export const fetchTimeEntries = async (query = {}) => {
    const defaults = { project: "", employee: "", date: "" }
    const params = { ...defaults, ...query }

    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
            urlParams.append(key, value)
        }
    })
    return API.get(`/api/time-entries?${urlParams.toString()}`).then(res => res.data)
}