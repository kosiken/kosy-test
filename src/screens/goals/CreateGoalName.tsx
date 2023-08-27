import React from "react";
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

interface CreateGoalNameProps extends IBaseScreenProps<"CreateGoalName"> {}

const CreateGoalName: React.FC<CreateGoalNameProps> = ({ navigation }) => {
  const {
    addItemToGoalRequest,
    goalRequestData: { name },
  } = useBoundStore();
  const { colors } = useTheme() as { colors: typeof palette };
  return (
    <Page label="Goal name" navigation={navigation}>
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
            What are you saving for?
          </TextWrapper>

          <Box margin={[26, 0]}>
            <TextInputWrapper
              value={name}
              onChangeText={(t) => addItemToGoalRequest({ name: t })}
            />
          </Box>
          <CustomButton
            label="Continue"
            disabled={!name || name.length < 3}
            onPress={() => {
              navigation.navigate(SCREENS.CREATE_GOAL_AMOUNT);
            }}
          />
        </Box>
      </KeyboardAwareScrollView>
    </Page>
  );
};

export default CreateGoalName;
