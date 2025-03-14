import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";

const Meat = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  return (
    <View>
      <Text>meat</Text>
    </View>
  );
};

export default Meat;
