export type CastMember = {
    name: string;
    role: string;
    notes: string;
    group?: string;
    id: string;
    image?: string;
}

export interface CastState {
    cast: CastMember[]
}

export type CueType = {
    cuePoint: string;
    location: string;
    notes: string;
    castMembers: string[];
}

export interface Plot {
    name: string;
    cues: CueType[];
    id: number;
}

export type ToDo = {
    name: string;
    complete: boolean;
    id: number;
}