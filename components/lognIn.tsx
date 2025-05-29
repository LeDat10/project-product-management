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
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { LoginData } from "../services/accountService";
import useStore from "../store/myStore";
import { login } from "../src/services/accountServices";

type LoginScreenNavProp = NavigationProp<RootStackParamList, "login">;

interface Props {
  navigation: LoginScreenNavProp;
}

const LognIn = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = useStore((state) => state.login);
  const loading = useStore((state) => state.loading);
  const error = useStore((state) => state.error);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const clearErrors = useStore((state) => state.clearErrors);

  React.useEffect(() => {
    clearErrors();
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate("account");
    }
  }, [isAuthenticated, navigation]);

  React.useEffect(() => {
    if (error) {
      Alert.alert("Lỗi", error || "Đăng nhập thất bại");
    }
    clearErrors();
  }, [error]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Thông tin không hợp lệ", "Vui lòng không bỏ trống.");
      return;
    }

    const loginData: LoginData = {
      email: email,
      password: password,
    };
    await login(loginData);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/logo.png")}
          resizeMode="contain"
        />
        <Text style={styles.dangnhap}>Đăng Nhập Tài Khoản</Text>
        <Text style={styles.huongdan}>Nhập email và mật khẩu của bạn</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          maxLength={50}
        />

        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          maxLength={30}
          secureTextEntry={true}
        />

        <TouchableOpacity onPress={() => navigation.navigate("forgotpw")}>
          <Text style={styles.quenpass}>Bạn đã quên mật khẩu?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Đăng Nhập</Text>
          )}
        </TouchableOpacity>

        <View style={styles.registerContainer}>
          <Text style={styles.registerText}>Bạn là khách hàng mới?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("register")}>
            <Text style={styles.registerLink}>Đăng Ký</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("menu")}>
          <Text style={styles.homeLink}>Quay lại trang chủ</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  dangnhap: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  huongdan: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    fontSize: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    color: "#333",
  },
  quenpass: {
    fontSize: 13,
    color: "#007bff",
    marginBottom: 20,
    textAlign: "right",
    width: "100%",
    paddingRight: 5,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "green",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  registerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  registerText: {
    color: "#666",
    fontSize: 14,
    marginRight: 5,
  },
  registerLink: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "600",
  },
  homeLink: {
    fontSize: 14,
    color: "#007bff",
    marginTop: 15,
  },
});

export default LognIn;
