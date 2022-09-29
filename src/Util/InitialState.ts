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

export const API_URI = "http://localhost:3001/api";
