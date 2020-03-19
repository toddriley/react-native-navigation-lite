import React from "react";
import { Button, Text, View } from "react-native";
import { NavigationProp } from "../Navigator/Navigator";

const Trip: React.FunctionComponent<NavigationProp> = ({ navigation }) => {
  Trip.displayName = "Trip";
  const handlePress = () => {
    navigation.navigate("Welcome", ["Welcome"]);
  };
  return (
    <View style={{ flex: 1, backgroundColor: "red" }}>
      <Text>Trip</Text>
      <Button onPress={handlePress} title="Go To Welcome" />
    </View>
  );
};

export default Trip;
