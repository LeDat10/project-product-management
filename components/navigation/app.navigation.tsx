import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../home";
import AboutUs from "../aboutus";
import Contact from "../contact";
import AppHeader from "./app.header";
import LognIn from "../lognIn";
import Register from "../register";
import { View } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import Product from "../product";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";

const AppNavigation = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Trang Chủ",
          header: () => <AppHeader />,
          drawerIcon: ({ focused, size }) => (
            <Feather
              name="home"
              size={24}
              color={focused ? "#257cda" : "black"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="About"
        component={AboutUs}
        options={{
          title: "Giới Thiệu",
          header: () => <AppHeader />,
          drawerIcon: ({ focused, size }) => (
            <MaterialIcons
              name="people-outline"
              size={27}
              color={focused ? "#257cda" : "black"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Contact"
        component={Contact}
        options={{
          title: "Liên Hệ",
          header: () => <AppHeader />,
          drawerIcon: ({ focused, size }) => (
            <Feather
              name="phone"
              size={24}
              color={focused ? "#257cda" : "black"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="product"
        component={Product}
        options={{
          title: "Sản phẩm",
          header: () => <AppHeader />,
          drawerIcon: ({ focused, size }) => (
            <Feather
              name="shopping-cart"
              size={24}
              color={focused ? "#257cda" : "black"}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="LognIn"
        component={LognIn}
        options={{ title: "Đăng Nhập", header: () => <AppHeader /> }}
      />
      <Drawer.Screen
        name="Register"
        component={Register}
        options={{ title: "Đăng Ký", header: () => <AppHeader /> }}
      />
    </Drawer.Navigator>
  );
};

export default AppNavigation;
