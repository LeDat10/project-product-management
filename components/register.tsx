import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Register = () => {
  const navigator: NavigationProp<RootStackParamList> = useNavigation();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [firstname, setFirstname] = useState<string>("");
  const [email, setEmail] = useState<string>("");

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
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigator.navigate("longin")}
        >
          <Text style={styles.text1}>Đăng Ký</Text>
        </TouchableOpacity>
        <View style={styles.rowContainer1}>
          <Text style={styles.row1}>Bạn đã có tài khoản ?</Text>
          <Text
            style={styles.linkText1}
            onPress={() => navigator.navigate("longin")}
          >
            Đăng Nhập
          </Text>
        </View>
        <Text
          style={styles.linkText2}
          onPress={() => navigator.navigate("Home")}
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
