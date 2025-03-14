import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text } from "react-native";

const Contact = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  return (
    <View>
      <Text>contact</Text>
    </View>
  );
};

export default Contact;
