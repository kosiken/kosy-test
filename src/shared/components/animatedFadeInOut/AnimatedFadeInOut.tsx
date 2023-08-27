import { StyleProp, View, ViewStyle } from "react-native";
import React from "react";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";

interface AnimatedFadeInOutProps {
  show: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}
const AnimatedFadeInOut: React.FC<AnimatedFadeInOutProps> = ({
  show,
  children,
  ...props
}) => {
  if (!show) {
    return <View />;
  }
  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutDown} {...props}>
      {children}
    </Animated.View>
  );
};

AnimatedFadeInOut.defaultProps = {
  show: false,
};

export default AnimatedFadeInOut;
