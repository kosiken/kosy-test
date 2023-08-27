import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useTheme } from "@react-navigation/native";
import { palette } from "@theme/themes";

interface IProgressProps extends ViewProps {
  color?: string;
  value: number;
  backgroundColor?: string;
  height?: number;
}

const Progress: React.FC<IProgressProps> = (props) => {
  const { colors } = useTheme() as { colors: typeof palette };
  const {
    color = colors.primary,
    backgroundColor = colors.offWhite,
    value,
    height = 10,
    style,
  } = props;
  return (
    <View
      style={[
        styles.progressContainer,
        { backgroundColor, height, borderRadius: height - 1 },
        style && style,
      ]}
    >
      <View
        style={{
          flex: value,
          backgroundColor: color,
          height,
          borderRadius: height - 1,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  progressContainer: {
    flexDirection: "row",
  },
});

export default Progress;
