import React, { useEffect, useState } from "react";
import { Animated, Easing } from "react-native";
import { InterpolatedStyles } from "./Components/ScreenContainer";
import { ScreenRenderer } from "./Components/ScreenRenderer";
import { useBackHandler } from "./hooks/useBackHandler";
import { minorBackward } from "../Animations/screenAnimations";

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

interface NavigatorProps {
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
    isAnimating: false,
    isOneScreenActive: true,
    oneScreen: initialRouteName,
    routeStack: [initialRouteName]
  });

  const [animatedValue] = useState<Animated.Value>(new Animated.Value(0));
  const [
    screenAnimations,
    setScreenAnimations
  ] = useState<ScreenAnimations | null>(null);

  const startAnimation = (toRoute: string, options?: NavigateOptions) => {
    setupScreensForAnimation(toRoute, options && options.newRouteStack);
    animatedValue.setValue(0);
  };

  const handleAnimationEnd = () => {
    finalizeScreensAfterAnimation();
  };

  const handleNavigate = (toRoute: string, options?: NavigateOptions) => {
    if (options && options.animations) {
      setScreenAnimations(options.animations);
      startAnimation(toRoute, options);
    } else {
      !!screenAnimations && setScreenAnimations(null);
      swapScreensNow(toRoute, options && options.newRouteStack);
    }
  };

  const swapScreensNow = (toRoute: string, newRouteStack?: string[]) => {
    setNavigatorState(prevState => {
      const { isOneScreenActive, routeStack } = prevState;
      return {
        ...prevState,
        oneScreen: isOneScreenActive ? null : toRoute,
        anotherScreen: isOneScreenActive ? toRoute : null,
        isOneScreenActive: !isOneScreenActive,
        routeStack: newRouteStack ? newRouteStack : [...routeStack, toRoute]
      };
    });
  };

  const setupScreensForAnimation = (
    toRoute: string,
    newRouteStack?: string[]
  ) => {
    setNavigatorState(prevState => {
      const {
        anotherScreen,
        isOneScreenActive,
        oneScreen,
        routeStack
      } = prevState;

      return {
        ...prevState,
        oneScreen: isOneScreenActive ? oneScreen : toRoute,
        anotherScreen: isOneScreenActive ? toRoute : anotherScreen,
        isAnimating: true,
        routeStack: newRouteStack ? newRouteStack : [...routeStack, toRoute]
      };
    });
  };

  const finalizeScreensAfterAnimation = () => {
    setNavigatorState(prevState => {
      const { anotherScreen, isOneScreenActive, oneScreen } = prevState;
      const willOneScreenBeActive = !isOneScreenActive;
      return {
        ...prevState,
        anotherScreen: willOneScreenBeActive ? null : anotherScreen,
        isAnimating: false,
        isOneScreenActive: willOneScreenBeActive,
        oneScreen: willOneScreenBeActive ? oneScreen : null
      };
    });
  };

  const handleHardwareBackPress = (): boolean => {
    const { routeStack } = navigatorState;
    if (routeStack.length > 1) {
      const toRoute = routeStack[routeStack.length - 2];
      const newRouteStack = routeStack.slice(0, routeStack.length - 1);
      handleNavigate(toRoute, { newRouteStack, animations: minorBackward });
      return true;
    }
    return false;
  };

  useBackHandler(handleHardwareBackPress);

  const { isAnimating } = navigatorState;
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

  console.log(navigatorState);
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
