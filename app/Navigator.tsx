import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import App from './pages/splash';
import { NavigationContainer } from '@react-navigation/native';
import RegistrationScreen from './pages/auth/register';
import LoginScreen from './pages/auth/login';

const Stack = createStackNavigator();
const NewStack = () => {
    return (
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Splash" component={App} />
            <Stack.Screen name="Register" component={RegistrationScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
        </NavigationContainer>
    );  
}
export default NewStack;