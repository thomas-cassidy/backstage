import { configureStore, combineReducers, PayloadAction, CombinedState, getDefaultMiddleware } from '@reduxjs/toolkit'
// import { persistReducer } from 'redux-persist'
// import { PersistConfig } from 'redux-persist/es/types'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import storage from 'redux-persist/lib/storage'
import { Action, Middleware } from 'redux'
import castSliceReducer from './cast'
import plotsSliceReducer from './plots'
import todosSliceReducer from './todos'
import { testSliceReducer } from './test'

// const persistConfig: PersistConfig<any> = {
//     key: 'backstagePersist',
//     storage: AsyncStorage
// }

const rootReducer = combineReducers({
    cast: castSliceReducer,
    plots: plotsSliceReducer,
    todos: todosSliceReducer,
    test: testSliceReducer,
})

// const persistedReducer = persistReducer(persistConfig, rootReducer)

const myMiddleware = (store: any) => {
    return (next: any) => {
        return (action: PayloadAction<any>) => {
            return console.log('middleware!!!')
        }
    }
}

const store = configureStore({
    reducer: rootReducer,
    // middleware: getDefaultMiddleware => {
    //     getDefaultMiddleware()
    //         .prepend(
    //             myMiddleware as Middleware<(action: Action<'test'>) => void, {}>
    //         )
    // }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store