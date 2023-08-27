import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useRef, useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { IBaseScreenProps, SCREENS } from "@shared-constants";
import Page from "@shared-components/page/Page";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import Box from "@shared-components/box/Box";
import { palette } from "@theme/themes";
import TextInputWrapper from "@shared-components/text-input/TextInput";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import { Subscription } from "react-hook-form/dist/utils/createSubject";
import CustomButton from "@shared-components/button/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useBoundStore from "store";

interface SignUpProps extends IBaseScreenProps<"SignUp"> {}

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

const schema = yup
  .object({
    email: yup.string().email().required(),
    password: yup
      .string()
      .min(8, "Password must be atleast 8 characters")
      .matches(
        /^(?=.*[a-zA-Z])/,
        "Password must contain at least 8 characters, one alphabetic character",
      )
      .required(),
  })
  .required();

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
  const theme = useTheme();
  const subRef = useRef<Subscription>();
  const colors = theme.colors as typeof palette;
  const [show, setShow] = useState(false);
  const { addItemToRequest } = useBoundStore();
  const { control, handleSubmit, watch, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [formValidations, setFormValidations] = useState({
    length: false,
    characters: false,
    unique: false,
  });

  const validatePasswordFunction = React.useCallback(() => {
    const validatePassword = (values: { password?: string }) => {
      const { password = "" } = values;
      const length = password.length >= 8;
      const characters = /[A-Z]+/.test(password);
      const unique = /[!@#$%^&*?]/.test(password);

      setFormValidations({
        length,
        characters,
        unique,
      });
    };
    const subscription = watch((value) => validatePassword(value));
    subRef.current = subscription;
    return () => {
      subRef.current
        ? subRef.current.unsubscribe()
        : subscription.unsubscribe();
    };
  }, [watch]);

  useFocusEffect(validatePasswordFunction);

  const onSubmit = (values: { email: string; password: string }) => {
    console.log(values);
    addItemToRequest(values);
    navigation.navigate(SCREENS.PERSONAL_INFO);
  };

  return (
    <Page>
      <KeyboardAwareScrollView>
        <Box padding={[0, 20]}>
          <Box margin={[50, 0]}>
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
                  autoCapitalize="none"
                  keyboardType="email-address"
                  inputMode="email"
                  label="Email address"
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
            name="email"
          />

          <Controller
            control={control}
            render={({ field, fieldState }) => (
              <>
                <TextInputWrapper
                  autoCapitalize="none"
                  secureTextEntry={!show}
                  label="Password"
                  rightComponent={(active) => (
                    <TouchableOpacity onPress={() => setShow(!show)}>
                      <Icon
                        name={show ? "eye-off" : "eye"}
                        type={IconType.MaterialCommunityIcons}
                        color={active ? colors.primary : "#71879C"}
                      />
                    </TouchableOpacity>
                  )}
                  onBlur={field.onBlur}
                  onChangeText={field.onChange}
                  value={field.value}
                />
                {fieldState.error && (
                  <View style={Styles.errorText}>
                    <TextWrapper fontSize={12} color={"#c25f94"}>
                      Error: {fieldState.error?.message}{" "}
                    </TextWrapper>
                  </View>
                )}
              </>
            )}
            name="password"
          />
          <Box margin={[10, 0]}>
            <View style={Styles.passwordCheckView}>
              <Box flexDirection="row" alignItems="center" marginBottom={10}>
                <Icon
                  name={
                    formValidations.length
                      ? "check-circle"
                      : "check-circle-outline"
                  }
                  type={IconType.MaterialCommunityIcons}
                  color={formValidations.length ? colors.primary : "#71879C"}
                />

                <TextWrapper
                  style={Styles.mL}
                  color={colors.textBlack}
                  fontSize={12}
                >
                  At least 8 characters
                </TextWrapper>
              </Box>
              <Box flexDirection="row" alignItems="center" marginBottom={10}>
                <Icon
                  name={
                    formValidations.characters
                      ? "check-circle"
                      : "check-circle-outline"
                  }
                  type={IconType.MaterialCommunityIcons}
                  color={
                    formValidations.characters ? colors.primary : "#71879C"
                  }
                />

                <TextWrapper
                  style={Styles.mL}
                  color={colors.textBlack}
                  fontSize={12}
                >
                  One UPPERCASE character
                </TextWrapper>
              </Box>
              <Box flexDirection="row" alignItems="center" marginBottom={10}>
                <Icon
                  name={
                    formValidations.unique
                      ? "check-circle"
                      : "check-circle-outline"
                  }
                  type={IconType.MaterialCommunityIcons}
                  color={formValidations.unique ? colors.primary : "#71879C"}
                />

                <TextWrapper
                  style={Styles.mL}
                  color={colors.textBlack}
                  fontSize={12}
                >
                  {"One unique character (e.g: !@#$%^&*?)"}
                </TextWrapper>
              </Box>
            </View>
          </Box>

          <Box marginBottom={16}>
            <CustomButton
              label="Sign Up"
              disabled={!formState.isValid}
              onPress={handleSubmit(onSubmit)}
            />
          </Box>
        </Box>
      </KeyboardAwareScrollView>
    </Page>
  );
};

export default SignUp;

const Styles = StyleSheet.create({
  mb10: {
    marginBottom: 10,
  },
  errorText: {
    marginBottom: 10,
    marginTop: -2,
  },
  passwordCheckView: {
    marginTop: -5,
    marginBottom: 20,
  },
  mL: {
    marginLeft: 4,
  },
});
