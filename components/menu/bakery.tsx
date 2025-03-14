import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";

const Bakery = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  return (
    <View>
      <Text>Bánh</Text>
    </View>
  );
};

export default Bakery;
