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
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import accountService ,{RegisterData , UserResponse}from "../services/accountService";

type RegisterScreen = NavigationProp<RootStackParamList, "register">;

interface Props {
  navigation: RegisterScreen;
}

const Register = ({ navigation }: Props) => {
  
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isLoading , setisLoading] = useState(false); 

  const handleRegister = async () => {
    if (!username || !password || !lastname || !firstname || !email || !phone) {
      Alert.alert("Thông tin không hợp lệ. Vui lòng không bỏ trống.");
      return;
    }
    try {
      const registerData: RegisterData = {
        email: email,
        password: password,
        username: username,
        firstname: firstname,
        lastname: lastname,
        phone: phone,
      };

      const response = await accountService.register(registerData);

      if (response && (response as UserResponse).code === 200) {
        Alert.alert(
          "Đăng ký thành công",
          (response as UserResponse).message || "Vui lòng kiểm tra email để xác thực.",
          [
            {
              text: "OK",
              onPress: () => navigation.navigate("login"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Đăng ký thất bại",
          (response as any).message || "Có lỗi xảy ra khi đăng ký."
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      Alert.alert(
        "Lỗi",
        error.message || "Không thể kết nối đến server. Vui lòng thử lại."
      );
    } finally {
      setisLoading(false);
    }
  };
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <Text style={styles.slogan}>Đăng Ký Tài Khoản</Text>
        <TextInput
          style={styles.input}
          placeholder="Họ"
          maxLength={25}
          value={firstname}
          onChangeText={setFirstname}
        />
        <TextInput
          style={styles.input}
          placeholder="Tên"
          value={lastname}
          onChangeText={setLastname}
        />
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          maxLength={25}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.text1}>Đăng Ký</Text>
        </TouchableOpacity>

        <View style={styles.rowContainer1}>
          <Text style={styles.row1}>Bạn đã có tài khoản ?</Text>
          <Text
            style={styles.linkText1}
            onPress={() => navigation.navigate("login")}
          >
            Đăng Nhập
          </Text>
        </View>
        <Text
          style={styles.linkText2}
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
    color: "#fff",
  },
  logo: {
    width: 180,
    height: 179,
    alignSelf: "center",
  },
  slogan: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 1,
    fontSize: 16,
    borderColor: "#fff",
    backgroundColor: "#e0e0e0",
    borderRadius: 15,
    marginBottom: 10,
    color: "#000",
    paddingHorizontal: 10,
  },
  button: {
    width: 143,
    height: 45,
    backgroundColor: "green",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  text1: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  rowContainer1: {
    flexDirection: "row",
    marginTop: 20,
  },
  row1: {
    fontSize: 16,
    color: "#000",
  },
  linkText1: {
    fontSize: 16,
    color: "#007bff",
    marginLeft: 5,
  },
  linkText2: {
    fontSize: 16,
    color: "#007bff",
    marginTop: 12,
  },
});

export default Register;
