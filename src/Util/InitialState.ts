import { CastState, ToDo } from "../Types/AppTypes";


export const initialCastState: CastState = {
    cast: [{
        name: 'Luke Brady',
        role: 'Moses',
        notes: '',
        id: String(Math.random()).substring(2),
        group: 'Principals',
        image: 'https://backstagebucket.s3.eu-west-2.amazonaws.com/princeofegypt/Luke+Brady.png'
    },
    {
        name: 'Sasha',
        role: 'F1 Sasha',
        notes: '',
        id: String(Math.random()).substring(2),
        group: 'Ensemble F',
        image: ''
    }, {
        name: 'Adam',
        role: 'M1 Adam',
        notes: '',
        id: String(Math.random()).substring(2),
        group: 'Ensemble M',
        image: ''
    }],
    groups: [
        'Principals',
        'Ensemble M',
        'Ensemble F'
    ]
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