import { configureStore, combineReducers, CombinedState } from '@reduxjs/toolkit'
// import { persistReducer } from 'redux-persist'
// import { PersistConfig } from 'redux-persist/es/types'
// import AsyncStorage from '@react-native-async-storage/async-storage'
// import storage from 'redux-persist/lib/storage'
import castSliceReducer from './cast'
import plotsSliceReducer, { PlotState } from './plots'
import todosSliceReducer from './todos'
import { testSliceReducer, testState } from './test'
import { TodosState } from '../Util/InitialState'
import { CastState } from '../Types/AppTypes'
import { ThunkMiddleware } from 'redux-thunk'

// const persistConfig: PersistConfig<any> = {
//     key: 'backstagePersist',
//     storage: AsyncStorage
// }

type combinedState = CombinedState<{
    cast: CastState;
    plots: PlotState;
    todos: TodosState;
    test: testState;
}>

const rootReducer = combineReducers({
    cast: castSliceReducer,
    plots: plotsSliceReducer,
    todos: todosSliceReducer,
    test: testSliceReducer,
})

// const persistedReducer = persistReducer(persistConfig, rootReducer)

const ACTION_LOGGER: ThunkMiddleware = ({ dispatch, getState }) => {
    return (next) => {
        return (action) => {
            console.log(action.type)
            return next(action)
        }
    }
}

const store = configureStore({
    reducer: rootReducer,
    middleware: getDefault => getDefault().concat(ACTION_LOGGER)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store