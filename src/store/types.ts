import { User } from "@services/models";

type signUpFormData = {
  firstName?: string;
  lastName?: string;
  password?: string;
  phoneNumber?: string;
  countryCode?: string;
  dateOfBirth?: string;
  email?: string;
  dob?: string;
};

export interface AuthSlice {
  signUpData: signUpFormData;
  addItemToRequest: (data: signUpFormData) => void;
  resetAll: () => void;
  resetRequestData: () => void;
  user: User | null;
  setUser: (u: User | null) => void;
}

type goalCreateData = {
  name?: string;
  amount?: number;
  date?: string;
};

export interface GoalSlice {
  goalRequestData: goalCreateData;
  addItemToGoalRequest: (data: goalCreateData) => void;
  resetGoalRequestData: () => void;
}

type appState = {
  notificationsEnabled?: boolean;
};
export interface AppSlice {
  currentState: appState;
  setAppState: (s: appState) => void;
}

export type Slices = AppSlice & AuthSlice & GoalSlice;
