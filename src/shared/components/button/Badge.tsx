import { View, StyleSheet } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import { palette } from "@theme/themes";
import RNBounceable, {
  IRNBounceableProps,
} from "@freakycoder/react-native-bounceable";

type BadgeProps = IRNBounceableProps & {
  textSize?: number;
  textColor?: string;
  backgroundColor?: string;
  label?: string;
};
const Badge: React.FC<BadgeProps> = (props) => {
  const { colors } = useTheme() as { colors: typeof palette };
  const {
    textSize = 12,
    textColor = colors.white,
    backgroundColor = colors.primary,
    label,
    children,
    style,
  } = props;
  return (
    <RNBounceable style={Styles.main}>
      <View
        style={[
          Styles.badge,
          { backgroundColor },
          ...(Array.isArray(style) ? style : [style]),
        ]}
      >
        {children}
        {label && (
          <TextWrapper fontSize={textSize} color={textColor}>
            {label}
          </TextWrapper>
        )}
      </View>
    </RNBounceable>
  );
};

export default Badge;

const Styles = StyleSheet.create({
  main: { flexDirection: "row" },
  badge: {
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
});
