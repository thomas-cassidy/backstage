import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ToDo } from '../types/AppTypes'
import { initialTodosState } from '../Util/InitialState';

const newToDo = {
    id: -1,
    name: 'New to do...',
    complete: false
}

export const plotSlice = createSlice({
    name: 'todos',
    initialState: initialTodosState,
    reducers: {
        ADD_TODO: ({ todos }) => {
            let newId = -1
            todos.map(({ id }) => { if (id > newId) newId = id + 1 })
            todos.unshift({ ...newToDo, id: newId })
        },
        SET_COMPLETE: ({ todos }, { payload: { id } }: PayloadAction<{ id: number }>) => {
            let todo = todos.find(t => t.id === id)
            if (todo) todo.complete = !todo.complete

        },
        DELETE_TODO: ({ todos }, action: PayloadAction<ToDo>) => {
            todos.filter(t => t.id === action.payload.id)
        },
        EDIT_TODO: ({ todos }, { payload: { id, value } }: PayloadAction<{ id: number, value: string }>) => {
            let todo = todos.find(t => t.id === id)
            if (todo) todo.name = value
        }
    }
});

export const { ADD_TODO, SET_COMPLETE, DELETE_TODO, EDIT_TODO } = plotSlice.actions
export default plotSlice.reducer