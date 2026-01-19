import { API } from "./api";

export const login = async (data) => {
    return await API.post("/login", data).then(res => res.data)
}

export const logout = async () => {
    return await API.post("/logout").then(res => res.data)
}

export const forgotPassword = async (data) => {
    return await API.post("/forget-password", data).then(res => res.data)
}

export const resetPassword = async (data) => {
    return await API.post("/reset-password", data).then(res => res.data)
}

