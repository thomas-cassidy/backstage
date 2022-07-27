export type User = {
    __v: number;
    _id: string;
    name: string;
    email: string;
    password?: string;
    shows: { _id: string; name: string }[];
};

export type Show = {
    [key: string]: any;
    _id: string;
    name: string;
    cast?: CastMember[];
    plots?: Plot[];
    todos?: ToDo[];
    owner?: string;
    accessList?: string[];
};

export type CastMember = {
    name: string;
    role: string;
    notes: string;
    group?: string;
    id: string;
    image?: string;
};

export interface CastState {
    cast: CastMember[];
    groups: string[];
}

export type CueType = {
    id: string;
    cuePoint: string;
    location: string;
    notes: string;
    castMembers: string[];
};

export interface Plot {
    name: string;
    cues: CueType[];
    id: string;
}

export type ToDo = {
    name: string;
    complete: boolean;
    id: number;
};
