import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { ThunkMiddleware } from "redux-thunk";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import castSliceReducer from "./cast";
import plotsSliceReducer from "./plots";
import todosSliceReducer from "./todos";
import authSliceReducer from "./auth";
import userSliceReducer from "./user";
import statusSliceReducer from "./status";
import showSliceReducer from "./show";
import chatSliceReducer from "./chat";
import websocketSliceReducer from "./websocket";
import AsyncStorage from "@react-native-async-storage/async-storage";

const rootReducer = combineReducers({
  status: statusSliceReducer,
  auth: authSliceReducer,
  user: userSliceReducer,
  show: showSliceReducer,
  cast: castSliceReducer,
  plots: plotsSliceReducer,
  todos: todosSliceReducer,
  chat: chatSliceReducer,
  websocket: websocketSliceReducer,
});

export type RootStateType = ReturnType<typeof rootReducer>;

const persistRootReducer = persistReducer(
  {
    key: "rootReducer",
    storage: AsyncStorage,
  },
  rootReducer
);

const ACTION_LOGGER: ThunkMiddleware<RootStateType> = ({ getState }) => {
  return (next) => {
    return async (action) => {
      console.log(action.type);
      return next(action);
    };
  };
};

const store = configureStore({
  reducer: persistRootReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          "ws/CONNECT_WEBSOCKET",
          "ws/CONNECT_WEBSOCKET/fulfilled",
        ],
        ignoredPaths: ["websocket.ws"],
      },
    }).concat([ACTION_LOGGER]),
});

export const storePersistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
