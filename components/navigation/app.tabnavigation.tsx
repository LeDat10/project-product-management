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
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Vegetable from "../menu/vegatable";
import Bakery from "../menu/bakery";
import Milk from "../menu/milk";
import Meat from "../menu/meat";
import Drink from "../menu/drink";
import Cleaning from "../menu/cleaning";
import Snack from "../menu/snack";
import Care from "../menu/care";
import DetailProduct from "../detail_product";
import Cart from "../cart";
import Search from "../search";
import Order from "../order";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      {/* <Stack.Screen name="Vegetable" component={Vegetable} />
      <Stack.Screen name="Bakery" component={Bakery} />
      <Stack.Screen name="Milk" component={Milk} />
      <Stack.Screen name="Meat" component={Meat} />
      <Stack.Screen name="Drink" component={Drink} />
      <Stack.Screen name="Cleaning" component={Cleaning} />
      <Stack.Screen name="Care" component={Care} />
      <Stack.Screen name="Snack" component={Snack} /> */}
      {/* <Stack.Screen name="detail-product" component={DetailProduct} /> */}
      <Stack.Screen name="account" component={Account} />
    </Stack.Navigator>
  );
}

const TabNavigation = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          title: "Trang chủ",
          headerShown: false,
          tabBarActiveTintColor: "#228654",
          tabBarInactiveTintColor: "black",
          tabBarIcon: ({ focused, size }) => {
            return (
              <Feather
                name="home"
                size={24}
                color={focused ? "#228654" : "black"}
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
          tabBarActiveTintColor: "#228654",
          tabBarInactiveTintColor: "black",
          tabBarIcon: ({ focused, size }) => {
            return (
              <MaterialIcons
                name="people-outline"
                size={27}
                color={focused ? "#228654" : "black"}
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
          tabBarActiveTintColor: "#228654",
          tabBarInactiveTintColor: "black",
          tabBarIcon: ({ focused, size }) => {
            return (
              <Feather
                name="shopping-bag"
                size={24}
                color={focused ? "#228654" : "black"}
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
          tabBarActiveTintColor: "#228654",
          tabBarInactiveTintColor: "black",
          tabBarIcon: ({ focused, size }) => {
            return (
              <Feather
                name="phone"
                size={24}
                color={focused ? "#228654" : "black"}
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
          tabBarActiveTintColor: "#228654",
          tabBarInactiveTintColor: "black",
          tabBarIcon: ({ focused, size }) => {
            return (
              <MaterialCommunityIcons
                name="account-outline"
                size={24}
                color={focused ? "#228654" : "black"}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
