import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import { PersistConfig } from 'redux-persist/es/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import storage from 'redux-persist/lib/storage'
import castSliceReducer from './cast'
import plotsSliceReducer from './plots'
import todosSliceReducer from './todos'

const persistConfig: PersistConfig<any> = {
    key: 'backstagePersist',
    storage: AsyncStorage
}

const reducers = combineReducers({
    cast: castSliceReducer,
    plots: plotsSliceReducer,
    todos: todosSliceReducer,
})

const persistedReducer = persistReducer(persistConfig, reducers)

const store = configureStore({
    reducer: {
        cast: castSliceReducer,
        plots: plotsSliceReducer,
        todos: todosSliceReducer
    },
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store