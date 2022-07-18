import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import castSliceReducer from "./cast";
import plotsSliceReducer from "./plots";
import todosSliceReducer from "./todos";
import authSliceReducer from "./auth";
import userSliceReducer, { SET_USER } from "./user";
import { User } from "../Types/AppTypes";
import { fetchShowNames } from "../Util/FetchShowNames";

const rootReducer = combineReducers({
    auth: authSliceReducer,
    user: userSliceReducer,
    cast: castSliceReducer,
    plots: plotsSliceReducer,
    todos: todosSliceReducer,
});

export type RootStateType = ReturnType<typeof rootReducer>;

const ACTION_LOGGER: ThunkMiddleware<RootStateType> = ({ getState }) => {
    return (next) => {
        return async (action) => {
            console.log(action.type);
            return next(action);
        };
    };
};

const SET_USER_MIDDLEWARE: ThunkMiddleware<RootStateType> = ({
    dispatch,
    getState,
}) => {
    return (next) => {
        return async (action) => {
            if (action.type === "login/fulfilled") {
                let userData = action.payload.user as User;
                let shows = await fetchShowNames(
                    userData,
                    action.payload.ACCESS_TOKEN
                );
                dispatch(SET_USER({ ...userData, shows }));
            }
            return next(action);
        };
    };
};

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefault) =>
        getDefault().concat([ACTION_LOGGER, SET_USER_MIDDLEWARE]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
