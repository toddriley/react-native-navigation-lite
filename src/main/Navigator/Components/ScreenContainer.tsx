import React from "react";
import { Animated, Text } from "react-native";
import { getDimensions } from "../navigatorStyles";
import { screenContainerStyles } from "./screenContainerStyles";

interface ScreenContainerProps {
  animatedValue: Animated.Value;
  isAnimating: boolean;
  isActive: boolean;
}

const ScreenContainer: React.FunctionComponent<ScreenContainerProps> = ({
  animatedValue,
  children,
  isAnimating,
  isActive
}) => {
  const interpolatedStyles = isActive
    ? leftAndOut(animatedValue)
    : leftAndIn(animatedValue);

  return (
    <Animated.View
      style={{
        ...screenContainerStyles.view,
        zIndex: isActive ? 1 : 0,
        opacity: isAnimating ? interpolatedStyles.opacity : undefined,
        transform: isAnimating ? interpolatedStyles.transform : []
      }}
    >
      {children}
    </Animated.View>
  );
};

export default ScreenContainer;

const { width: SCREEN_WIDTH } = getDimensions();

type InterpolatedStyles = {
  opacity?: Animated.AnimatedInterpolation;
  transform: {
    translateX: Animated.AnimatedInterpolation;
  }[];
};

export function leftAndOut(position: Animated.Value): InterpolatedStyles {
  const opacity = position.interpolate({
    inputRange: [0, 0.99, 1],
    outputRange: [1, 0, 0]
  });
  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH * -1]
  });
  return { opacity, transform: [{ translateX }] };
}

export function leftAndIn(position: Animated.Value): InterpolatedStyles {
  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH, 0]
  });
  return { transform: [{ translateX }] };
}
