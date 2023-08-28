import React, { useEffect, useState } from "react";
import { useTheme } from "@react-navigation/native";

import { IBaseScreenProps, SCREENS } from "@shared-constants";
import Page from "@shared-components/page/Page";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import Box from "@shared-components/box/Box";
import Progress from "./components/Progress";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import TextInputWrapper from "@shared-components/text-input/TextInput";
import useBoundStore from "store";
import { palette } from "@theme/themes";
import CustomButton from "@shared-components/button/Button";
import { to2DecimalPlaces } from "utils";

interface CreateGoalAmountProps extends IBaseScreenProps<"CreateGoalAmount"> {}

const CreateGoalAmount: React.FC<CreateGoalAmountProps> = ({ navigation }) => {
  const {
    addItemToGoalRequest,
    goalRequestData: { amount },
  } = useBoundStore();
  const [theAmount, setTheAmount] = useState("");
  useEffect(() => {
    setTheAmount(to2DecimalPlaces(amount || 0, true).toString());
  }, [amount]);
  const { colors } = useTheme() as { colors: typeof palette };

  const onChangeText = (inputValue: string) => {
    const values = inputValue.replace(/[,.]/gi, "");

    const num = parseInt(values, 10);

    addItemToGoalRequest({ amount: num / 100 });
  };
  return (
    <Page label="Target amount" navigation={navigation}>
      <KeyboardAwareScrollView>
        <Box padding={[0, 20]}>
          <TextWrapper
            color="#71879C"
            style={{ marginBottom: 21, marginTop: 30 }}
            fontSize={15}
          >
            Question 1 of 3
          </TextWrapper>
          <Progress value={1 / 3} />
          <TextWrapper
            color={colors.textBlack}
            style={{ marginTop: 50 }}
            fontWeight="700"
            fontSize={17}
          >
            How much do you need?
          </TextWrapper>

          <Box margin={[26, 0]}>
            <TextInputWrapper
              leftComponent={
                <Box marginRight={10}>
                  <TextWrapper
                    color={colors.primary}
                    fontSize={15}
                    fontWeight="700"
                  >
                    ₦
                  </TextWrapper>
                </Box>
              }
              value={theAmount}
              onChangeText={onChangeText}
            />
          </Box>
          <CustomButton
            label="Continue"
            disabled={!amount || amount < 1000}
            onPress={() => {
              navigation.navigate(SCREENS.CREATE_GOAL_DATE);
            }}
          />
        </Box>
      </KeyboardAwareScrollView>
    </Page>
  );
};

export default CreateGoalAmount;
