// ? Screens
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { SavingPlan } from "@services/models";

export type RootStackParamList = {
  SplashScreen: undefined;
  Home: undefined;
  Search: undefined;
  Notification: undefined;
  Profile: undefined;
  Detail: undefined;
  Onboarding: undefined;
  SignUp: undefined;
  SignIn: undefined;
  SetPin: undefined;
  PersonalInfo: undefined;
  Done: undefined;
  CreateGoalName: undefined;
  CreateGoalAmount: undefined;
  CreateGoalDate: undefined;
  CreateGoalDone: { goal: SavingPlan };
  CreateGoalConfirm: undefined;
  ViewGoalPlan: { goal: SavingPlan };
};

export enum SCREENS {
  SPLASHSCREEN = "SplashScreen",
  HOME = "Home",
  SEARCH = "Search",
  NOTIFICATION = "Notification",
  PROFILE = "Profile",
  DETAIL = "Detail",
  ONBOARDING = "Onboarding",
  SIGNUP = "SignUp",
  SIGNIN = "SignIn",
  PERSONAL_INFO = "PersonalInfo",
  DONE = "Done",
  SET_PIN = "SetPin",
  CREATE_GOAL_NAME = "CreateGoalName",
  CREATE_GOAL_AMOUNT = "CreateGoalAmount",
  CREATE_GOAL_DATE = "CreateGoalDate",
  CREATE_GOAL_DONE = "CreateGoalDone",
  CREATE_GOAL_CONFIRM = "CreateGoalConfirm",
  VIEW_GOAL_PLAN = "ViewGoalPlan",
}

export type MainNavigationProp<
  RouteName extends keyof RootStackParamList = SCREENS,
> = StackNavigationProp<RootStackParamList, RouteName>;

export type MainRouteProp<
  RouteName extends keyof RootStackParamList = SCREENS,
> = RouteProp<RootStackParamList, RouteName>;
export interface IBaseScreenProps<
  T extends keyof RootStackParamList = SCREENS,
> {
  navigation: MainNavigationProp<T>;
  route: MainRouteProp<T>;
}
