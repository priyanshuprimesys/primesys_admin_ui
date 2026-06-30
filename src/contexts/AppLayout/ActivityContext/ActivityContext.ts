import { createContext } from "react";

export interface ActivityState {
  isActive: boolean;
  workingMs: number;
}

export const ActivityContext = createContext<ActivityState>({
  isActive: false,
  workingMs: 0,
});
