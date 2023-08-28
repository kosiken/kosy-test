/* eslint-disable react-native/no-unused-styles */
import { Image, StyleSheet } from "react-native";
import { ExtendedTheme, useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo } from "react";
import Page from "@shared-components/page/Page";
import Box from "@shared-components/box/Box";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import { IBaseScreenProps, SCREENS } from "@shared-constants";
import riseApi from "@api";
import { from } from "rxjs";
import axios from "axios";
import useBoundStore from "store";

interface SplashScreenProps extends IBaseScreenProps<"SplashScreen"> {}

const createStyles = (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create({
    main: {
      backgroundColor: colors.primary,
    },
    description: {
      marginTop: 35,
    },
  });
};

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { setUser } = useBoundStore();
  useEffect(() => {
    const token = riseApi.getToken();
    if (!token || token === "") {
      navigation.replace(SCREENS.ONBOARDING);
      return;
    }
    const response$ = from(
      axios.get(riseApi.apiUrl + "/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
    response$.subscribe({
      next: (res) => {
        if (res.status === 200 || res.status === 201) {
          setUser(res.data);
          riseApi.setToken(token);
          navigation.replace(SCREENS.HOME);
        } else {
          navigation.replace(SCREENS.ONBOARDING);
        }
      },
      error: () => {
        navigation.replace(SCREENS.ONBOARDING);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page
      style={styles.main}
      statusBarProps={{
        backgroundColor: theme.colors.primary,
        barStyle: "light-content",
      }}
    >
      <Box margin={[100, 0]} alignItems="center" flex={1}>
        <Box width={200} alignItems="center">
          <Image source={require("../assets/images/logo.png")} />
          <TextWrapper
            fontSize={18}
            textAlign="center"
            color={theme.colors.white}
            style={styles.description}
          >
            Dollar investments that help you grow{" "}
          </TextWrapper>
        </Box>
      </Box>
      <Box>
        <TextWrapper textAlign="center" color={theme.colors.white}>
          All rights reserved
        </TextWrapper>
        <TextWrapper textAlign="center" color={theme.colors.white}>
          (c) 2021
        </TextWrapper>
      </Box>
    </Page>
  );
};

export default SplashScreen;
