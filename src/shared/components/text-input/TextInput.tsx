/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-native/no-unused-styles */
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from "react-native";
import { ExtendedTheme, useTheme } from "@react-navigation/native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import Box from "@shared-components/box/Box";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";
import fonts from "@fonts";

type ComponentFunction = (active: boolean) => React.ReactNode;

type CustomTextInputProps = TextInputProps & {
  leftComponent?: React.JSX.Element | ComponentFunction;
  rightComponent?: React.JSX.Element | ComponentFunction;
  label?: string;
  disabled?: boolean;
};
const createStyles = (theme: ExtendedTheme, active = false) => {
  const { colors } = theme;
  return StyleSheet.create({
    main: {
      borderColor: active ? colors.primary : "#E1E8ED",
      borderRadius: 5,
      borderWidth: 1.5,
    },
    label: {
      backgroundColor: colors.background,
      padding: 5,
    },
  });
};

const TextInputWrapper: React.FC<CustomTextInputProps> = ({
  label,
  rightComponent,
  leftComponent,
  style,
  disabled = false,
  onFocus,
  onBlur,
  editable,

  ...props
}) => {
  const theme = useTheme();
  const [active, setActive] = useState(false);

  const ref = useRef<TextInput>();

  const styles = useMemo(() => createStyles(theme, active), [theme, active]);
  const renderRight = useCallback(() => {
    if (rightComponent) {
      if (typeof rightComponent === "function") {
        return rightComponent(active);
      }
      return rightComponent;
    }
    return <View />;
  }, [active, rightComponent]);

  const renderLeft = useCallback(() => {
    if (leftComponent) {
      if (typeof leftComponent === "function") {
        return leftComponent(active);
      }
      return leftComponent;
    }
    return <View />;
  }, [active, leftComponent]);

  const focusChanged = (
    focusType: "blur" | "focus",
    e: NativeSyntheticEvent<TextInputFocusEventData>,
  ) => {
    const isFocus = focusType === "focus";
    setActive(isFocus);
    if (isFocus && onFocus && typeof onFocus === "function") {
      onFocus(e);
    } else if (onBlur && typeof onBlur === "function") {
      onBlur(e);
    }
  };

  const placeholder2 = !active ? label : "";
  const isEditable = editable !== undefined ? editable : !disabled;

  return (
    <Box
      style={{ position: "relative", opacity: disabled ? 0.3 : 1 }}
      margin={[10, 0]}
    >
      <Box
        style={styles.main}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        height={55}
        padding={[0, 16]}
      >
        {renderLeft()}
        <TextInput
          {...props}
          placeholderTextColor={theme.colors.textBlack}
          placeholder={props.placeholder || placeholder2}
          ref={ref as any}
          editable={isEditable}
          style={[
            {
              flex: 1,
              fontFamily: fonts.dmsans.regular,
              fontWeight: "700",
              color: theme.colors.textBlack,
              fontSize: 16,
            },
            ...(Array.isArray(style) ? style : [style]),
          ]}
          onFocus={focusChanged.bind(null, "focus")}
          onBlur={focusChanged.bind(null, "blur")}
        />
        {renderRight()}
      </Box>
      {active && !!label && (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            position: "absolute",
            top: -10,
            left: 10,
          }}
        >
          <View style={styles.label}>
            <TextWrapper
              color={theme.colors.primary}
              fontSize={10}
              fontWeight="700"
            >
              {label}
            </TextWrapper>
          </View>
        </View>
      )}
    </Box>
  );
};

export default TextInputWrapper;
