import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { globalStyles } from "../../utils/const";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import React from "react";

const AppHeader = () => {
  const navigation: any = useNavigation();

  const [bgColor, setBgColor] = useState("white");

  const changeColor = () => {
    const newColor = bgColor === "white" ? "white" : "white";
    setBgColor(newColor);
  };

  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <MaterialIcons
          name="menu"
          size={35}
          color="black"
          onPress={() => {
            navigation.openDrawer();
          }}
        />
      </View>

      <TouchableOpacity
        style={[styles.headerText, { backgroundColor: bgColor }]}
        onPress={() => {
          navigation.navigate("Home");
          changeColor();
        }}
      >
        <Text style={styles.headerText1}>Temp</Text>
        <Text style={styles.headerText2}>i</Text>
      </TouchableOpacity>

      <View style={[styles.logo, { backgroundColor: bgColor }]}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Home");
            changeColor();
          }}
        >
          <Image
            style={{ height: 50, width: 50 }}
            source={require("../../assets/logo.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderWidth: 1,
    // borderColor: "red",
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 5,
    paddingVertical: 5,
    alignItems: "stretch",
    marginTop: 20,
    flexWrap: "nowrap",
  },

  headerText: {
    flexDirection: "row",
    flexGrow: 6,
    // borderWidth: 1,
    // borderColor: "red",
  },

  headerText1: {
    flex: 2,
    textAlign: "right",
    fontSize: 35,
    fontWeight: "900",
    // borderWidth: 1,
    // borderColor: "red",
  },

  headerText2: {
    flex: 1,
    textAlign: "left",
    fontSize: 35,
    color: "#6C03FF",
    fontWeight: "900",
    // borderWidth: 1,
    // borderColor: "red",
  },

  logo: {
    alignItems: "flex-end",
    flexGrow: 1,
    // borderWidth: 1,
    // borderColor: "red",
  },

  icon: {
    // borderWidth: 1,
    // borderColor: "red",
    flexGrow: 1,
    alignItems: "flex-start",
    paddingTop: 5,
  },
});

export default AppHeader;
