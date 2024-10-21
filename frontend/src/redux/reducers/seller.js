import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    seller: {},
}

export const sellerSlice = createSlice({
    name: "seller",
    initialState,
    reducers: {
        addSeller:(state,action)=>{
            state.isAuthenticated = true;
            state.seller=action.payload
        },
        sellerLogout: (state) => {
            state.isAuthenticated = false;
            state.seller=""
        },
        clearErrors: (state) => {
            state.error = null;
        },
    }
})

export const {
    sellerLogin,
    sellerLogout,
    addSeller,
    clearErrors
}=sellerSlice.actions

export default sellerSlice.reducer