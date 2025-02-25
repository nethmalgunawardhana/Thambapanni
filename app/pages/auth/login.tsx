import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  TouchableOpacity, 
  ImageSourcePropType, 
  StyleSheet, 
  TextInput, 
  KeyboardTypeOptions,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import { login } from '../../../services/auth/loginService';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

const InputField: React.FC<InputFieldProps> = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  keyboardType,
  autoCapitalize = 'none'
}) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#6366f1"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    keyboardType={keyboardType}
    autoCapitalize={autoCapitalize}
    autoCorrect={false}
  />
);

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const backgroundImage: ImageSourcePropType = require('../../../assets/images/login.png');

  // Handle email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      Alert.alert(
              'Success',
              ' Signed in successfully!',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.navigate('MenuBar'),
                },
              ]
            );
     
    } catch (error) {
      Alert.alert('Login Error', error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  // Handle social login (Google/Facebook)
  const handleSocialLogin = async (platform: 'Google' | 'Facebook') => {
    try {
      setLoading(true);
      if (platform === 'Google') {
        if (Platform.OS !== 'web') {
          Alert.alert('Error', 'Google login is only available in web browser environments');
          return;
        }
        // assuming loginWithGoogle is defined elsewhere
        // await loginWithGoogle();
      } else {
        if (Platform.OS !== 'web') {
          Alert.alert('Error', 'Facebook login is only available in web browser environments');
          return;
        }
        // assuming loginWithFacebook is defined elsewhere
        // await loginWithFacebook();
      }
      navigation.navigate('MenuBar');
    } catch (error) {
      Alert.alert('Social Login Error', error instanceof Error ? error.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.overlay}>
          <View style={styles.contentContainer}>
            <View style={styles.header}>
              <TouchableOpacity 
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.backButton}>←</Text>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Welcome Back</Text>
            </View>

            {/* Form container without ScrollView */}
            <View style={styles.formContainer}>
              <InputField
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
              
              <InputField
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <View style={styles.linkContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.link}>Don't have an account?</Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => navigation.navigate('Email')}>
                  <Text style={styles.link}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              {Platform.OS === 'web' && (
                <>
                  <Text style={styles.orText}>or continue with</Text>

                  <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity 
                      style={styles.socialButton}
                      onPress={() => handleSocialLogin('Google')}
                      disabled={loading}
                    >
                      <FontAwesome name="google" size={24} color="#db4a39" />
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={styles.socialButton}
                      onPress={() => handleSocialLogin('Facebook')}
                      disabled={loading}
                    >
                      <FontAwesome name="facebook" size={24} color="#3b5998" />
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  contentContainer: {
    marginTop: SCREEN_HEIGHT * 0.15,
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: Platform.OS === 'ios' ? 50 : 50,
  },
  backButton: {
    color: '#FFFFFF',
    fontSize: 28,
    marginRight: 15,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#1f2937',
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  link: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 4,
    shadowColor: '#f97316',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  orText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 14,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  socialButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
});

export default LoginScreen;