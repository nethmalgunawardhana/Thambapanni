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
  const logoImage: ImageSourcePropType = require('../../assets/images/Thambapanni.png');

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
            Welcome to Thambapanni{'\n'}Your Gateway to Sri Lanka
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

// ...existing code...

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Slightly darker overlay
    paddingTop: 60, // Account for status bar
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 80,
    
    
},
logoWrapper: {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: 80,
  width: 160,
  height: 160,
  alignItems: 'center',
  justifyContent: 'center',
  borderWidth: 2,
  borderColor: 'rgba(255, 255, 255, 0.2)',
  shadowColor: '#000',
  shadowOffset: {
      width: 0,
      height: 6,
  },
  shadowOpacity: 0.35,
  shadowRadius: 8,
  elevation: 12,
},
logo: {
  width: '100%',
  height: '100%',
  borderRadius: 80,
},
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Push content to bottom
    paddingHorizontal: 24,
    paddingBottom: 50,
  },
  titleText: {
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 60,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  button: {
    backgroundColor: 'rgb(249, 115, 22)',
    borderRadius: 12,
    paddingVertical: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  marginBottom: {
    marginBottom: 16,
  },
});

export default App;