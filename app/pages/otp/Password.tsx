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
  <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const Password: React.FC<Props> = ({ navigation }) => {
  const backgroundImage: ImageSourcePropType = {
    uri: "https://www.annees-de-pelerinage.com/wp-content/uploads/2019/03/elephants.jpg",
  };
  const logoImage: ImageSourcePropType = {
    uri: "https://www.annees-de-pelerinage.com/wp-content/uploads/2019/03/elephants.jpg",
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <View
          style={[
            styles.semiTransparentBlock,
            {
              flex: 0.75, // Takes up 50% of the parent height
              marginVertical: "25%", // Pushes the block to the middle
            },
          ]}
        >
          <View style={styles.contentContainer}>
            <Text style={{ fontSize: 20, color: '#000000', textAlign: 'center' }}>
              Please enter your new password
            </Text>
            <View style={{ height: 50 }} />
            <TextInput
              style={[styles.input, styles.marginBottom]}
              placeholder="Password"
              placeholderTextColor="#4F46E5"
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              style={[styles.input, styles.marginBottom]}
              placeholder="Confirm Password"
              placeholderTextColor="#4F46E5"
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <CustomButton title="Reset" onPress={()=>navigation.navigate('Login')}/>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  semiTransparentBlock: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  logoWrapper: {
    backgroundColor: "rgb(186, 230, 253)", // sky-200 equivalent
    borderRadius: 50,
    padding: 16,
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 64,
    height: 64,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  titleText: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 80,
  },
  button: {
    backgroundColor: "rgba(234, 88, 12, 1)",
    borderRadius: 8,
    paddingVertical: 16,
  },
  buttonText: {
    textAlign: "center",
    color: "#000000",
    fontSize: 20,
    fontWeight: "600",
  },
  input: {
    height: 40,
    backgroundColor: "rgba(207, 231, 229, 0.8)",
    borderColor: "rgba(207, 231, 229, 0.8)",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "white",
    fontSize: 20,
  },
  marginBottom: {
    marginBottom: 16,
  },
});

export default Password;
