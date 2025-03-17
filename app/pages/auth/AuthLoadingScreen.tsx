import React, { useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { getAuthToken } from "../../../services/auth/loginService";

interface Props {
  navigation: NavigationProp<any>;
}

const AuthLoadingScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await getAuthToken();
      navigation.navigate(token ? "MenuBar" : "Splash", { replace: true });
    };
    checkLoginStatus();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AuthLoadingScreen;
