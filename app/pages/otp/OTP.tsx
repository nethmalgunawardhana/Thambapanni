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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { verifyOtp } from "../../../services/otp/verifyotpService"; // Ensure this function exists
import { sendOtp } from "../../../services/otp/sendotpService";
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

const Otp: React.FC<Props> = ({ navigation, route }) => {
  const { email } = route.params; // Get email from the previous screen
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert("Error", "Please enter the OTP");
      return;
    }

    try {
      setIsSubmitting(true);

      // Call the backend API to verify OTP
      await verifyOtp(email, otp); // Replace this with your verifyOtp service function

      Alert.alert("Success", "OTP verified successfully!");
      navigation.navigate("Password", { email, otp }); // Navigate to the Password screen
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to verify OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsSubmitting(true);

      // Call resend OTP function
      await sendOtp(email); // Ensure resendOtp function exists in authService

      Alert.alert("Success", "OTP resent to your email!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to resend OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground
      source={require("../../../assets/images/otp.png")}
      style={styles.background}
    >
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <View style={styles.semiTransparentBlock}>
          <View style={styles.contentContainer}>
            <Text style={styles.headerText}>
              We have sent you a 6-digit code to your email address
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              placeholderTextColor="rgba(79, 70, 229, 0.6)"
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={6}
              value={otp}
              onChangeText={setOtp}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate("Email")}
              style={styles.linkContainer}
            >
              <Text style={styles.linkText}>Not this email?</Text>
            </TouchableOpacity>

            <CustomButton
              title={isSubmitting ? "Verifying..." : "Continue"}
              onPress={handleVerifyOtp}
              style={isSubmitting ? styles.disabledButton : null}
            />

            <TouchableOpacity
              style={styles.resendContainer}
              onPress={handleResendOtp}
              disabled={isSubmitting}
            >
              <Text style={styles.resendText}>
                {isSubmitting ? "Resending..." : "Resend Code"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const { width, height } = Dimensions.get("window");

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
    fontSize: 18,
    color: "#374151",
    marginBottom: 32,
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 24,
  },
  input: {
    height: 56,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 20,
    color: "#1F2937",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 8,
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
  linkContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  linkText: {
    color: "#4F46E5",
    fontSize: 15,
    fontWeight: "500",
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  resendText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
});

export default Otp;
