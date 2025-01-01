import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Props {
  navigation: NativeStackNavigationProp<any>;
}

interface InputFieldProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ placeholder, value, onChangeText, secureTextEntry }) => (
  <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#6366f1"
    value={value}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
  />
);
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

const RegistrationScreen: React.FC<Props> = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nationality, setNationality] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const handleSubmit = () => {
    // Handle form submission
    console.log({ fullName, email, password, nationality, gender, dateOfBirth });
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://i.ibb.co/M77hMyN/1-111112.png' }} 
      style={styles.background}
    >
      <StatusBar style="light" />
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Fill Your Details</Text>
        </View>

        <View style={styles.formContainer}>
          <InputField
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          
          <InputField
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          
          <InputField
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <InputField
            placeholder="Nationality"
            value={nationality}
            onChangeText={setNationality}
          />
          
          <InputField
            placeholder="Gender"
            value={gender}
            onChangeText={setGender}
          />
          
          <InputField
            placeholder="Date of Birth"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
          />

          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleSubmit}
          >
            <CustomButton 
            title="Create an Account"
            onPress={() => navigation.navigate('Login')}
          />
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  backButton: {
    color: 'white',
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
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
  }
});

export default RegistrationScreen;