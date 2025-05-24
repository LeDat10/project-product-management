import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import useStore from "../store/myStore";
import { getUserInfo, getCachedUserInfo } from "../helper/getToken";

type RootStackParamList = {
  login: undefined;
  register: undefined;
  menu: undefined;
  cart: undefined;
  forgotpw: undefined;
};

const Account = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const { user, logout, isAuthenticated, fetchCart } = useStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    phone: "",
  });
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchUserInfo();
    }
  }, [isAuthenticated, fetchCart]);

  // Định nghĩa interface cho thông tin người dùng
  interface UserInfo {
    _id?: string;
    email?: string;
    fullName?: string;
    phone?: string;
    status?: string;
    [key: string]: any;
  }

  // Hàm để lấy thông tin người dùng từ API
  const fetchUserInfo = async () => {
    if (!isAuthenticated) return;

    setLoadingUser(true);
    // console.log("Bắt đầu lấy thông tin người dùng...");
    try {
      // Kiểm tra thông tin cache trước
      const cachedUser = await getCachedUserInfo();
      if (cachedUser) {
        // console.log("Đã lấy thông tin người dùng từ cache:", cachedUser);
        if (cachedUser.user) {
          // Nếu dữ liệu người dùng nằm trong thuộc tính user (phù hợp với cấu trúc API thực tế)
          setUserInfo(cachedUser.user);
          setUserProfile({
            fullName: cachedUser.user.fullName || "",
            phone: cachedUser.user.phone || "",
          });
        } else {
          // Nếu dữ liệu người dùng nằm ở cấp cao nhất (cấu trúc cũ)
          setUserInfo(cachedUser);
          setUserProfile({
            fullName: cachedUser.fullName || "",
            phone: cachedUser.phone || "",
          });
        }
      }

      // Luôn gọi API để lấy thông tin mới nhất
      // console.log("Đang gọi API lấy thông tin người dùng...");
      const apiUserInfo = await getUserInfo();
      // console.log("Kết quả API:", apiUserInfo);

      if (apiUserInfo && apiUserInfo.user) {
        // Phân tích thông tin người dùng từ phản hồi API theo cấu trúc thực tế
        const userData = apiUserInfo.user;

        // Lưu thông tin người dùng
        setUserInfo(userData);

        setUserProfile({
          fullName: userData.fullName || "",
          phone: userData.phone || "",
        });
      }
    } catch (error) {
      console.log("Lỗi khi lấy thông tin người dùng:", error);
      // Nếu có lỗi, vẫn sử dụng thông tin từ store nếu có
      if (user) {
        setUserProfile({
          fullName: user.fullName || "",
          phone: user.phone || "",
        });
      }
    } finally {
      setLoadingUser(false);
      // console.log("Hoàn tất quá trình lấy thông tin người dùng");
    }
  };

  const handleLogout = async () => {
    try {
      Alert.alert("Xác nhận", "Bạn có chắc chắn muốn đăng xuất?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: async () => {
            try {
              // Xóa thông tin người dùng khỏi state
              setUserInfo(null);
              // Xóa thông tin trong AsyncStorage
              const { clearUserInfo } = require("../helper/getToken");
              await clearUserInfo();
              // Đăng xuất từ store
              logout();
              Alert.alert("Thành công", "Đăng xuất thành công!");
              navigation.navigate("menu");
            } catch (error) {
              console.log("Lỗi khi đăng xuất:", error);
              Alert.alert("Lỗi", "Có lỗi xảy ra khi đăng xuất");
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại sau.");
    }
  };

  const handleUpdateProfile = () => {
    Alert.alert("Thông báo", "Cập nhật thông tin thành công!");
    setEditingProfile(false);
  };

  const renderProfileContent = () => {
    if (editingProfile) {
      return (
        <View style={styles.profileEditContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Họ và tên:</Text>
            <TextInput
              style={styles.profileInput}
              value={userProfile.fullName}
              onChangeText={(text) =>
                setUserProfile({ ...userProfile, fullName: text })
              }
              placeholder="Nhập họ và tên của bạn"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Số điện thoại:</Text>
            <TextInput
              style={styles.profileInput}
              value={userProfile.phone}
              onChangeText={(text) =>
                setUserProfile({ ...userProfile, phone: text })
              }
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.profileButtonsContainer}>
            <TouchableOpacity
              style={[styles.profileButton, styles.cancelButton]}
              onPress={() => setEditingProfile(false)}
            >
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.profileButton, styles.saveButton]}
              onPress={handleUpdateProfile}
            >
              <Text style={styles.saveButtonText}>Lưu Thay Đổi</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.profileInfoContainer}>
        <View style={styles.profileInfoItem}>
          <Text style={styles.profileLabel}>Email:</Text>
          <Text style={styles.profileValue}>
            {userInfo?.email || user?.email}
          </Text>
        </View>

        <View style={styles.profileInfoItem}>
          <Text style={styles.profileLabel}>Họ và tên:</Text>
          <Text style={styles.profileValue}>
            {userInfo?.fullName || "Chưa cập nhật"}
          </Text>
        </View>

        <View style={styles.profileInfoItem}>
          <Text style={styles.profileLabel}>Số điện thoại:</Text>
          <Text style={styles.profileValue}>
            {userInfo?.phone || user?.phone || "Chưa cập nhật"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editProfileButton}
          onPress={() => setEditingProfile(true)}
        >
          <Text style={styles.editProfileButtonText}>Chỉnh Sửa Thông Tin</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderProfileModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          setEditingProfile(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Thông Tin Tài Khoản</Text>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setEditingProfile(false);
                }}
              >
                <AntDesign name="close" size={22} color="#333" />
              </TouchableOpacity>
            </View>

            {renderProfileContent()}
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <MaterialCommunityIcons name="account" size={50} color={"white"} />
          </View>
          <View style={styles.greeting}>
            {isAuthenticated ? (
              <>
                {loadingUser ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <>
                    <Text style={styles.userGreeting}>
                      Xin chào,{" "}
                      {userInfo?.fullName
                        ? userInfo.fullName
                        : userInfo?.email || user?.email || "Người dùng"}
                      !
                    </Text>
                    <Text style={styles.userEmail}>
                      {userInfo?.email || user?.email}
                    </Text>

                    <View style={styles.accountActions}>
                      <TouchableOpacity
                        style={styles.profileButton}
                        onPress={() => setModalVisible(true)}
                      >
                        <Text style={styles.profileButtonText}>Xem Hồ Sơ</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                      >
                        <Text style={styles.logoutButtonText}>Đăng Xuất</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            ) : (
              <>
                <Text style={styles.welcomeText}>
                  Chào mừng bạn đến với Tempi!
                </Text>
                <Text style={styles.loginPrompt}>
                  Đăng nhập để truy cập tài khoản và theo dõi đơn hàng của bạn
                </Text>

                <View style={styles.authButtons}>
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={() => navigation.navigate("login")}
                  >
                    <Text style={styles.loginButtonText}>Đăng Nhập</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={() => navigation.navigate("register")}
                  >
                    <Text style={styles.registerButtonText}>Đăng Ký</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Đơn hàng của tôi</Text>

        <View style={styles.orderStatusSection}>
          <TouchableOpacity style={styles.orderStatusItem}>
            <View style={styles.orderIcon}>
              <Ionicons name="wallet-outline" size={24} color="#4a6ce2" />
            </View>
            <Text style={styles.orderStatusText}>Chờ thanh toán</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.orderStatusItem}>
            <View style={styles.orderIcon}>
              <Fontisto name="checkbox-passive" size={24} color="#f8b646" />
            </View>
            <Text style={styles.orderStatusText}>Đang xử lý</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.orderStatusItem}>
            <View style={styles.orderIcon}>
              <MaterialIcons
                name="emoji-transportation"
                size={24}
                color="#4caf50"
              />
            </View>
            <Text style={styles.orderStatusText}>Đang vận chuyển</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.orderStatusItem}>
            <View style={styles.orderIcon}>
              <Fontisto name="checkbox-active" size={24} color="#4a6ce2" />
            </View>
            <Text style={styles.orderStatusText}>Đã giao</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Dịch vụ</Text>

        <View style={styles.servicesSection}>
          <TouchableOpacity
            style={styles.serviceItem}
            onPress={() => navigation.navigate("cart")}
          >
            <View style={styles.serviceIcon}>
              <MaterialCommunityIcons
                name="cart-outline"
                size={24}
                color="#4a6ce2"
              />
            </View>
            <Text style={styles.serviceText}>Giỏ Hàng</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceIcon}>
              <MaterialIcons
                name="favorite-outline"
                size={24}
                color="#e74c3c"
              />
            </View>
            <Text style={styles.serviceText}>Yêu Thích</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceIcon}>
              <MaterialCommunityIcons
                name="map-marker-outline"
                size={24}
                color="#f8b646"
              />
            </View>
            <Text style={styles.serviceText}>Địa Chỉ</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.serviceItem}>
            <View style={styles.serviceIcon}>
              <MaterialIcons name="support-agent" size={24} color="#4caf50" />
            </View>
            <Text style={styles.serviceText}>Hỗ Trợ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isAuthenticated ? (
        <View style={styles.settingsSection}>
          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="vpn-key" size={22} color="#555" />
            <Text style={styles.settingText}>Đổi mật khẩu</Text>
            <MaterialIcons name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="notifications-none" size={22} color="#555" />
            <Text style={styles.settingText}>Thông báo</Text>
            <MaterialIcons name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <MaterialIcons name="security" size={22} color="#555" />
            <Text style={styles.settingText}>Bảo mật tài khoản</Text>
            <MaterialIcons name="chevron-right" size={22} color="#999" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.guestInfoSection}>
          <MaterialIcons name="info-outline" size={40} color="#4a6ce2" />
          <Text style={styles.guestInfoTitle}>Đăng nhập để xem thêm</Text>
          <Text style={styles.guestInfoText}>
            Tạo tài khoản hoặc đăng nhập để theo dõi đơn hàng, lưu địa chỉ và
            nhận các ưu đãi đặc biệt.
          </Text>
        </View>
      )}

      {renderProfileModal()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  headerSection: {
    // backgroundColor: "#4a6ce2",
    backgroundColor: "#228654",
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  greeting: {
    flex: 1,
  },
  userGreeting: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  loginPrompt: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  accountActions: {
    flexDirection: "row",
    marginTop: 5,
  },
  profileButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 10,
  },
  profileButtonText: {
    color: "#4a6ce2",
    fontWeight: "600",
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  authButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  loginButtonText: {
    color: "#228654",
    fontWeight: "600",
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 15,
  },
  orderStatusSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderStatusItem: {
    alignItems: "center",
    width: "22%",
  },
  orderIcon: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "rgba(74, 108, 226, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  orderStatusText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  servicesSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  serviceItem: {
    alignItems: "center",
    width: "22%",
  },
  serviceIcon: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "rgba(74, 108, 226, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  settingsSection: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingText: {
    flex: 1,
    fontSize: 15,
    color: "#444",
    marginLeft: 15,
  },
  guestInfoSection: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 10,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  guestInfoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  guestInfoText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 15,
    width: "90%",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  profileInfoContainer: {
    marginBottom: 20,
  },
  profileInfoItem: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileLabel: {
    width: 110,
    fontSize: 14,
    color: "#777",
  },
  profileValue: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  editProfileButton: {
    backgroundColor: "#4a6ce2",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  editProfileButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  profileEditContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  profileInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#f9f9f9",
  },
  profileButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#4a6ce2",
    paddingVertical: 12,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
  },
});

export default Account;
