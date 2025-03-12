import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreen from "../home";
import AboutUs from "../aboutus";
import Contact from "../contact";
import AppHeader from "./app.header";

const AppNavigation = () => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Trang chủ", header: () => <AppHeader /> }}
      />
      <Drawer.Screen
        name="About"
        component={AboutUs}
        options={{ title: "Giới thiệu", header: () => <AppHeader /> }}
      />
      <Drawer.Screen
        name="Contact"
        component={Contact}
        options={{ title: "Liên hệ", header: () => <AppHeader /> }}
      />
    </Drawer.Navigator>
  );
};

export default AppNavigation;
