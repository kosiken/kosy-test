import { create } from "zustand";
import { createAuthSlice, createAppSlice, createGoalSlice } from "./slices";
import { Slices } from "./types";

const useBoundStore = create<Slices>()((...a) => ({
  ...createAuthSlice(...a),
  ...createAppSlice(...a),
  ...createGoalSlice(...a),
}));

export default useBoundStore;
