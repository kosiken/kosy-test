/* eslint-disable import/extensions */
import { RootStackParamList, SCREENS } from "@shared-constants";
import React from "react";
import HomeScreen from "./HomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image, View, useColorScheme } from "react-native";
import Home from "assets/svg/Home";
import { palette } from "@theme/themes";
import Plans from "assets/svg/Plans";
import Wallet from "assets/svg/Wallet";
import Feed from "assets/svg/Feed";
import Box from "@shared-components/box/Box";
import TempScreen from "./TempScreen";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import AccountScreen from "./Account";

const Tab = createBottomTabNavigator<RootStackParamList>();

const renderTabIcon = (
  route: any,
  focused: boolean,
  color: string,
  size: number,
) => {
  let icon = <View />;

  // const color = focused ? palette.primary : "#94A1AD";
  switch (route.name) {
    case SCREENS.HOME:
      icon = <Home color={color} width={size + 1} height={size} />;
      break;
    case SCREENS.PLANS:
      icon = <Plans color={color} width={size + 1} height={size} />;
      break;
    case SCREENS.WALLET:
      icon = <Wallet color={color} width={size + 1} height={size} />;
      break;
    case SCREENS.FEED:
      icon = <Feed color={color} width={size + 1} height={size} />;
      break;
    default:
      icon = (
        <Image
          source={require("@assets/images/headshot.jpeg")}
          style={{
            width: size,
            height: size,
            borderRadius: 15,
          }}
        />
      );
      break;
  }
  return (
    <Box justifyContent="center" alignItems="center">
      {icon}
    </Box>
  );
};

const renderTabLabel = (route: any, focused: boolean, color: string) => {
  if (focused) {
    return (
      <Icon type={IconType.Entypo} name="dot-single" color={color} size={30} />
    );
  }
  return <TextWrapper>{route.name as string}</TextWrapper>;
};

const RenderTabNavigation = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarIcon: ({ focused, color, size }) =>
          renderTabIcon(route, focused, color, size),
        tabBarLabel: ({ focused, color }) =>
          renderTabLabel(route, focused, color),
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: "#94A1AD",
        tabBarStyle: {
          backgroundColor: isDarkMode ? palette.black : palette.white,
          height: 70,
        },
      })}
    >
      <Tab.Screen name={SCREENS.HOME} component={HomeScreen} />
      <Tab.Screen name={SCREENS.PLANS} component={TempScreen} />
      <Tab.Screen name={SCREENS.WALLET} component={TempScreen} />
      <Tab.Screen name={SCREENS.FEED} component={TempScreen} />
      <Tab.Screen name={SCREENS.ACCOUNT} component={AccountScreen} />
    </Tab.Navigator>
  );
};

const HomeScreens: Array<{
  screen: SCREENS;
  component: React.FC<any>;
}> = [
  {
    component: RenderTabNavigation as any,
    screen: SCREENS.HOME,
  },
];

export default HomeScreens;
