import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
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
  Modal,
  Button,
} from "react-native";
import { RegisterData, ConfirmOTPData } from "../services/accountService";
import useStore from "../store/myStore";

type RegisterScreenNavProp = NavigationProp<RootStackParamList, "register">;

interface Props {
  navigation: RegisterScreenNavProp;
}

const Register = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const register = useStore((state) => state.register);
  const loading = useStore((state) => state.loading);
  const error = useStore((state) => state.error);
  const clearErrors = useStore((state) => state.clearErrors);

  useEffect(() => {
    clearErrors();
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  useEffect(() => {
    if (error) {
      Alert.alert("Lỗi", error || "Đăng ký thất bại");
      clearErrors();
    }
  }, [error]);

  useEffect(() => {
    if (registrationSuccess) {
      setRegisteredEmail(email);
      setOtpModalVisible(true);
    }
  }, [registrationSuccess, email]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleRegister = async () => {
    if (
      !email ||
      !username ||
      !password ||
      !confirmPassword ||
      !firstname ||
      !lastname ||
      !phone
    ) {
      Alert.alert("Thông tin không hợp lệ", "Vui lòng điền đầy đủ thông tin.");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Lỗi", "Email không hợp lệ.");
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert("Lỗi", "Số điện thoại phải có 10 chữ số.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    const registerData: RegisterData = {
      email,
      password,
      username,
      firstname,
      lastname,
      phone,
    };

    const result = await register(registerData);

    if (!result || !("error" in result)) {
      setRegistrationSuccess(true);
    }
  };

  const handleConfirmOtp = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP hợp lệ.");
      return;
    }    try {
      setOtpLoading(true);
      const otpData: ConfirmOTPData = {
        email: registeredEmail,
        otp: otp,
      };

      const accountService = require("../services/accountService").default;
      const result = await accountService.confirmOTP(otpData);

      if (result && !("error" in result)) {
        setOtpModalVisible(false);
        Alert.alert(
          "Xác thực thành công",
          "Tài khoản của bạn đã được xác thực thành công.",
          [
            {
              text: "Đăng nhập ngay",
              onPress: () => navigation.navigate("login"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Lỗi",
          "message" in result ? result.message : "Xác thực không thành công"
        );
      }
    } catch (error) {
      Alert.alert(
        "Lỗi",
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi xác thực OTP"
      );
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Image
          style={styles.logo}
          source={require("../assets/logo.png")}
          resizeMode="contain"
        />
        <Text style={styles.title}>Đăng Ký Tài Khoản</Text>
        <Text style={styles.subtitle}>
          Vui lòng điền đầy đủ thông tin bên dưới
        </Text>

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
          placeholder="Tên đăng nhập"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          maxLength={30}
        />

        <View style={styles.nameContainer}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Họ"
            value={lastname}
            onChangeText={setLastname}
            maxLength={20}
          />

          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Tên"
            value={firstname}
            onChangeText={setFirstname}
            maxLength={20}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          maxLength={10}
        />

        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          maxLength={30}
        />

        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          maxLength={30}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Đăng Ký</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Đã có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("login")}>
            <Text style={styles.loginLink}>Đăng Nhập</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("menu")}>
          <Text style={styles.homeLink}>Quay lại trang chủ</Text>
        </TouchableOpacity>
        
        {/* OTP Verification Modal */}
        <Modal visible={otpModalVisible} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Xác thực OTP</Text>
              <Text style={styles.modalSubtitle}>
                Vui lòng nhập mã OTP đã được gửi đến email của bạn
              </Text>              <TextInput
                style={styles.otpInput}
                placeholder="Nhập mã OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                autoFocus={true}
                textAlign="center"
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setOtpModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.confirmButton]}
                  onPress={handleConfirmOtp}
                >
                  <Text style={styles.confirmButtonText}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    paddingVertical: 30,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
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
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  halfInput: {
    width: "48%",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "green",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },  buttonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  loginText: {
    color: "#666",
    fontSize: 14,
    marginRight: 5,
  },
  loginLink: {
    color: "#007bff",
    fontSize: 14,
    fontWeight: "600",
  },
  homeLink: {
    fontSize: 14,
    color: "#007bff",
    marginTop: 15,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    elevation: 10,
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  modalSubtitle: { 
    fontSize: 16,
    color: "#555",
    marginBottom: 15
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 5,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  modalButton: {
    paddingVertical: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "green",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default Register;
