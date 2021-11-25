import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CastMember } from '../Types/AppTypes'
import { initialCastState } from '../Util/InitialState'


export const castSlice = createSlice({
    name: 'cast',
    initialState: initialCastState,
    reducers: {
        ADD_CASTMEMBER: ({ cast }, { payload }: PayloadAction<CastMember>) => {
            cast.push({ ...payload, id: 100 })
        },
        REMOVE_CASTMEMBER: ({ cast }, action: PayloadAction<CastMember>) => {
            console.log(cast.filter(c => c.id !== action.payload.id))
        },
        EDIT_CASTMEMBER: ({ cast }, action: PayloadAction<CastMember>) => {
            cast.map(c => {
                if (c.id === action.payload.id) {
                    let { name, role, group, image, notes } = action.payload
                    c.name = name
                    c.role = role
                    c.group = group
                    c.image = image
                    c.notes = notes
                }
                return
            })
        }
    }
})

export const { ADD_CASTMEMBER, EDIT_CASTMEMBER, REMOVE_CASTMEMBER } = castSlice.actions

export default castSlice.reducer