import React, { useState } from "react";
import { View } from "react-native";
import ScreenContainer from "./Components/ScreenContainer";
import { navigatorStyles } from "./navigatorStyles";
import { useBackHandler } from "./hooks/useBackHandler";

export type NavigationProp = {
  navigation: {
    navigate(toRoute: string, newRouteStack: string[]): void;
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

  const handleNavigate = (toRoute: string, newRouteStack: string[]) => {
    setNavigatorState(
      ({ isOneScreenActive, oneScreen, anotherScreen, routeStack }) => {
        return {
          oneScreen: isOneScreenActive ? oneScreen : toRoute,
          anotherScreen: isOneScreenActive ? toRoute : anotherScreen,
          isOneScreenActive: !isOneScreenActive,
          routeStack: newRouteStack != undefined ? newRouteStack : routeStack
        };
      }
    );
  };

  const handleHardwareBackPress = (): boolean => {
    const { routeStack } = navigatorState;
    if (routeStack.length > 1) {
      const toRoute = routeStack[routeStack.length - 2];
      const newRouteStack = routeStack.slice(0, routeStack.length - 1);
      console.log(toRoute);
      console.log(newRouteStack);
      handleNavigate(toRoute, newRouteStack);
      return true;
    }
    return false;
  };

  useBackHandler(handleHardwareBackPress);

  return (
    <ScreenRenderer
      onNavigate={handleNavigate}
      navigatorState={navigatorState}
      routeMap={routeMap}
    />
  );
};

export default Navigator;

interface ScreenRendererProps {
  onNavigate(toRoute: string, newRouteStack: string[]): void;
  navigatorState: NavigatorState;
  routeMap: Map<string, React.FC<NavigationProp>>;
}

const ScreenRenderer: React.FC<ScreenRendererProps> = ({
  onNavigate,
  navigatorState,
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
      <ScreenContainer zIndex={isOneScreenActive ? 1 : 0}>
        {oneRoute && oneRoute(navigationProp)}
      </ScreenContainer>
      <ScreenContainer zIndex={isOneScreenActive ? 0 : 1}>
        {anotherRoute && anotherRoute(navigationProp)}
      </ScreenContainer>
    </View>
  );
};
