import { API } from "./api"
import { EMPLOYEE_DISPLAY_TYPES } from "../../components/constants/employeeDisplayTypes"

export const addEmployee = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
    });

    return API.post("/api/employee", formData).then(res => res.data)
}

export const updateEmployee = async (data) => {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
    });

    return API.put(`/api/employee/${data._id}`, formData).then(res => res.data)
}

export const getEmployee = async (id, display = EMPLOYEE_DISPLAY_TYPES.DETAIL) => {
    return API.get(`/api/employee/${id}?display=${display}`).then(res => res.data)
}

export const deleteEmployee = async (id) => {
    return API.delete(`/api/employee/${id}`).then(res => res.data)
}

export const fetchEmployees = async (query = {}) => {
    const defaults = { role: "Employee", search: "", department: "", display: EMPLOYEE_DISPLAY_TYPES.LIST }
    const params = { ...defaults, ...query }

    const urlParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
            urlParams.append(key, value)
        }
    })
    return API.get(`/api/employee?${urlParams.toString()}`).then(res => res.data)
}

export const toggleEmployeeStatus = async (id, status, display = EMPLOYEE_DISPLAY_TYPES.LIST) => {
    return API.post(`/api/employee/toggle-status?id=${id}&display=${display}`, { status }).then(res => res.data)
}

export const changePassword = async (id, data) => {
    return API.post(`/api/employee/change-password`, data).then(res => res.data)
} 