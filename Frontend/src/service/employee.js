import { API } from "./api"

export const addEmployee = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
    });

    // for (let [key, value] of formData.entries()) {
    //     console.log(key, value)
    // }

    return API.post("/api/employee", formData).then(res => res.data)
}

export const updateEmployee = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
    });

    // for (let [key, value] of formData.entries()) {
    //     console.log(key, value)
    // }

    return API.put(`/api/employee/${data._id}`, formData).then(res => res.data)
}

export const getEmployee = async (id) => {
    return API.get(`/api/employee/${id}`).then(res => res.data)
}

export const deleteEmployee = async (id) => {
    return API.delete(`/api/employee/${id}`).then(res => res.data)
}

export const fetchEmployees = async (query = {}) => {
    const defaults = { role: "Employee", search: "", department: "" }
    const params = { ...defaults, ...query }

    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
            urlParams.append(key, value)
        }
    })
    return API.get(`/api/employee?${urlParams.toString()}`).then(res => res.data)
} 