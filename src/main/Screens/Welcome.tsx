import React from "react";
import { Button, Text, View } from "react-native";
import { NavigationProp } from "../Navigator/Navigator";

const Welcome: React.FunctionComponent<NavigationProp> = ({ navigation }) => {
  Welcome.displayName = "Welcome";
  const handlePress = () => {
    navigation.navigate("Trip", [...navigation.routeStack, "Trip"]);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "blue" }}>
      <Text>Welcome</Text>
      <Button onPress={handlePress} title="Go To Trip" />
    </View>
  );
};

export default Welcome;
