import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    user: {},
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser:(state,action)=>{
            state.isAuthenticated = true;
            state.user=action.payload
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user=""
        },
        clearErrors: (state) => {
            state.error = null;
        },
    }
})

export const {
    login,
    logout,
    addUser,
    clearErrors
}=userSlice.actions

export default userSlice.reducer