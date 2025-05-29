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
  Modal,
  ActivityIndicator,
} from "react-native";
import accountService, { ConfirmOTPData, ResetPasswordData } from "../services/accountService";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ForgotPasswordScreen = NavigationProp<RootStackParamList, "forgotpw">;

interface Props {
  navigation: ForgotPasswordScreen;
}

const ForgotPassword = ({ navigation }: Props) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

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
        setOtpModalVisible(true);
      } else {
        Alert.alert(
          "Thông báo", 
          response && response.message 
            ? response.message 
            : "Đã gửi yêu cầu đặt lại mật khẩu. Vui lòng kiểm tra email của bạn."
        );
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOtp = async () => {
    if (!otp || otp.length < 6) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP hợp lệ.");
      return;
    }

    try {
      setIsLoading(true);
      const otpData: ConfirmOTPData = {
        email: email,
        otp: otp
      };
      const result = await accountService.otpPassword(otpData);

      if (result && 'code' in result && result.code === 200) {
        // Đóng modal OTP và chuyển đến modal đặt lại mật khẩu
        setOtpModalVisible(false);

        if ('tokenReset' in result && result.tokenReset) {
          setResetToken(result.tokenReset);
          console.log("Token reset received:", result.tokenReset); // Debug log
        } else {
          console.log("No tokenReset in response:", result); // Debug log
        }
        setPasswordModalVisible(true);
      } else {
        Alert.alert(
          "Lỗi", 
          result && 'message' in result ? result.message : "Xác thực không thành công"
        );
      }
    } catch (error) {
      Alert.alert(
        "Lỗi", 
        error instanceof Error ? error.message : "Đã xảy ra lỗi khi xác thực OTP"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToOtp = () => {
    setPasswordModalVisible(false);
    setOtpModalVisible(true);
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }

    if (!resetToken) {
      Alert.alert("Lỗi", "Phiên xác thực đã hết hạn. Vui lòng thực hiện lại từ đầu.");
      setPasswordModalVisible(false);
      setOtpModalVisible(true);
      return;
    }
    
    console.log("Sending reset password request with token:", resetToken);

    try {
      setIsLoading(true);
      const passwordData: ResetPasswordData = {
        newPassword: newPassword,
        token: resetToken
      };
      console.log("Password data being sent:", passwordData); 
      const result = await accountService.resetPassword(passwordData);
      console.log("Reset password response:", result); 

      if (result && 'code' in result && result.code === 200) {
        setPasswordModalVisible(false);
        setEmail("");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setResetToken("");
        Alert.alert(
          "Thành công",
          "Mật khẩu đã được đặt lại thành công.",
          [
            {
              text: "Đăng nhập ngay",
              onPress: () => navigation.navigate("login")
            }
          ]
        );
      } else {
        const errorMessage = 'message' in result ? result.message : "Đặt lại mật khẩu không thành công";
        if (errorMessage.includes("hết hạn") || errorMessage.includes("expired") || errorMessage.includes("invalid")) {
          Alert.alert(
            "Phiên đã hết hạn",
            "Token xác thực đã hết hạn. Vui lòng thực hiện lại từ đầu.",
            [
              {
                text: "OK",
                onPress: () => {
                  setPasswordModalVisible(false);
                  setOtpModalVisible(false);
                  setResetToken("");
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                }
              }
            ]
          );
        } else {
          Alert.alert("Lỗi", errorMessage);
        }
      }
    } catch (error) {
      console.error("Reset password error:", error); 
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi khi đặt lại mật khẩu";
      if (errorMessage.includes("401") || errorMessage.includes("unauthorized") || errorMessage.includes("expired")) {
        Alert.alert(
          "Phiên đã hết hạn",
          "Token xác thực đã hết hạn. Vui lòng thực hiện lại từ đầu.",
          [
            {
              text: "OK",
              onPress: () => {
                setPasswordModalVisible(false);
                setOtpModalVisible(false);
                setResetToken("");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
              }
            }
          ]
        );
      } else {
        Alert.alert("Lỗi", errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.container}>
          <Image style={styles.logo} source={require("../assets/logo.png")} />
          <Text style={styles.text1}>Đặt lại mật khẩu</Text>
          
          <TextInput
            style={styles.input1}
            placeholder="Nhập email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            textContentType="emailAddress"
            onChangeText={setEmail}
          />
          
          <TouchableOpacity
            style={styles.button}
            onPress={handleForgotPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.text2}>Tiếp theo</Text>
            )}
          </TouchableOpacity>

          {/* OTP Verification Modal */}
          <Modal 
            visible={otpModalVisible} 
            transparent 
            animationType="slide"
            statusBarTranslucent
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Xác thực OTP</Text>
                <Text style={styles.modalSubtitle}>
                  Vui lòng nhập mã OTP đã được gửi đến email của bạn
                </Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="Nhập mã OTP"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={6}
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.confirmButtonText}>Xác nhận</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Reset Password Modal */}
          <Modal
            visible={passwordModalVisible}
            transparent
            animationType="slide"
            statusBarTranslucent
            onShow={() => console.log("Password modal shown, resetToken:", resetToken)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Đặt lại mật khẩu</Text>
                <Text style={styles.modalSubtitle}>
                  Vui lòng nhập mật khẩu mới của bạn
                </Text>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Mật khẩu mới"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                />
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Xác nhận mật khẩu"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={handleBackToOtp}
                  >
                    <Text style={styles.cancelButtonText}>Quay lại</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleResetPassword}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Text style={styles.confirmButtonText}>Đặt lại mật khẩu</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  text1: {
    width: 300,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  input1: {
    width: 300,
    height: 60,
    fontSize: 16,
    borderColor: "#ddd",
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 20,
    color: "#000",
    paddingHorizontal: 15,
  },
  button: {
    width: 143,
    height: 45,
    backgroundColor: "#4CAF50",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  text2: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "white",
    width: "100%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#333",
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
    lineHeight: 22,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 5,
    fontSize: 18,
    fontWeight: "600",
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ForgotPassword;