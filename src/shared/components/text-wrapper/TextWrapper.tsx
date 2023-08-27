import React from "react";
import RNText, { IRNTextProps } from "@freakycoder/react-native-custom-text";
/**
 * ? Local Imports
 */
import fonts from "@fonts";
import { TextStyle } from "react-native";

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
  const {
    fontFamily = fonts.tomatogrotesk.regular,
    color = "#757575",
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
      color={color}
      {...rest}
    >
      {children}
    </RNText>
  );
};

export default TextWrapper;
