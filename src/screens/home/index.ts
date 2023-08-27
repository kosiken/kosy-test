import { SCREENS } from "@shared-constants";
import React from "react";
import HomeScreen from "./HomeScreen";

const HomeScreens: Array<{
  screen: SCREENS;
  component: React.FC<any>;
}> = [
  {
    component: HomeScreen,
    screen: SCREENS.HOME,
  },
];

export default HomeScreens;
