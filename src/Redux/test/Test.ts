import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

interface state {
    stuff: string[],
    status: string
}

const initialState: state = {
    stuff: [],
    status: 'loading...',
}

export const getSomething = createAsyncThunk<string[]>(
    'test',
    async () => {
        const fetchPromise = await new Promise<string[]>((resolve, reject) => {
            setTimeout(() => {
                Math.round(Math.random()) === 0 ? reject('This is a test') : resolve(['1', '2'])
            }, 2000)
        })
        return fetchPromise
    }
)

const testSlice = createSlice({
    name: 'test',
    initialState: initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder.addCase(getSomething.pending, (state, action) => {
            state.status = 'loading...'
        })
        builder.addCase(getSomething.fulfilled, (state, { payload }) => {
            state.status = 'success...',
                state.stuff = payload
        })
        builder.addCase(getSomething.rejected, (state) => {
            state.status = 'failed'
        })
    }
})

export default testSlice.reducer