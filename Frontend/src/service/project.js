import { API } from "./api"

export const addProject = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
    });

    // for (let [key, value] of formData.entries()) {
    //     console.log(key,value)
    // }
    return API.post("/api/project", formData).then(res => res.data)
}

export const updateProject = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
    });

    // for (let [key, value] of formData.entries()) {
    //     console.log(key,value)
    // }
    return API.put(`/api/project/${data._id}`, formData).then(res => res.data)
}

export const getProject = async (id) => {
    return API.get(`/api/project/${id}`).then(res => res.data)
}

export const deleteProject = async (id) => {
    return API.delete(`/api/project/${id}`).then(res => res.data)
}

export const fetchProjects = async (query = {}) => {
    const defaults = { search: "", status: "" }
    const params = { ...defaults, ...query }

    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
            urlParams.append(key, value)
        }
    })
    return API.get(`/api/project?${urlParams.toString()}`).then(res => res.data)
}

export const toggleProjectStatus = async (id, status) => {
    return API.post(`/api/project/toggle-status?id=${id}`, { status }).then(res => res.data)
}