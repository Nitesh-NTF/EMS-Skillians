import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { me } from "../service/apis/authentication"

export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await me()
            console.log("response: ",response)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch user')
        }
    }
)

const initialState = {
    user: null,
    isLogged: false,
    loading: true
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            console.log('action.payload', action.payload)
            state.user = action.payload
            state.isLogged = true
            // state.loading = false
        },
        logout: (state) => {
            state.user = null
            state.isLogged = false
            // state.loading = false
        },
        setClockedStatus: (state, action) => {
            if (state.user) {
                state.user.isClockIn = action.payload
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload
                state.isLogged = true
                state.loading = false
            })
            .addCase(fetchUser.rejected, (state) => {
                state.user = null
                state.isLogged = false
                state.loading = false
            })
    }
})

export const { login, logout, setClockedStatus } = authSlice.actions
export default authSlice.reducer