import React from "react";
import { Animated, View } from "react-native";
import { NavigationProp, NavigatorState, ScreenAnimations } from "../Navigator";
import ScreenContainer from "./ScreenContainer";
import { screenRendererStyles } from "./screenRendererStyles";

interface ScreenRendererProps {
  animatedValue: Animated.Value;
  animations: ScreenAnimations | null;
  isAnimating: boolean;
  navigatorState: NavigatorState;
  onNavigate(toRoute: string, newRouteStack: string[]): void;
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
  return (
    <View style={screenRendererStyles.outerContainer}>
      <ScreenContainer
        interpolatedStyles={
          isOneScreenActive && isAnimating && animations
            ? animations.outgoing(animatedValue)
            : null
        }
        isActive={isOneScreenActive}
      >
        {oneRoute && oneRoute(navigationProp)}
      </ScreenContainer>
      <ScreenContainer
        interpolatedStyles={
          isOneScreenActive && isAnimating && animations
            ? animations.incoming(animatedValue)
            : null
        }
        isActive={!isOneScreenActive}
      >
        {anotherRoute && anotherRoute(navigationProp)}
      </ScreenContainer>
    </View>
  );
};
