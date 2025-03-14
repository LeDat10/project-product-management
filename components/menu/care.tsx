import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";

const Care = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  return (
    <View>
      <Text>care</Text>
    </View>
  );
};

export default Care;
