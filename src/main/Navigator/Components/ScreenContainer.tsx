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
  const transform = isActive
    ? leftAndOut(animatedValue)
    : leftAndIn(animatedValue);

  return (
    <Animated.View
      style={{
        ...screenContainerStyles.view,
        zIndex: isActive ? 1 : 0,
        transform: isAnimating ? [transform] : []
      }}
    >
      {children}
    </Animated.View>
  );
};

export default ScreenContainer;

const { width: SCREEN_WIDTH } = getDimensions();

export function leftAndOut(position: Animated.Value) {
  // const opacity = position.interpolate({
  //   inputRange: [0, 0.99, 1],
  //   outputRange: [1, 0, 0]
  // });
  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH * -1]
  });
  // return { opacity, translateX };
  return { translateX };
}

export function leftAndIn(position: Animated.Value) {
  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH, 0]
  });
  return { translateX };
}
