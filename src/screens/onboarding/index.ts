/* eslint-disable @typescript-eslint/no-explicit-any */
import { SCREENS } from "@shared-constants";
import Onboarding from "./Onboarding";
import SignUp from "./SignUp";
import React from "react";
import SignIn from "./SignIn";
import PersonalInfo from "./PersonalInfo";
import Done from "./Done";
import SetPin from "./SetPin";

const OnboardingScreens: Array<{
  screen: SCREENS;
  component: React.FC<any>;
}> = [
  {
    screen: SCREENS.ONBOARDING,
    component: Onboarding,
  },
  {
    screen: SCREENS.SIGNUP,
    component: SignUp,
  },
  {
    screen: SCREENS.SIGNIN,
    component: SignIn,
  },
  {
    screen: SCREENS.PERSONAL_INFO,
    component: PersonalInfo,
  },
  {
    screen: SCREENS.DONE,
    component: Done,
  },
  {
    screen: SCREENS.SET_PIN,
    component: SetPin,
  },
];

export default OnboardingScreens;
