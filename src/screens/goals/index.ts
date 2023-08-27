/* eslint-disable @typescript-eslint/no-explicit-any */
import { SCREENS } from "@shared-constants";
import React from "react";
import CreateGoalName from "./CreateGoalName";
import CreateGoalAmount from "./CreateGoalAmount";
import CreateGoalDate from "./CreateGoalDate";
import CreateGoalDone from "./CreateGoalDone";

const GoalScreens: Array<{
  screen: SCREENS;
  component: React.FC<any>;
}> = [
  {
    component: CreateGoalName,
    screen: SCREENS.CREATE_GOAL_NAME,
  },
  {
    component: CreateGoalAmount,
    screen: SCREENS.CREATE_GOAL_AMOUNT,
  },
  {
    component: CreateGoalDate,
    screen: SCREENS.CREATE_GOAL_DATE,
  },
  {
    component: CreateGoalDone,
    screen: SCREENS.CREATE_GOAL_DONE,
  },
];

export default GoalScreens;
