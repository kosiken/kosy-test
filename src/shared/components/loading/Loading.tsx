import React from "react";
import { useTheme } from "@react-navigation/native";

import {
  ActivityIndicator,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import Box from "@shared-components/box/Box";
import { palette } from "@theme/themes";

const Loader: React.FC = () => {
  const { width, height } = useWindowDimensions();
  const theme = useTheme();
  const colors = theme.colors as typeof palette;
  return (
    <Box width={width} height={height} style={Styles.loaderOuterView}>
      <Box padding={30} backgroundColor={colors.background} borderRadius={15}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Box>
    </Box>
  );
};

export default Loader;

const Styles = StyleSheet.create({
  loaderOuterView: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
    elevation: 5,
  },
});
