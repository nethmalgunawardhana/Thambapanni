import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  TextInput,
  KeyboardTypeOptions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { register, UserData } from '../../../authService';

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  error?: string;
}

interface FormData extends UserData {
  password: string;
  confirmPassword: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  nationality?: string;
  gender?: string;
  dateOfBirth?: string;
  password?: string;
  confirmPassword?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  keyboardType,
  error 
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={[styles.input, error && styles.inputError]}
      placeholder={placeholder}
      placeholderTextColor="#6366f1"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
    />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const Register: React.FC<Props> = ({ navigation }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    nationality: '',
    gender: '',
    dateOfBirth: new Date(),
    password: '',
    confirmPassword: ''
  });
  
  const [showPicker, setShowPicker] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = useCallback((): boolean => {
    const newErrors: ValidationErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleRegister = async () => {
    try {
      if (!validateForm()) {
        return;
      }

      setIsLoading(true);

      // Extract registration data
      const { confirmPassword, password, ...userData } = formData;
      
      // Register using the imported register function
      await register(userData, password);

      Alert.alert(
        'Success',
        'Account created successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Registration Error',
        error instanceof Error ? error.message : 'Failed to create account'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require('../../../assets/images/register.png')} 
      style={styles.background}
    >
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
        </View>

        <ScrollView style={styles.formContainer}>
          <InputField
            placeholder="First Name"
            value={formData.firstName}
            onChangeText={(text) => updateFormData('firstName', text)}
            error={errors.firstName}
          />

          <InputField
            placeholder="Last Name"
            value={formData.lastName}
            onChangeText={(text) => updateFormData('lastName', text)}
            error={errors.lastName}
          />

          <InputField
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => updateFormData('email', text)}
            keyboardType="email-address"
            error={errors.email}
          />

          <InputField
            placeholder="Nationality"
            value={formData.nationality}
            onChangeText={(text) => updateFormData('nationality', text)}
            error={errors.nationality}
          />

          <View style={styles.inputContainer}>
            <View style={[styles.inputGender, errors.gender && styles.inputError]}>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(value) => updateFormData('gender', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Gender" value="" color="#999" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>
            {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity 
              onPress={() => setShowPicker(true)}
              style={[styles.input, errors.dateOfBirth && styles.inputError]}
            >
              <Text style={formData.dateOfBirth ? styles.dateText : styles.placeholderText}>
                {formData.dateOfBirth ? formData.dateOfBirth.toDateString() : 'Date of Birth'}
              </Text>
            </TouchableOpacity>
            {errors.dateOfBirth && <Text style={styles.errorText}>{errors.dateOfBirth}</Text>}
          </View>

          {showPicker && (
            <DateTimePicker
              value={formData.dateOfBirth}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) {
                  updateFormData('dateOfBirth', selectedDate);
                }
              }}
              maximumDate={new Date()}
              minimumDate={new Date(1940, 0, 1)}
            />
          )}

          <InputField
            placeholder="Password"
            value={formData.password}
            onChangeText={(text) => updateFormData('password', text)}
            secureTextEntry
            error={errors.password}
          />

          <InputField
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateFormData('confirmPassword', text)}
            secureTextEntry
            error={errors.confirmPassword}
          />

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Login here</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    color: '#FFD700',
    fontSize: 28,
    marginRight: 15,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#333',
  },
  inputGender: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    color: '#0000FF',
  },
  picker: {
    color: '#333',
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  button: {
    backgroundColor: '#f97316',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  loginLink: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.7,
    backgroundColor: '#ccc',
  },
});

export default Register;