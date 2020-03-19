import React, { useEffect, useState } from "react";
import { Animated, Easing, View } from "react-native";
import ScreenContainer, {
  InterpolatedStyles
} from "./Components/ScreenContainer";
import { useBackHandler } from "./hooks/useBackHandler";
import { navigatorStyles } from "./navigatorStyles";

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

type NavigatorState = {
  anotherScreen: string | null;
  isOneScreenActive: boolean;
  oneScreen: string | null;
  routeStack: string[];
};

type ScreenAnimations = {
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

type AnimationFunction = (position: Animated.Value) => InterpolatedStyles;
interface ScreenRendererProps {
  animatedValue: Animated.Value;
  animations: ScreenAnimations | null;
  isAnimating: boolean;
  navigatorState: NavigatorState;
  onNavigate(toRoute: string, newRouteStack: string[]): void;
  routeMap: Map<string, React.FC<NavigationProp>>;
}

const ScreenRenderer: React.FC<ScreenRendererProps> = ({
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
    <View style={navigatorStyles.outerContainer}>
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
