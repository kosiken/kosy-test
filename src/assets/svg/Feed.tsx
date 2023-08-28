/* eslint-disable max-len */
import React from "react";
import { Path, Svg } from "react-native-svg";

const Feed: React.FC<{
  color: string;
  width?: number | string;
  height?: number | string;
}> = ({ color = "#94A1AD", width = "33", height = "32" }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.0999756 1.5C0.0999756 0.671573 0.771549 0 1.59998 0H20.6C21.4284 0 22.1 0.671573 22.1 1.5V5.5C22.1 6.32843 21.4284 7 20.6 7H1.59998C0.771548 7 0.0999756 6.32843 0.0999756 5.5V1.5ZM0.0999756 11.5C0.0999756 10.6716 0.771549 10 1.59998 10H11.6C12.4284 10 13.1 10.6716 13.1 11.5V20.5C13.1 21.3284 12.4284 22 11.6 22H1.59998C0.771549 22 0.0999756 21.3284 0.0999756 20.5V11.5ZM16.6 10C15.7715 10 15.1 10.6716 15.1 11.5V20.5C15.1 21.3284 15.7715 22 16.6 22H20.6C21.4284 22 22.1 21.3284 22.1 20.5V11.5C22.1 10.6716 21.4284 10 20.6 10H16.6Z"
        fill={color}
      />
    </Svg>
  );
};

export default Feed;
