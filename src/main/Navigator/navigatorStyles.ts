import { Dimensions, StyleSheet } from "react-native";

const window = Dimensions.get("window");
const STATUS_BAR_HEIGHT = 24;
const WIDTH = window.width;
const HEIGHT = window.height - STATUS_BAR_HEIGHT;

export const getDimensions = () => ({
  width: WIDTH,
  height: HEIGHT
});

export const navigatorStyles = StyleSheet.create({
  outerContainer: {
    width: WIDTH,
    height: HEIGHT,
    zIndex: 1
  }
});
