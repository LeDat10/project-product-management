import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { LoginData } from "../services/accountService";
import useStore from "../store/myStore";

type LoginScreen = NavigationProp<RootStackParamList, "login">;

interface Props {
  navigation: LoginScreen;
}

const LognIn = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error, isAuthenticated, clearErrors } = useStore(state => ({
    login: state.login,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    clearErrors: state.clearErrors,
  }));

  React.useEffect(() => {
    clearErrors();
    return () => clearErrors();
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
    <ScrollView>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <Text style={styles.dangnhap}>Đăng Nhập Tài Khoản</Text>
        <Text style={styles.huongdan}>Nhập email và mật khẩu của bạn </Text>
        <TextInput
          style={styles.input1}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          maxLength={25}
        />
        <TextInput
          style={styles.input2}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          maxLength={20}
          secureTextEntry={true}
        />

        <Text style={styles.quenpass}
          onPress={() => navigation.navigate("forgotpw")}
        >
          Bạn đã quên mật khẩu?</Text>
        
        <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading}>
          <Text style={styles.text3}>
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator 
            size="small" 
            color="#007bff" 
            style={{marginTop: 10}} 
          />
        )}

        <View style={styles.rowContainer}>
          <Text style={styles.row1}>Bạn là khách hàng mới?</Text>
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate("register")}
          >
            Đăng Ký
          </Text>
        </View>
        <Text
          style={styles.textlink}
          onPress={() => navigation.navigate("Home")}
        >
          Quay lại trang chủ
        </Text>
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
    width: 180,
    height: 179,
    alignSelf: "center",
  },
  dangnhap: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  huongdan: {
    fontSize: 13,
    color: "#000",
    marginTop: 5,
    marginBottom: 10,
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
  input2: {
    width: 300,
    height: 60,
    fontFamily: "Istok",
    borderColor: "#fff",
    backgroundColor: "#e0e0e0",
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 10,
    borderRadius: 15,
  },
  quenpass: {
    fontSize: 13,
    color: "blue",
    marginTop: 5,
    marginBottom: 10,
    textAlign: "center",
  },
  button: {
    width: 143,
    height: 45,
    marginTop: 20,
    backgroundColor: "green",
    borderRadius: 20,
    marginBottom: 20,
  },
  text3: {
    textAlign: "center",
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    paddingTop: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  row1: {
    textAlign: "center",
    color: "black",
    fontSize: 15,
    fontWeight: "600",
    paddingTop: 10,
  },
  linkText: {
    color: "#006FFF",
    fontSize: 15,
    fontWeight: "600",
    paddingTop: 10,
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  textlink: {
    fontSize: 16,
    color: "#007bff",
    marginTop: 12,
    fontStyle: "italic",
  },
});

export default LognIn;
