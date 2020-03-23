import React from "react";
import { Button, Text, View } from "react-native";
import { minorBackward } from "../Animations/screenAnimations";
import { NavigationProp } from "../Navigator/Navigator";

const Trip: React.FunctionComponent<NavigationProp> = ({ navigation }) => {
  const handlePress = () => {
    navigation.navigate("Welcome", {
      newRouteStack: ["Welcome"],
      animations: minorBackward
    });
  };
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>Trip</Text>
      <Button onPress={handlePress} title="Go Back" />
    </View>
  );
};

export default Trip;
