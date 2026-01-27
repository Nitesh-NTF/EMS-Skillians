import { API } from "./api"
import { PROJECT_DISPLAY_TYPES } from "../../components/constants/projectDisplayTypes"

export const addProject = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
    });

    return API.post("/api/project", formData).then(res => res.data)
}

export const updateProject = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
    });

    return API.put(`/api/project/${data._id}`, formData).then(res => res.data)
}

export const getProject = async (id, display = PROJECT_DISPLAY_TYPES.DETAIL) => {
    return API.get(`/api/project/${id}?display=${display}`).then(res => res.data)
}

export const deleteProject = async (id) => {
    return API.delete(`/api/project/${id}`).then(res => res.data)
}

export const fetchProjects = async (query = {}) => {
    const defaults = { search: "", status: "", display: PROJECT_DISPLAY_TYPES.LIST }
    const params = { ...defaults, ...query }

    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
            urlParams.append(key, value)
        }
    })
    return API.get(`/api/project?${urlParams.toString()}`).then(res => res.data)
}

export const toggleProjectStatus = async (id, status, display = PROJECT_DISPLAY_TYPES.LIST) => {
    return API.post(`/api/project/toggle-status?id=${id}&display=${display}`, { status }).then(res => res.data)
}