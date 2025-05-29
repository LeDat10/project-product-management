import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { TIMES_NEW_ROMAN } from "./utils/request";
import { NavigationContainer } from "@react-navigation/native";
import "react-native-gesture-handler";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Vegetable from "./components/menu/vegatable";
import Bakery from "./components/menu/bakery";
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
import ForgotPassword from "./components/forgotpw";
import Search from "./components/search";
import Order from "./components/order";
import Bank from "./components/bank";

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
            <Stack.Screen
              name="Vegetable"
              component={Vegetable}
              options={{ title: "Rau Củ Quả" }}
            />
            <Stack.Screen
              name="Bakery"
              component={Bakery}
              options={{ title: "Các Loại Bánh" }}
            />
            <Stack.Screen
              name="Milk"
              component={Milk}
              options={{ title: "Trứng và Sữa" }}
            />
            <Stack.Screen
              name="Meat"
              component={Meat}
              options={{ title: "Các Loại thịt" }}
            />
            <Stack.Screen
              name="Drink"
              component={Drink}
              options={{ title: "Đồ Uống" }}
            />
            <Stack.Screen
              name="Cleaning"
              component={Cleaning}
              options={{ title: "Dụng Cụ Vệ Sinh" }}
            />
            <Stack.Screen
              name="Care"
              component={Care}
              options={{ title: "Hóa Mỹ Phẩm" }}
            />
            <Stack.Screen
              name="Snack"
              component={Snack}
              options={{ title: "Đồ Ăn Vặt" }}
            />
            {/* <Stack.Screen name="account" component={Account} /> */}
            <Stack.Screen
              name="cart"
              component={Cart}
              options={{ title: "Giỏ Hàng" }}
            />
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
              name="forgotpw"
              component={ForgotPassword}
              options={{ title: "Quên mật khẩu" }}
            />
            <Stack.Screen
              name="detail-product"
              component={DetailProduct}
              options={{ title: "Chi tiết sản phẩm" }}
            />
            <Stack.Screen
              name="search"
              component={Search}
              options={{ title: "Tìm kiếm" }}
            />
            <Stack.Screen
              name="order"
              component={Order}
              options={{ title: "Đơn Hàng" }}
            />
            <Stack.Screen
              name="bank"
              component={Bank}
              options={{ title: "Thanh toán" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;
