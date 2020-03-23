import { Animated } from "react-native";

export type NavigateOptions = {
  newRouteStack?: string[];
  animations?: ScreenAnimations;
};

export type NavigationProp = {
  navigation: {
    navigate(toRoute: string, options: NavigateOptions): void;
    routeStack: string[];
  };
};

export interface NavigatorProps {
  initialRouteName: string;
  routeMap: Map<string, React.FC<NavigationProp>>;
}

export type NavigatorState = {
  anotherScreen: string | null;
  isAnimating: boolean;
  isOneScreenActive: boolean;
  oneScreen: string | null;
  routeStack: string[];
};

export type AnimationFunction = (
  position: Animated.Value
) => InterpolatedStyles;

export type ScreenAnimations = {
  incoming: AnimationFunction;
  outgoing: AnimationFunction;
};

export type InterpolatedStyles = {
  opacity?: Animated.AnimatedInterpolation;
  transform: {
    translateX: Animated.AnimatedInterpolation;
  }[];
};
