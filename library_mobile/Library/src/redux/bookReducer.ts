import { createSlice } from "@reduxjs/toolkit";

const bookReducer = createSlice({
    name: 'book',
    initialState: {
        books: [],
    },
    reducers: {
        setBooks: (state, action) => {
            state.books = action.payload;
        },
    }
});