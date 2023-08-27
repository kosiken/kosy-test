import { ImageBackgroundProps, StyleProp, ViewStyle } from "react-native";
import React from "react";
import styled from "styled-components/native";
import {
  backgroundColor,
  BackgroundColorProps,
  FlexboxProps,
  flexbox,
  layout,
  borderRadius,
  border,
  BorderProps,
  LayoutProps,
  margin,
  MarginProps,
  BorderRadiusProps,
} from "styled-system";
import { Debug } from "@utils";

export type BoxProps = BackgroundColorProps &
  Partial<ImageBackgroundProps> &
  FlexboxProps &
  LayoutProps &
  MarginProps &
  BorderRadiusProps &
  BorderProps & {
    margin?: Array<string | number> | string | number;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    padding?: Array<string | number> | string | number;
    imageBackground?: boolean;
  };

const ViewBox = styled.View<BoxProps>`
  ${backgroundColor}
  ${layout}
  ${flexbox}
  ${margin}
  ${borderRadius}
  ${border}
`;

const ViewBoxImage = styled.ImageBackground`
  ${backgroundColor}
  ${layout}
  ${flexbox}
  ${margin}
  ${borderRadius}
  ${border}
`;

const Box: React.FC<BoxProps> = ({
  children,
  margin,
  style,
  padding,
  imageBackground,
  ...props
}) => {
  let marginStyle: StyleProp<ViewStyle> = {};
  let paddingStyle: StyleProp<ViewStyle> = {};
  if (margin) {
    if (!Array.isArray(margin)) {
      marginStyle.margin = margin;
    } else {
      // eslint-disable-next-line prefer-destructuring
      const length = margin.length;
      const [top, right, bottom, left] = margin as Array<string | number>;
      switch (length) {
        case 1:
          marginStyle.margin = top;
          break;
        case 2:
          marginStyle = { marginHorizontal: right, marginVertical: top };
          break;
        case 3:
          marginStyle = {
            marginHorizontal: right,
            marginBottom: bottom,
            marginTop: top,
          };
          break;
        case 4:
          marginStyle = {
            marginRight: right,
            marginLeft: left,
            marginBottom: bottom,
            marginTop: top,
          };
          break;
        default:
          Debug.warn("Invalid margin passed ", margin);
          marginStyle = { margin: 0 };
          break;
      }
    }
  }
  if (padding) {
    if (!Array.isArray(padding)) {
      paddingStyle.padding = padding;
    } else {
      // eslint-disable-next-line prefer-destructuring
      const length = padding.length;
      const [top, right, bottom, left] = padding as Array<string | number>;
      switch (length) {
        case 1:
          paddingStyle.padding = top;
          break;
        case 2:
          paddingStyle = { paddingHorizontal: right, paddingVertical: top };
          break;
        case 3:
          paddingStyle = {
            paddingHorizontal: right,
            paddingBottom: bottom,
            paddingTop: top,
          };
          break;
        case 4:
          paddingStyle = {
            paddingRight: right,
            paddingLeft: left,
            paddingBottom: bottom,
            paddingTop: top,
          };
          break;
        default:
          Debug.warn("Invalid padding passed ", padding);
          paddingStyle = { padding: 0 };
          break;
      }
    }
  }
  if (imageBackground) {
    return (
      <ViewBoxImage
        {...(props as any)}
        style={[marginStyle, paddingStyle, style]}
      >
        {children}
      </ViewBoxImage>
    );
  }
  return (
    <ViewBox {...props} style={[marginStyle, paddingStyle, style]}>
      {children}
    </ViewBox>
  );
};

export default Box;
