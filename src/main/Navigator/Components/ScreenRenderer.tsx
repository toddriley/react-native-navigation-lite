import React from "react";
import { Animated, View } from "react-native";
import {
  NavigationProp,
  NavigatorState,
  ScreenAnimations,
  NavigateOptions
} from "../Navigator";
import ScreenContainer, { InterpolatedStyles } from "./ScreenContainer";
import { screenRendererStyles } from "./screenRendererStyles";

interface ScreenRendererProps {
  animatedValue: Animated.Value;
  animations: ScreenAnimations | null;
  isAnimating: boolean;
  navigatorState: NavigatorState;
  onNavigate(toRoute: string, options: NavigateOptions): void;
  routeMap: Map<string, React.FC<NavigationProp>>;
}

export const ScreenRenderer: React.FC<ScreenRendererProps> = ({
  animatedValue,
  animations,
  onNavigate,
  navigatorState,
  isAnimating,
  routeMap
}) => {
  const {
    oneScreen,
    anotherScreen,
    isOneScreenActive,
    routeStack
  } = navigatorState;
  const oneRoute = oneScreen ? routeMap.get(oneScreen) : null;
  const anotherRoute = anotherScreen ? routeMap.get(anotherScreen) : null;
  const navigationProp: NavigationProp = {
    navigation: { navigate: onNavigate, routeStack }
  };
  let oneScreenStyles: InterpolatedStyles | null = null;
  let anotherScreenStyles: InterpolatedStyles | null = null;
  if (animations && isAnimating) {
    oneScreenStyles = isOneScreenActive
      ? animations.outgoing(animatedValue)
      : animations.incoming(animatedValue);
    anotherScreenStyles = isOneScreenActive
      ? animations.incoming(animatedValue)
      : animations.outgoing(animatedValue);
  }
  return (
    <View style={screenRendererStyles.outerContainer}>
      <ScreenContainer
        interpolatedStyles={oneScreenStyles}
        isActive={isOneScreenActive}
      >
        {oneRoute && oneRoute(navigationProp)}
      </ScreenContainer>
      <ScreenContainer
        interpolatedStyles={anotherScreenStyles}
        isActive={!isOneScreenActive}
      >
        {anotherRoute && anotherRoute(navigationProp)}
      </ScreenContainer>
    </View>
  );
};
