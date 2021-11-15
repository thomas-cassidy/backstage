import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const getSomething = createAsyncThunk(
    'test',
    async () => {
        return fetch('').then(res => res.json())
    }
)

interface state {
    stuff: string[],
    status: string
}

const initialState: state = {
    stuff: [],
    status: '',
}

const testSlice = createSlice({
    name: 'test',
    initialState: initialState,
    reducers: {

    },
    extraReducers: {
        [getSomething.pending]: (state, action) => {
            state.status = 'loading...'
        },
        [getSomething.fulfilled]: (state, { payload }) => {
            state.status = 'success...',
                state.stuff = payload
        },
        [getSomething.rejected]: (state) => {
            state.status = 'failed'
        }
    }
})

export default testSlice.reducer