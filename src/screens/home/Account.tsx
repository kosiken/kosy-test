import React from "react";
import Page from "@shared-components/page/Page";
import Box from "@shared-components/box/Box";
import { IBaseScreenProps, SCREENS } from "@shared-constants";
import useBoundStore from "store";
import riseApi from "@api";
import { NavigationService } from "@nav-local/NavigationService";
import CustomButton from "@shared-components/button/Button";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";

interface AccountProps extends IBaseScreenProps<"Account"> {}

const AccountScreen: React.FC<AccountProps> = () => {
  const { setUser } = useBoundStore();
  const logout = () => {
    riseApi.setToken("");
    setUser(null);
    NavigationService.resetHard(SCREENS.ONBOARDING);
  };
  return (
    <Page>
      <TextWrapper textAlign="center" fontSize={24} fontWeight="700">
        Account
      </TextWrapper>
      <Box flex={1} padding={[0, 20]} justifyContent="center">
        <CustomButton onPress={() => logout()} label="Logout" />
      </Box>
    </Page>
  );
};

export default AccountScreen;
