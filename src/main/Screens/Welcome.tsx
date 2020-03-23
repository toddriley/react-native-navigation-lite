import React from "react";
import { Button, Text, View } from "react-native";
import { minorForward } from "../Animations/screenAnimations";
import { NavigationProp } from "../Navigator/Navigator";

const Welcome: React.FunctionComponent<NavigationProp> = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate("Trip", {
      animations: minorForward
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
