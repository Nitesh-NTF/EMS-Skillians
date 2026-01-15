import { createSlice } from "@reduxjs/toolkit"
import { getValidAuthFromStorage } from "../utils/getLoggedAuth"

const loggedUser = getValidAuthFromStorage()

const initialState = {
    user: loggedUser,
    isLogged: loggedUser ? true : false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload
            state.isLogged = true
            localStorage.setItem("auth", JSON.stringify(action.payload))
        },
        logout: (state) => {
            state.user = null
            state.isLogged = false
            localStorage.removeItem("auth")
        }
    }
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer