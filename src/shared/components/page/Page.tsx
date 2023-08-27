import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  StatusBar,
  StatusBarProps,
} from "react-native";
import {
  ExtendedTheme,
  NavigationProp,
  useTheme,
} from "@react-navigation/native";
import React from "react";
import {
  SafeAreaView,
  NativeSafeAreaViewProps,
} from "react-native-safe-area-context";
import { RootStackParamList } from "@shared-constants";
import Box from "@shared-components/box/Box";
import RNBounceable from "@freakycoder/react-native-bounceable";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";

type ComponentFunction = (
  n: NavigationProp<RootStackParamList> | undefined,
) => React.ReactNode;

type AppPageProps = NativeSafeAreaViewProps & {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  statusBarProps?: StatusBarProps;
  label?: string;
  navigation?: NavigationProp<RootStackParamList>;
  navigationComponent?: ComponentFunction | React.ReactNode;
};

const Page: React.FC<AppPageProps> = ({
  style,
  children,
  statusBarProps,
  label,
  navigationComponent,
  navigation,
  ...props
}) => {
  const theme = useTheme() as ExtendedTheme;
  const renderNavigation = () => {
    if (navigationComponent) {
      if (typeof navigationComponent === "function") {
        return navigationComponent(navigation);
      }
      return navigationComponent;
    }
    return (
      <RNBounceable
        onPress={() => {
          if (navigation && navigation.canGoBack()) {
            navigation.goBack();
          }
        }}
      >
        <Box
          backgroundColor="#71879C1A"
          width={40}
          height={40}
          borderRadius={20}
          justifyContent="center"
          alignItems="center"
        >
          <Icon
            name="arrow-left"
            type={IconType.Feather}
            color={theme.colors.primary}
          />
        </Box>
      </RNBounceable>
    );
  };

  const showHeader = !!navigation || !!label;

  return (
    <SafeAreaView
      style={[
        Styles.main,
        { backgroundColor: theme.colors.background },
        ...(Array.isArray(style) ? style : [style]),
      ]}
      {...props}
    >
      <StatusBar
        {...statusBarProps}
        backgroundColor={
          statusBarProps?.backgroundColor || theme.colors.background
        }
        barStyle={statusBarProps?.barStyle || theme.barStyle}
      />
      <Box
        style={{ position: "relative", display: showHeader ? "flex" : "none" }}
      >
        <Box
          style={{ position: "absolute" }}
          height={40}
          justifyContent="center"
          width={"100%"}
        >
          <TextWrapper
            textAlign="center"
            fontSize={24}
            fontWeight="700"
            color={theme.colors.textBlack}
          >
            {label}
          </TextWrapper>
        </Box>
        <Box
          flexDirection="row"
          style={{ position: "relative" }}
          padding={[0, 20]}
        >
          {renderNavigation()}
        </Box>
      </Box>

      {children}
    </SafeAreaView>
  );
};

export default Page;

Page.defaultProps = {
  statusBarProps: {
    animated: true,
  },
};

const Styles = StyleSheet.create({
  main: {
    flex: 1,
  },
});
