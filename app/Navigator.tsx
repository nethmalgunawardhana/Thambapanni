import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import App from './splash';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();
const NewStack = () => {
    return (
        <NavigationContainer>
        <Stack.Navigator>
            <Stack.Screen name="Splash" component={App} />
        </Stack.Navigator>
        </NavigationContainer>
    );  
}
export default NewStack;