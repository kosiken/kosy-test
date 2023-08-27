/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useColorScheme } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { isReadyRef, navigationRef } from "react-navigation-helpers";
/**
 * ? Local & Shared Imports
 */
import { RootStackParamList, SCREENS } from "@shared-constants";
import { DarkTheme, LightTheme } from "@theme/themes";
// ? Screens
import OnboardingScreens from "@screens/onboarding";
import HomeScreens from "@screens/home";
import SplashScreen from "@screens/SplashScreen";
import GoalScreens from "@screens/goals";

// ? If you want to use stack or tab or both
const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";

  React.useEffect((): any => {
    return () => (isReadyRef.current = false);
  }, []);

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      theme={isDarkMode ? DarkTheme : LightTheme}
    >
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={SCREENS.SPLASHSCREEN}
      >
        <Stack.Screen name={SCREENS.SPLASHSCREEN} component={SplashScreen} />

        {OnboardingScreens.map((m, i) => (
          <Stack.Screen
            key={`${m.screen}-${i}`}
            name={m.screen}
            component={m.component as any}
          />
        ))}
        {HomeScreens.map((m, i) => (
          <Stack.Screen
            key={`${m.screen}-${i}`}
            name={m.screen}
            component={m.component as any}
          />
        ))}
        {GoalScreens.map((m, i) => (
          <Stack.Screen
            key={`${m.screen}-${i}`}
            name={m.screen}
            component={m.component as any}
          />
        ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
