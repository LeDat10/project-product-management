import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { TIMES_NEW_ROMAN } from "./utils/const";
import { NavigationContainer } from "@react-navigation/native";
import HomeSceen from "./components/home";
import AppNavigation from "./components/navigation/app.navigation";
import "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

const App = () => {
  const [loaded, error] = useFonts({
    // [OPENSANS_REGULAR]: require("./assets/fonts/OpenSans-Regular.ttf"),
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
