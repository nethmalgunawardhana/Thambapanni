import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
  StyleSheet,
  TextInput,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

interface Props {
  navigation: NativeStackNavigationProp<any>;
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

const Email: React.FC<Props> = ({ navigation }) => {
  const backgroundImage: ImageSourcePropType = require('../../../assets/images/otp.png');
    
  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <View style={styles.semiTransparentBlock}>
          <View style={styles.contentContainer}>
            <Text style={styles.subHeaderText}>Please enter your email</Text>
            
            <TextInput
              style={[styles.input, styles.marginBottom]}
              placeholder="Enter your email"
              placeholderTextColor="rgba(79, 70, 229, 0.6)"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <CustomButton 
              title="Continue" 
              onPress={() => navigation.navigate('Otp')}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: 'center',
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
  subHeaderText: {
    fontSize: 18,
    color: "#374151",
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "rgb(249, 115, 22)",
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 8,
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
  input: {
    height: 56,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  marginBottom: {
    marginBottom: 16,
  },
});

export default Email;