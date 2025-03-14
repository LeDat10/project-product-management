import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";

const Cleaning = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  return (
    <View>
      <Text>cleaning</Text>
    </View>
  );
};

export default Cleaning;
