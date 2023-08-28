import React, { useState } from "react";
import { useTheme } from "@react-navigation/native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
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
import { Platform } from "react-native";
import dayjs from "dayjs";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon, { IconType } from "react-native-dynamic-vector-icons";

interface CreateGoalDateProps extends IBaseScreenProps<"CreateGoalDate"> {}

const CreateGoalDate: React.FC<CreateGoalDateProps> = ({ navigation }) => {
  const [showDate, setShowDate] = useState(false);
  const [dateHere, setDateHere] = useState<Date | undefined>();
  const { addItemToGoalRequest } = useBoundStore();

  const onChange = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const _date = new Date();
    const currentDate = selectedDate || _date;
    setShowDate(Platform.OS === "ios");
    setDateHere(currentDate);
    addItemToGoalRequest({ date: currentDate.toISOString() });
  };
  const min = dayjs().add(1, "year").toDate();
  const { colors } = useTheme() as { colors: typeof palette };
  return (
    <Page label="Target date " navigation={navigation}>
      <KeyboardAwareScrollView>
        <Box padding={[0, 20]}>
          <TextWrapper
            color="#71879C"
            style={{ marginBottom: 21, marginTop: 30 }}
            fontSize={15}
          >
            Question 3 of 3
          </TextWrapper>
          <Progress value={1} />
          <TextWrapper
            color={colors.textBlack}
            style={{ marginTop: 50 }}
            fontWeight="700"
            fontSize={17}
          >
            When do you want to withdraw?
          </TextWrapper>

          <Box margin={[26, 0]}>
            <TextInputWrapper
              label="Date of Birth"
              editable={false}
              value={dayjs(dateHere || min).format("DD/MM/YYYY")}
              onPressIn={() => setShowDate((s) => !s)}
              rightComponent={
                <TouchableOpacity onPress={() => setShowDate((s) => !s)}>
                  <Icon
                    name="calendar-month"
                    type={IconType.MaterialCommunityIcons}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              }
            />
            {showDate && (
              <Box marginBottom={10}>
                <DateTimePicker
                  value={dateHere || min}
                  mode="date"
                  onChange={onChange}
                  minimumDate={min}
                />
              </Box>
            )}
          </Box>
          <CustomButton
            label="Continue"
            disabled={!dateHere}
            onPress={() => {
              navigation.navigate(SCREENS.CREATE_GOAL_CONFIRM);
            }}
          />
        </Box>
      </KeyboardAwareScrollView>
    </Page>
  );
};

export default CreateGoalDate;
