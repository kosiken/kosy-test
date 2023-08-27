/* eslint-disable @typescript-eslint/no-explicit-any */
import { StackActions, CommonActions } from "@react-navigation/native";
import { navigationRef } from "react-navigation-helpers";

import { RootStackParamList as MainStackParamList } from "@shared-constants";

type NavParams = Record<string, any> | undefined;

function navigate(name: keyof MainStackParamList, params: NavParams = {}) {
  (navigationRef.current as any)?.navigate(name, params);
}

function reset(route: keyof MainStackParamList, params: NavParams = {}) {
  navigationRef.current?.dispatch({
    ...StackActions.replace(route, params),
  });
}

function resetHard(route: keyof MainStackParamList) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: route }],
    }),
  );
}

function resetStack(
  routes: Array<{ name: keyof MainStackParamList; params?: NavParams }>,
  index: number,
) {
  navigationRef.current?.dispatch(
    CommonActions.reset({
      index,
      routes,
    }),
  );
}
function pop() {
  const popAction = StackActions.pop(1);
  navigationRef.current?.dispatch(popAction);
}

function popToTop() {
  navigationRef.current?.dispatch(StackActions.popToTop());
}

export const NavigationService = {
  navigate,
  reset,
  pop,
  popToTop,
  resetHard,
  resetStack,
};
