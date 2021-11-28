import { CastMember, CastState, ToDo } from "../Types/AppTypes";


export const initialCastState: CastState = {
    cast: [{
        name: 'Luke Brady',
        role: 'Moses',
        notes: '',
        id: String(Math.random()).substring(2),
        group: 'Principles',
        image: 'https://backstagebucket.s3.eu-west-2.amazonaws.com/princeofegypt/Luke+Brady.png'
    },
    {
        name: 'Sasha',
        role: 'Sasha',
        notes: '',
        id: String(Math.random()).substring(2),
        group: 'Ensemble F',
        image: ''
    }, {
        name: 'Adam',
        role: 'Adam',
        notes: '',
        id: String(Math.random()).substring(2),
        group: 'Ensemble M',
        image: ''
    }]
}

export interface TodosState {
    todos: ToDo[];
    showComplete: boolean;
};
export const initialTodosState: TodosState = {
    todos: [{
        id: 0,
        name: 'To do one...',
        complete: false
    }],
    showComplete: false
};