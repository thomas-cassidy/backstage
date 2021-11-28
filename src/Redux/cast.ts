import { createSlice, PayloadAction, current } from '@reduxjs/toolkit'
import { CastMember } from '../Types/AppTypes'
import { initialCastState } from '../Util/InitialState'

const getIndex = (cast: CastMember[], id: string) => {
    for (var x = 0; x < cast.length; x++) {
        if (cast[x].id === id) {
            return x
        }
    }
    return -1
}

export const castSlice = createSlice({
    name: 'cast',
    initialState: initialCastState,
    reducers: {
        ADD_CASTMEMBER: ({ cast }, { payload }: PayloadAction<CastMember>) => {
            cast.push({ ...payload, id: String(Math.random()).substring(2) })
        },
        REMOVE_CASTMEMBER: ({ cast }, { payload }: PayloadAction<CastMember>) => {
            cast.splice(getIndex(cast, payload.id), 1)
        },
        EDIT_CASTMEMBER: (state, { payload: { id, field, value } }: PayloadAction<{ id: string, field: keyof CastMember, value: string }>) => {
            const castMember = state.cast.find(c => c.id === id)
            if (castMember) {
                castMember[field] = value
            }
        }
    }
})

export const { ADD_CASTMEMBER, EDIT_CASTMEMBER, REMOVE_CASTMEMBER } = castSlice.actions

export default castSlice.reducer