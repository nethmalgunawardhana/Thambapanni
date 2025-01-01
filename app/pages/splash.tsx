import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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

const App: React.FC<Props> = ({ navigation }) => {
  const backgroundImage: ImageSourcePropType = require('../../assets/images/splash.png');
  const logoImage: ImageSourcePropType = require('../../assets/images/icon.png');

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <View style={styles.logoContainer}>
          <View style={styles.logoWrapper}>
            <Image
              source={logoImage}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>
            Your One Stop for{'\n'}Sri Lankan Travel
          </Text>

          <CustomButton 
            title="Create an Account" 
            style={styles.marginBottom}
            onPress={() => navigation.navigate('Register')}
          />
          
          <CustomButton 
            title="Already have an account"
            onPress={() => navigation.navigate('Login')}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 150,
  },
  logoWrapper: {
    backgroundColor: 'rgb(186, 230, 253)', // sky-200 equivalent
    borderRadius: 50,
    padding: 2,
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 70,
    height: 70,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  titleText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 80,
  },
  button: {
    backgroundColor: 'rgb(249, 115, 22)', // orange-500 equivalent
    borderRadius: 8,
    paddingVertical: 16,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  marginBottom: {
    marginBottom: 16,
  },
});

export default App;