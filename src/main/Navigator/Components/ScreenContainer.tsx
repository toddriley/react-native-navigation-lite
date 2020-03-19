import React from "react";
import { View } from "react-native";
import { screenContainerStyles } from "./screenContainerStyles";

interface ScreenContainerProps {
  zIndex?: number;
}

const ScreenContainer: React.FunctionComponent<ScreenContainerProps> = ({
  children,
  zIndex
}) => {
  return (
    <View style={{ ...screenContainerStyles.view, zIndex }}>{children}</View>
  );
};

export default ScreenContainer;
