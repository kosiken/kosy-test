/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { IBaseScreenProps, SCREENS } from "@shared-constants";
import Page from "@shared-components/page/Page";
import { useTheme } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import Box from "@shared-components/box/Box";
import { palette } from "@theme/themes";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import TextInputWrapper from "@shared-components/text-input/TextInput";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import CustomButton from "@shared-components/button/Button";
import { formatWithMask } from "react-native-mask-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ModalPicker, {
  Option,
  PickerFunctions,
} from "@shared-components/modal-picker/ModalPicker";
import dayjs from "dayjs";
import useBoundStore from "store";
import Loader from "@shared-components/loading/Loading";
import { AuthSlice } from "store/types";
import riseApi from "@api";
import { from } from "rxjs";
import { NavigationService } from "@nav-local/NavigationService";

interface PersonalInfoProps extends IBaseScreenProps<"PersonalInfo"> {}

// const createStyles = (theme: ExtendedTheme) => {
//     const { colors } = theme;
//     return StyleSheet.create({
//       main: {
//         backgroundColor: colors.primary,
//       },
//       description: {
//         marginTop: 35,
//       },
//     });
//   };

const PHONE_MASK = [
  /\d/,
  /\d/,
  /\d/,
  " ",
  /\d/,
  /\d/,
  /\d/,
  " ",
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

const FLAGS: Record<string, any> = {
  "+234": require("../../assets/images/nigeria-flag.png"),
  "+233": require("../../assets/images/ghana-flag.png"),
  "+254": require("../../assets/images/kenya-flag.png"),
};

const countries: Option[] = [
  {
    label: "Nigeria (+234)",
    value: "+234",
  },
  { label: "Ghana (+233)", value: "+233" },
  { label: "Kenya (+254)", value: "+254" },
];

const schema = yup
  .object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last Name is required"),
    nickName: yup.string(),
    phoneNumber: yup.string(),
    countryCode: yup
      .object({ label: yup.string(), value: yup.string() })
      .required("Contry code is required"),
    dob: yup.string().required("Date of birth is required"),
  })
  .required();

const PersonalInfo: React.FC<PersonalInfoProps> = () => {
  const theme = useTheme();
  const today = new Date();
  const colors = theme.colors as typeof palette;
  const [showDateOfBirth, setShowDateOfBirth] = useState(false);
  const [dob, setDob] = useState<Date | undefined>();
  const modalPickerRef = useRef<PickerFunctions>();
  const { addItemToRequest, signUpData } = useBoundStore();
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      nickName: undefined,
      phoneNumber: "",
      countryCode: countries[0],
      dob: undefined,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (values: any) => {
    addItemToRequest({ ...values, countryCode: values.countryCode.value });
    const data: Required<AuthSlice["signUpData"]> = {
      ...signUpData,
      ...values,
      countryCode: values.countryCode.value,
    };
    setLoading(true);
    const response$ = from(
      riseApi.register(
        {},
        {},
        {
          first_name: data.firstName,
          last_name: data.lastName,
          password: data.password,
          email_address: data.email,
          date_of_birth: dayjs(data.dob).format("YYYY-MM-DD"),
        },
      ),
    );
    response$.subscribe({
      next: (res) => {
        if (res.code === 200 || res.code === 201) {
          Alert.alert("Success", "You have successfully signed up", [
            {
              text: "Continue",
              onPress: () => {
                NavigationService.resetHard(SCREENS.SIGNIN);
              },
            },
          ]);
        } else {
          Alert.alert(
            "Error",
            res.errorData?.message || "Something Went wrong",
          );
        }
      },
      complete: () => {
        setLoading(false);
      },
    });
  };

  const handleSelectItem = useCallback(
    (item: Option) => {
      setValue("countryCode", item);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setValue],
  );

  const openModal = () => {
    modalPickerRef.current?.openPicker();
  };
  const onChange = (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
    const date = new Date();
    const currentDate = selectedDate || date;
    setShowDateOfBirth(Platform.OS === "ios");
    setDob(currentDate);
    setValue("dob", currentDate.toISOString());
  };

  const selected = watch("countryCode");
  const flag = FLAGS[selected.value || "+234"];
  const maxDate = dayjs(today).subtract(18, "years").toDate();

  return (
    <Page>
      <KeyboardAwareScrollView>
        <Box padding={[0, 20]}>
          <Box margin={[50, 0, 0]}>
            <TextWrapper
              style={Styles.mb10}
              fontWeight="500"
              fontSize={20}
              lineHeight={26}
              color={colors.textBlack}
            >
              Create an account
            </TextWrapper>
            <TextWrapper fontSize={16}>
              Start building your dollar-denominated investment portfolio
            </TextWrapper>
          </Box>

          <Controller
            control={control}
            render={({ field, fieldState }) => (
              <>
                <TextInputWrapper
                  label="Legal First Name"
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                />
                {fieldState.error && (
                  <View style={Styles.errorText}>
                    <TextWrapper color={"#c25f94"} fontSize={12}>
                      Error: {fieldState.error?.message}{" "}
                    </TextWrapper>
                  </View>
                )}
              </>
            )}
            name="firstName"
          />

          <Controller
            control={control}
            render={({ field, fieldState }) => (
              <>
                <TextInputWrapper
                  label="Legal Last Name"
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                />
                {fieldState.error && (
                  <View style={Styles.errorText}>
                    <TextWrapper color={"#c25f94"} fontSize={12}>
                      Error: {fieldState.error?.message}{" "}
                    </TextWrapper>
                  </View>
                )}
              </>
            )}
            name="lastName"
          />

          <Controller
            control={control}
            render={({ field, fieldState }) => {
              const { masked } = formatWithMask({
                text: field.value,
                mask: PHONE_MASK,
              });
              return (
                <>
                  <TextInputWrapper
                    leftComponent={
                      <TouchableOpacity onPress={() => openModal()}>
                        <Box
                          flexDirection="row"
                          alignItems="center"
                          padding={[0, 10, 0, 0]}
                        >
                          <Image source={flag} style={Styles.mr4} />
                          <TextWrapper
                            fontSize={16}
                            fontWeight="700"
                            color={colors.textBlack}
                          >
                            {selected.value}
                          </TextWrapper>
                          <Icon
                            size={24}
                            name="chevron-down"
                            type={IconType.MaterialCommunityIcons}
                            color="#94A1AD"
                          />
                        </Box>
                      </TouchableOpacity>
                    }
                    label="Phone number"
                    keyboardType="phone-pad"
                    inputMode="numeric"
                    onBlur={field.onBlur}
                    onChangeText={(t) => field.onChange(t.replace(/\s/g, ""))}
                    value={masked}
                  />
                  {fieldState.error && (
                    <View style={Styles.errorText}>
                      <TextWrapper color={"#c25f94"} fontSize={12}>
                        Error: {fieldState.error?.message}{" "}
                      </TextWrapper>
                    </View>
                  )}
                </>
              );
            }}
            name="phoneNumber"
          />

          <Controller
            control={control}
            render={({ field, fieldState }) => (
              <>
                <TextInputWrapper
                  label="Date of Birth"
                  onBlur={field.onBlur}
                  editable={false}
                  value={dayjs(dob || maxDate).format("DD/MM/YYYY")}
                  onPressIn={() => setShowDateOfBirth((s) => !s)}
                  rightComponent={
                    <TouchableOpacity
                      onPress={() => setShowDateOfBirth((s) => !s)}
                    >
                      <Icon
                        name="calendar-month"
                        type={IconType.MaterialCommunityIcons}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  }
                />
                {fieldState.error && (
                  <View style={Styles.errorText}>
                    <TextWrapper color={"#c25f94"} fontSize={12}>
                      Error: {fieldState.error?.message}{" "}
                    </TextWrapper>
                  </View>
                )}
              </>
            )}
            name="dob"
          />

          {showDateOfBirth && (
            <Box marginBottom={10}>
              <DateTimePicker
                value={dob || maxDate}
                mode="date"
                onChange={onChange}
                maximumDate={maxDate}
              />
            </Box>
          )}

          <Box marginBottom={16}>
            <CustomButton label="Continue" onPress={handleSubmit(onSubmit)} />
          </Box>
        </Box>
      </KeyboardAwareScrollView>
      <ModalPicker
        ref={modalPickerRef}
        label="Select a country"
        data={countries}
        selectItem={handleSelectItem}
        selected={selected as Option}
      />
      {loading && <Loader />}
    </Page>
  );
};

export default PersonalInfo;

const Styles = StyleSheet.create({
  mb10: {
    marginBottom: 10,
  },
  errorText: {
    marginBottom: 10,
    marginTop: -2,
  },
  mr4: {
    marginRight: 4,
  },
});
