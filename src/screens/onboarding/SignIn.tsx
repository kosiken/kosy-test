import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { IBaseScreenProps, SCREENS } from "@shared-constants";
import Page from "@shared-components/page/Page";
import { useTheme } from "@react-navigation/native";
import { yupResolver } from "@hookform/resolvers/yup";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import Box from "@shared-components/box/Box";
import { palette } from "@theme/themes";
import TextInputWrapper from "@shared-components/text-input/TextInput";
import Icon, { IconType } from "react-native-dynamic-vector-icons";
import CustomButton from "@shared-components/button/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import useBoundStore from "store";
import { NavigationService } from "@nav-local/NavigationService";

interface SignUpProps extends IBaseScreenProps<"SignIn"> {}

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

const SignIn: React.FC<SignUpProps> = () => {
  const theme = useTheme();

  const colors = theme.colors as typeof palette;
  const [show, setShow] = useState(false);
  const { addItemToRequest } = useBoundStore();
  const { control, handleSubmit, formState } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: { email: string; password: string }) => {
    console.log(values);
    addItemToRequest(values);
    NavigationService.resetHard(SCREENS.SET_PIN);
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
              Welcome back
            </TextWrapper>
            <TextWrapper fontSize={16}>
              Let’s get you logged in to get back to building your
              dollar-denominated investment portfolio.
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

          <Box marginBottom={16} marginTop={16}>
            <CustomButton
              label="Sign In"
              disabled={!formState.isValid}
              onPress={handleSubmit(onSubmit)}
            />
          </Box>
        </Box>
      </KeyboardAwareScrollView>
    </Page>
  );
};

export default SignIn;

const Styles = StyleSheet.create({
  mb10: {
    marginBottom: 10,
  },
  errorText: {
    marginBottom: 10,
    marginTop: -2,
  },
});
