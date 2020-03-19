import { useEffect } from "react";
import { BackHandler } from "react-native";

export const useBackHandler = (handleBackPress: () => boolean) => {
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackPress
    );

    return () => {
      subscription.remove();
    };
  }, [handleBackPress]);
};
