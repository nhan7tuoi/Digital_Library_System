import { createSlice } from '@reduxjs/toolkit';

const authReducer = createSlice({
    name: 'auth',
    initialState: {
        userId: '',
        majorId: '',
        user: {},
        accessToken: '',
    },
    reducers: {
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
        setUserRedux: (state, action) => {
            state.user = action.payload;
        },
        setMajorId: (state, action) => {
            state.majorId = action.payload;
        },
        setAuth: (state, action) => {
            state.accessToken = action.payload;
        },
        clearAuth: state => {
            state.accessToken = '';
        },
        clearUser: state => {
            state.user = {};
        },
        clearUserId: state => {
            state.userId = '';
        },
    },
});

export const {
    setUserRedux,
    setAuth,
    clearAuth,
    clearUser,
    setUserId,
    setMajorId,
    clearUserId,
} = authReducer.actions;
export default authReducer.reducer;
