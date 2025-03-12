import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";

const HomeScreen = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  return (
    <View style={{ alignItems: "center" }}>
      <Text>Home</Text>
      <View>
        <Button title="About Us" onPress={() => navigation.navigate("About")} />
      </View>
    </View>
  );
};

export default HomeScreen;
