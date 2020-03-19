import React, { useEffect, useState } from "react";
import { Animated, Easing } from "react-native";
import { InterpolatedStyles } from "./Components/ScreenContainer";
import { ScreenRenderer } from "./Components/ScreenRenderer";
import { useBackHandler } from "./hooks/useBackHandler";

export type NavigationProp = {
  navigation: {
    navigate(
      toRoute: string,
      newRouteStack: string[],
      animations?: ScreenAnimations
    ): void;
    routeStack: string[];
  };
};

interface NavigatorProps {
  initialRouteName: string;
  routeMap: Map<string, React.FC<NavigationProp>>;
}

export type NavigatorState = {
  anotherScreen: string | null;
  isOneScreenActive: boolean;
  oneScreen: string | null;
  routeStack: string[];
};

type AnimationFunction = (position: Animated.Value) => InterpolatedStyles;

export type ScreenAnimations = {
  incoming: AnimationFunction;
  outgoing: AnimationFunction;
};

const Navigator: React.FC<NavigatorProps> = ({
  initialRouteName,
  routeMap
}) => {
  const [navigatorState, setNavigatorState] = useState<NavigatorState>({
    anotherScreen: null,
    isOneScreenActive: true,
    oneScreen: initialRouteName,
    routeStack: [initialRouteName]
  });

  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [animatedValue] = useState<Animated.Value>(new Animated.Value(0));
  const [
    screenAnimations,
    setScreenAnimations
  ] = useState<ScreenAnimations | null>(null);

  const handleAnimate = () => {
    animatedValue.setValue(0);
    setIsAnimating(true);
  };

  const handleAnimationEnd = () => {
    setNavigatorState(prevState => {
      const { isOneScreenActive, oneScreen, anotherScreen } = prevState;
      const willOneScreenBeActive = !isOneScreenActive;
      return {
        ...prevState,
        isOneScreenActive: willOneScreenBeActive,
        oneScreen: willOneScreenBeActive ? oneScreen : null,
        anotherScreen: willOneScreenBeActive ? null : anotherScreen
      };
    });
    setIsAnimating(false);
  };

  const handleNavigate = (
    toRoute: string,
    newRouteStack: string[],
    animations?: ScreenAnimations
  ) => {
    if (animations) {
      setScreenAnimations(animations);
    }
    handleAnimate();
    setNavigatorState(prevState => {
      const {
        isOneScreenActive,
        oneScreen,
        anotherScreen,
        routeStack
      } = prevState;
      return {
        ...prevState,
        oneScreen: isOneScreenActive ? oneScreen : toRoute,
        anotherScreen: isOneScreenActive ? toRoute : anotherScreen,
        routeStack: newRouteStack != undefined ? newRouteStack : routeStack
      };
    });
  };

  const handleHardwareBackPress = (): boolean => {
    const { routeStack } = navigatorState;
    if (routeStack.length > 1) {
      const toRoute = routeStack[routeStack.length - 2];
      const newRouteStack = routeStack.slice(0, routeStack.length - 1);
      handleNavigate(toRoute, newRouteStack);
      return true;
    }
    return false;
  };

  useBackHandler(handleHardwareBackPress);

  useEffect(() => {
    if (isAnimating) {
      Animated.timing(animatedValue, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
        toValue: 1,
        useNativeDriver: true
      }).start(handleAnimationEnd);
    }
    return () => {};
  }, [isAnimating]);

  return (
    <ScreenRenderer
      animatedValue={animatedValue}
      animations={screenAnimations}
      isAnimating={isAnimating}
      navigatorState={navigatorState}
      onNavigate={handleNavigate}
      routeMap={routeMap}
    />
  );
};

export default Navigator;
