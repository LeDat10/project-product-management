import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Modal,
  Button,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import accountService, {
  RegisterData,
  ConfirmOTPData,
} from "../services/accountService";
import useStore from "../store/myStore";

type RegisterScreen = NavigationProp<RootStackParamList, "register">;

interface Props {
  navigation: RegisterScreen;
}

const Register = ({ navigation }: Props) => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
  });
  const [otp, setOtp] = useState("");
  const [otpModalVisible, setOtpModalVisible] = useState(false);

  const { register, loading, error, clearErrors } = useStore((state) => ({
    register: state.register,
    loading: state.loading,
    error: state.error,
    clearErrors: state.clearErrors,
  }));
 
  useEffect(() => {
    clearErrors();
    return () => clearErrors();
  }, [clearErrors]);

  useEffect(() => {
    if (error) {
      Alert.alert("Lỗi", error || "Đăng ký thất bại");
    }
  }, [error]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { username, password, firstname, lastname, email, phone } = form;

    if (!username || !password || !firstname || !lastname || !email || !phone) {
      Alert.alert("Thông tin không hợp lệ", "Vui lòng không bỏ trống.");
      return;
    }

    try {
      const registerData: RegisterData = { ...form };
      const response = await register(registerData);

      if (response?.code === 200) {
        setOtpModalVisible(true);
        Alert.alert(
          "Đăng ký thành công",
          response.message || "Vui lòng kiểm tra email để xác thực.",
          [
            {
              text: "Chuyển đến đăng nhập",
              onPress: () => navigation.navigate("login"),
            },
          ]
        );
      } else if (response) {
        Alert.alert(
          "Đăng ký thất bại",
          response.message || "Đã xảy ra lỗi."
        );
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Không thể kết nối đến server.");
    }
  };

  const handleConfirmOtp = async () => {
    if (!otp) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP");
      return;
    }

    try {
      const data: ConfirmOTPData = { email: form.email, otp };
      const otpResponse = await accountService.confirmOTP(data);

      if (otpResponse?.code === 200) {
        setOtpModalVisible(false);
        Alert.alert("Thành công", otpResponse.message, [
          { text: "Đăng nhập", onPress: () => navigation.navigate("login") },
        ]);
      } else {
        Alert.alert(
          "Thông báo",
          otpResponse.message || "OTP không hợp lệ."
        );
      }
    } catch {
      Alert.alert("Lỗi", "Không thể xác thực email.");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/logo.png")} />
        <Text style={styles.title}>Đăng Ký Tài Khoản</Text>

        <TextInput
          style={styles.input}
          placeholder="Họ"
          value={form.firstname}
          onChangeText={(val) => handleChange("firstname", val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tên"
          value={form.lastname}
          onChangeText={(val) => handleChange("lastname", val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          value={form.username}
          onChangeText={(val) => handleChange("username", val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={form.email}
          onChangeText={(val) => handleChange("email", val)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          keyboardType="numeric"
          maxLength={10}
          value={form.phone}
          onChangeText={(val) => handleChange("phone", val)}
        />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          secureTextEntry
          value={form.password}
          onChangeText={(val) => handleChange("password", val)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Đang xử lý..." : "Đăng Ký"}
          </Text>
        </TouchableOpacity>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        )}

        <Modal
          visible={otpModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setOtpModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Xác thực OTP</Text>
              <Text style={styles.modalDescription}>
                Vui lòng nhập mã OTP được gửi đến email của bạn.
              </Text>
              <TextInput
                style={styles.otpInput}
                keyboardType="numeric"
                placeholder="Mã OTP"
                value={otp}
                onChangeText={setOtp}
              />
              <View style={styles.modalButtons}>
                <Button
                  title="Hủy"
                  onPress={() => setOtpModalVisible(false)}
                  color="#ff4444"
                />
                <Button
                  title="Xác nhận"
                  onPress={handleConfirmOtp}
                  color="#007bff"
                />
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Bạn đã có tài khoản?</Text>
          <Text
            style={styles.link}
            onPress={() => navigation.navigate("login")}
          >
            Đăng Nhập
          </Text>
        </View>
        <Text
          style={styles.backLink}
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
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 180,
    height: 179,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginVertical: 20,
  },
  input: {
    width: "90%",
    height: 48,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f2f2f2",
    marginBottom: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  link: {
    fontSize: 15,
    color: "#0066cc",
    fontWeight: "600",
    marginLeft: 5,
    textDecorationLine: "underline",
  },
  backLink: {
    fontSize: 16,
    color: "#007bff",
    marginVertical: 12,
  },
});

export default Register;
