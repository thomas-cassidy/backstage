export type User = {
  __v: number;
  _id: number | string;
  name: string;
  email: string;
  password?: string;
  shows: { _id: number | string; name: string }[];
};

export type Show = {
  [key: string]: any;
  _id: number | string;
  name: string;
  cast: CastMember[];
  plots: Plot[];
  todos: ToDo[];
  owner: string;
  accessList?: string[];
  isOwner: boolean;
};

export type CastMember = {
  name: string;
  role: string;
  notes: string;
  category?: string;
  _id: number | string;
  images?: string[];
};

export interface CastState {
  cast: CastMember[];
  groups: string[];
}

export type CueType = {
  _id: number | string;
  cuePoint: string;
  location: string;
  notes: string;
  castMembers: (number | string)[];
};

export interface Plot {
  name: string;
  cues: CueType[];
  _id: number | string;
}

export type ToDo = {
  name: string;
  completed: boolean;
  priority: boolean;
  _id: number | string;
};

export type ExpectedServerSuccess = {
  status: "ok";
  cast: CastMember[];
};
export type ExpectedServerFailure = {
  status: "error";
  error: string;
};
