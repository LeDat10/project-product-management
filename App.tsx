import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { TIMES_NEW_ROMAN } from "./utils/const";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Vegetable from "./components/menu/vegatable";
import Bakery from "./components/menu/bakery";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Snack from "./components/menu/snack";
import Milk from "./components/menu/milk";
import Meat from "./components/menu/meat";
import Drink from "./components/menu/drink";
import Cleaning from "./components/menu/cleaning";
import Care from "./components/menu/care";
import TabNavigation from "./components/navigation/app.tabnavigation";
import AppHeader from "./components/navigation/app.header";
import Cart from "./components/cart";
import LognIn from "./components/lognIn";
import Register from "./components/register";
import Account from "./components/account";
import DetailProduct from "./components/detail_product";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [loaded, error] = useFonts({
    [TIMES_NEW_ROMAN]: require("./assets/fonts/times-new-roman.ttf"),
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  if (!loaded && !error) {
    return null;
  }

  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="menu"
              component={TabNavigation}
              options={{ header: () => <AppHeader /> }}
            />
            <Stack.Screen name="Vegetable" component={Vegetable} />
            <Stack.Screen name="Bakery" component={Bakery} />
            <Stack.Screen name="Milk" component={Milk} />
            <Stack.Screen name="Meat" component={Meat} />
            <Stack.Screen name="Drink" component={Drink} />
            <Stack.Screen name="Cleaning" component={Cleaning} />
            <Stack.Screen name="Care" component={Care} />
            <Stack.Screen name="Snack" component={Snack} />
            <Stack.Screen name="cart" component={Cart} />
            <Stack.Screen name="account" component={Account} />
            <Stack.Screen
              name="login"
              component={LognIn}
              options={{ title: "Đăng Nhập" }}
            />
            <Stack.Screen
              name="register"
              component={Register}
              options={{ title: "Tạo Tài Khoản" }}
            />
            <Stack.Screen
              name="detail-product"
              component={DetailProduct}
              options={{ title: "Chi tiết sản phẩm" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;
