import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import DataReducer from "./slices/DataSlice";

const Store = configureStore({
  reducer: {
    DataReducer,
    //modalReducer,
    //tabReducer,
  },
});

export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type RootStoreI = ReturnType<typeof Store.getState>;

export default Store;
