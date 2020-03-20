import { Animated } from "react-native";
import { InterpolatedStyles } from "../Navigator/Components/ScreenContainer";
import { getDimensions } from "../Navigator/Components/screenRendererStyles";

const { width: SCREEN_WIDTH } = getDimensions();

export const minorForward = {
  incoming: leftAndIn,
  outgoing: leftAndOut
};

export const minorBackward = {
  incoming: rightAndIn,
  outgoing: rightAndOut
};

function leftAndOut(position: Animated.Value): InterpolatedStyles {
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

function leftAndIn(position: Animated.Value): InterpolatedStyles {
  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH, 0]
  });
  return { transform: [{ translateX }] };
}

function rightAndOut(position: Animated.Value): InterpolatedStyles {
  const opacity = position.interpolate({
    inputRange: [0, 0.99, 1],
    outputRange: [1, 0, 0]
  });
  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH]
  });
  return { opacity, transform: [{ translateX }] };
}

function rightAndIn(position: Animated.Value): InterpolatedStyles {
  const translateX = position.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_WIDTH * -1, 0]
  });
  return { transform: [{ translateX }] };
}
