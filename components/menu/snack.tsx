import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";

const Snack = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  return (
    <View>
      <Text>Snack</Text>
    </View>
  );
};

export default Snack;
