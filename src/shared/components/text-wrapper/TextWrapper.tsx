import React from "react";
import RNText, { IRNTextProps } from "@freakycoder/react-native-custom-text";
/**
 * ? Local Imports
 */
import fonts from "@fonts";
import { TextStyle } from "react-native";
import { useTheme } from "@react-navigation/native";

interface ITextWrapperProps extends IRNTextProps {
  color?: string;
  fontFamily?: string;
  children?: React.ReactNode;
  textAlign?: TextStyle["textAlign"];
  fontSize?: TextStyle["fontSize"];
  letterSpacing?: TextStyle["letterSpacing"];
  lineHeight?: TextStyle["lineHeight"];
  fontWeight?: TextStyle["fontWeight"];
}

const TextWrapper: React.FC<ITextWrapperProps> = (props) => {
  const theme = useTheme();
  const {
    fontFamily = fonts.tomatogrotesk.regular,
    color,
    children,
    textAlign,
    fontSize,
    lineHeight,
    fontWeight,
    letterSpacing,
    style,
    ...rest
  } = props;
  return (
    <RNText
      fontFamily={fontFamily}
      style={[
        {
          textAlign,
          fontSize,
          lineHeight,
          letterSpacing,
          fontWeight,
        },
        ...(Array.isArray(style) ? style : [style]),
      ]}
      color={color || theme.colors.text}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default TextWrapper;
