import { CastState, ToDo } from "../Types/AppTypes";

export const initialCastState: CastState = {
  cast: [],
  groups: ["Principals", "Ensemble M", "Ensemble F"],
};

export interface TodosState {
  todos: ToDo[];
  showComplete: boolean;
}

export const initialTodosState: TodosState = {
  todos: [],
  showComplete: false,
};

export const API_URI = "http://10.6.2.11:3001/api";
// export const API_URI = "http://10.6.2.180:3001/api";
// export const API_URI = "http://192.168.1.220:3001/api";
// export const API_URI = "http://localhost:3001/api";
