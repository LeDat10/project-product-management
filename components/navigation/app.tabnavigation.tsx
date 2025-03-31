import { View, Text } from "react-native";
import React from "react";
import HomeScreen from "../home";
import Product from "../product";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Account from "../account";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AboutUs from "../aboutus";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Contact from "../contact";

const TabNavigation = () => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Trang chủ",
          headerShown: false,
          tabBarIcon: ({ focused, size }) => {
            return (
              <Feather
                name="home"
                size={24}
                color={focused ? "#257cda" : "black"}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="About"
        component={AboutUs}
        options={{
          title: "Giới Thiệu",
          headerShown: false,
          tabBarIcon: ({ focused, size }) => {
            return (
              <MaterialIcons
                name="people-outline"
                size={27}
                color={focused ? "#257cda" : "black"}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="product"
        component={Product}
        options={{
          title: "Sản Phẩm",
          headerShown: false,
          tabBarIcon: ({ focused, size }) => {
            return (
              <Feather
                name="shopping-bag"
                size={24}
                color={focused ? "#257cda" : "black"}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Contact"
        component={Contact}
        options={{
          title: "Liên Hệ",
          headerShown: false,
          tabBarIcon: ({ focused, size }) => {
            return (
              <Feather
                name="phone"
                size={24}
                color={focused ? "#257cda" : "black"}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="account"
        component={Account}
        options={{
          title: "Tài Khoản",
          headerShown: false,
          tabBarIcon: ({ focused, size }) => {
            return (
              <MaterialCommunityIcons
                name="account-outline"
                size={24}
                color={focused ? "#257cda" : "black"}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
