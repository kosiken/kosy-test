import {
  StyleProp,
  ViewStyle,
  StyleSheet,
  StatusBar,
  StatusBarProps,
} from "react-native";
import { ExtendedTheme, useTheme } from "@react-navigation/native";
import React from "react";
import {
  SafeAreaView,
  NativeSafeAreaViewProps,
} from "react-native-safe-area-context";

type AppPageProps = NativeSafeAreaViewProps & {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  statusBarProps?: StatusBarProps;
};

const Page: React.FC<AppPageProps> = ({
  style,
  children,
  statusBarProps,
  ...props
}) => {
  const theme = useTheme() as ExtendedTheme;

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
