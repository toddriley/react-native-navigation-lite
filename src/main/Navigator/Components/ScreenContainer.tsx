import React from "react";
import { Animated } from "react-native";
import { screenContainerStyles } from "./screenContainerStyles";

interface ScreenContainerProps {
  interpolatedStyles: InterpolatedStyles | null;
  isActive: boolean;
}

const ScreenContainer: React.FunctionComponent<ScreenContainerProps> = ({
  children,
  interpolatedStyles,
  isActive
}) => {
  return (
    <Animated.View
      style={{
        ...screenContainerStyles.view,
        zIndex: isActive ? 1 : 0,
        opacity: interpolatedStyles && interpolatedStyles.opacity,
        transform: interpolatedStyles && interpolatedStyles.transform
      }}
    >
      {children}
    </Animated.View>
  );
};

export default ScreenContainer;

export type InterpolatedStyles = {
  opacity?: Animated.AnimatedInterpolation;
  transform: {
    translateX: Animated.AnimatedInterpolation;
  }[];
};
