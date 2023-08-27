import { View } from "react-native";
import styled from "styled-components/native";
import {
  layout,
  LayoutProps,
  margin,
  MarginProps,
  variant,
} from "styled-system";
import { ExtendedTheme, useTheme } from "@react-navigation/native";
import React from "react";
import RNBounceable, {
  IRNBounceableProps,
} from "@freakycoder/react-native-bounceable";
import TextWrapper from "@shared-components/text-wrapper/TextWrapper";

type ComponentFunction = () => React.ReactNode;

type CustomButtonProps = IRNBounceableProps &
  LayoutProps &
  MarginProps & {
    backgroundColor?: string;
    leftComponent?: React.JSX.Element | ComponentFunction;
    rightComponent?: React.JSX.Element | ComponentFunction;
    label?: string;
    textColor?: string;
    theme?: ExtendedTheme;
    variant?: "secondary" | "primary";
    width?: number | string;
    disabled?: boolean;
  };

type ViewButtonProps = Pick<
  CustomButtonProps,
  "variant" | "theme" | "backgroundColor" | "width" | "disabled"
>;
const ViewBoxButton = styled.View<ViewButtonProps>`
  ${layout}
  ${margin}
  flex-direction: row;
  width: ${({ width }) => `${width};`};
  background-color: ${({ backgroundColor }) => `${backgroundColor};`};
  padding: 16px;
  opacity: ${({ disabled }) => (disabled ? "0.3;" : "1;")};
  align-items: center;
  justify-content: center;
  ${({ theme }) => {
    return variant({
      prop: "variant",
      variants: {
        primary: {
          backgroundColor: theme.colors.primary,
        },
        secondary: {
          backgroundColor: "#71879C1A",
        },
      },
    });
  }}
`;
const CustomButton: React.FC<CustomButtonProps> = ({
  style,
  onPress,
  textColor,
  label,
  variant,
  backgroundColor,
  rightComponent,
  leftComponent,
  disabled,
}) => {
  const theme = useTheme();
  const renderRight = () => {
    if (rightComponent) {
      if (typeof rightComponent === "function") {
        return rightComponent();
      }
      return rightComponent;
    }
    return <View />;
  };

  const renderLeft = () => {
    if (leftComponent) {
      if (typeof leftComponent === "function") {
        return leftComponent();
      }
      return leftComponent;
    }
    return <View />;
  };
  return (
    <RNBounceable onPress={onPress} disabled={disabled}>
      <ViewBoxButton
        backgroundColor={backgroundColor}
        variant={variant || "secondary"}
        theme={theme}
        style={style}
        disabled={disabled}
      >
        {renderLeft()}
        <TextWrapper
          textAlign="center"
          style={{ flex: 1 }}
          color={
            textColor ||
            (variant === "primary" ? theme.colors.white : theme.colors.primary)
          }
        >
          {label}
        </TextWrapper>
        {renderRight()}
      </ViewBoxButton>
    </RNBounceable>
  );
};

CustomButton.defaultProps = {
  label: "",
  variant: "primary",
  width: "100%",
};

export default CustomButton;
