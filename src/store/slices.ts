import { StateCreator } from "zustand";
import { AppSlice, AuthSlice, GoalSlice, Slices } from "./types";

import { SCREENS } from "@shared-constants";

import { Debug } from "@utils";
import { NavigationService } from "@nav-local/NavigationService";
// NavigationService
export const createAuthSlice: StateCreator<Slices, [], [], AuthSlice> = (
  set,
  get,
) => ({
  signUpData: {},

  addItemToRequest: (itemObj) => {
    const { signUpData } = get();
    set({ signUpData: Object.assign(signUpData, itemObj) });
  },
  resetRequestData: () => set({ signUpData: {} }),

  resetAll: () => set({ signUpData: {} }),
  register: async (d) => {
    Debug.log(d);
    NavigationService.resetHard(SCREENS.DONE);
  },
});

export const createAppSlice: StateCreator<Slices, [], [], AppSlice> = (
  set,
  get,
) => ({
  currentState: {
    notificationsEnabled: false,
  },
  setAppState: (itemObj) => {
    const { currentState } = get();
    set({ currentState: Object.assign(currentState, itemObj) });
  },
});

export const createGoalSlice: StateCreator<Slices, [], [], GoalSlice> = (
  set,
  get,
) => ({
  goalRequestData: {},

  addItemToGoalRequest: (itemObj) => {
    const { goalRequestData } = get();
    set({ goalRequestData: Object.assign(goalRequestData, itemObj) });
  },
  resetGoalRequestData: () => set({ goalRequestData: {} }),

  resetAll: () => set({ goalRequestData: {} }),
});
