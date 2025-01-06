import React, { useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { resetPassword } from "../../../services/otp/resetpasswordService"; // Ensure this function exists
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface Props {
  navigation: NativeStackNavigationProp<any>;
  route: any;
}

interface ButtonProps {
  title: string;
  onPress?: () => void;
  style?: object;
}

const CustomButton: React.FC<ButtonProps> = ({ title, onPress, style }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const Password: React.FC<Props> = ({ navigation, route }) => {
  const { email, otp } = route.params; // Email and OTP passed from the previous screen
  const [newPassword, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backgroundImage = require("../../../assets/images/otp.png");

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Both password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    // Password validation criteria
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        "Error",
        "Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character"
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPassword(email, otp, newPassword); // Call backend API to reset the password
      Alert.alert("Success", "Password reset successfully!");
      navigation.navigate("Login");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <View style={styles.semiTransparentBlock}>
          <View style={styles.contentContainer}>
            <Text style={styles.headerText}>Create New Password</Text>
            <Text style={styles.subHeaderText}>
              Please enter your new password
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="rgba(79, 70, 229, 0.6)"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={newPassword}
              onChangeText={setPassword}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="rgba(79, 70, 229, 0.6)"
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <View style={styles.passwordRequirements}>
              <Text style={styles.requirementText}>
                Password must contain:
              </Text>
              <Text style={styles.requirementItem}>• At least 8 characters</Text>
              <Text style={styles.requirementItem}>
                • One uppercase letter
              </Text>
              <Text style={styles.requirementItem}>• One number</Text>
              <Text style={styles.requirementItem}>
                • One special character
              </Text>
            </View>

            <CustomButton
              title={isSubmitting ? "Resetting..." : "Reset Password"}
              onPress={handleResetPassword}
              style={isSubmitting ? styles.disabledButton : null}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
  },
  semiTransparentBlock: {
    marginHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 20,
    paddingVertical: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  contentContainer: {
    paddingHorizontal: width * 0.06,
  },
  headerText: {
    fontSize: 24,
    color: "#1F2937",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 8,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    height: 56,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  button: {
    backgroundColor: "rgb(249, 115, 22)",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 24,
    shadowColor: "#4F46E5",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  passwordRequirements: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "rgba(243, 244, 246, 0.8)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  requirementText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
    paddingLeft: 4,
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
});

export default Password;
