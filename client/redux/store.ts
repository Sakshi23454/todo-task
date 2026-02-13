import { configureStore } from "@reduxjs/toolkit";
import { todoApi } from "./apis/todo.api";


const reduxStore = configureStore({
    reducer: {
        [todoApi.reducerPath]: todoApi.reducer,
    },

    middleware: def => def().concat(todoApi.middleware)
})

export default reduxStore