import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import App from './pages/splash';
import { NavigationContainer } from '@react-navigation/native';
import RegistrationScreen from './pages/auth/register';
import LoginScreen from './pages/auth/login';
import Email from './pages/otp/Enteremail';
import Otp from  './pages/otp/OTP';
import Password from './pages/otp/Password';
import MenuBar from './pages/tabs/menubar';
const Stack = createStackNavigator();
const NewStack = () => {
    return (
        <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={App} />
            <Stack.Screen name="Register" component={RegistrationScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Email" component={Email} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="Password" component={Password} />
            <Stack.Screen name="MenuBar" component={MenuBar} />
        </Stack.Navigator>
        </NavigationContainer>
    );  
}
export default NewStack;