import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import forgotPassword from "../services/accountService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import accountService from "../services/accountService";

type ForgotPasswordScreen = NavigationProp<RootStackParamList, "forgotpw">;

interface Props {
  navigation: ForgotPasswordScreen;
}

const ForgotPassword = ({ navigation }: Props) => {

  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Thông tin không hợp lệ. Vui lòng không bỏ trống.");
      return;
    }
    const isValidEmail = (email: string) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
    if (!isValidEmail(email)) {
      Alert.alert("Email không hợp lệ. Vui lòng nhập đúng định dạng.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await accountService.forgotPassword(email);
      if (response && response.code === 200) {
        Alert.alert(
          "Thành công",
          response.message || "Đã gửi email đặt lại mật khẩu!"
        );
        navigation.navigate("login");
      } else {
        Alert.alert("Lỗi", response.message || "Có lỗi xảy ra!");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <Text style={styles.text1}> Đặt lại mật khẩu  </Text>
        <TextInput
          style={styles.input1}
          placeholder="Nhập email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          textContentType="emailAddress"
          onChangeText={setEmail}>
        </TextInput>
        <TouchableOpacity 
          style={styles.button}
          onPress={handleForgotPassword}>
          <Text style={styles.text2}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    color: "#000",
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  text1: {
    width: 300,
    height: 50,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  input1: {
    width: 300,
    height: 60,
    fontFamily: "Istok",
    fontSize: 16,
    borderColor: "#fff",
    backgroundColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 0.5,
    color: "#000",
    
  },
  button: {
    width: 143,
    height: 45,
    marginTop: 20,
    backgroundColor: "green",
    borderRadius: 20,
    marginBottom: 20,
  },
  text2:{
    textAlign: "center",
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    paddingTop: 10,
  },
});

export default ForgotPassword;