// ? Screens
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  SplashScreen: undefined;
  Home: undefined;
  Search: undefined;
  Notification: undefined;
  Profile: undefined;
  Detail: undefined;
  Onboarding: undefined;
};

export enum SCREENS {
  SPLASHSCREEN = "SplashScreen",
  HOME = "Home",
  SEARCH = "Search",
  NOTIFICATION = "Notification",
  PROFILE = "Profile",
  DETAIL = "Detail",
  ONBOARDING = "Onboarding",
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
