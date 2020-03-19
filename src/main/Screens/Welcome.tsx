import React from "react";
import { Button, Text, View, Animated } from "react-native";
import { NavigationProp } from "../Navigator/Navigator";
import { getDimensions } from "../Navigator/navigatorStyles";
import { InterpolatedStyles } from "../Navigator/Components/ScreenContainer";

const Welcome: React.FunctionComponent<NavigationProp> = ({ navigation }) => {
  Welcome.displayName = "Welcome";
  const handlePress = () => {
    navigation.navigate("Trip", [...navigation.routeStack, "Trip"], {
      incoming: leftAndIn,
      outgoing: leftAndOut
    });
  };
  return (
    <View style={{ flex: 1, backgroundColor: "blue" }}>
      <Text>Welcome</Text>
      <Button onPress={handlePress} title="Go To Trip" />
    </View>
  );
};

export default Welcome;

const { width: SCREEN_WIDTH } = getDimensions();

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
