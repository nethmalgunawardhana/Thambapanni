import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import App from './pages/splash';
import { NavigationContainer } from '@react-navigation/native';
import RegistrationScreen from './pages/auth/register';
import LoginScreen from './pages/auth/login';
import Email from './pages/otp/Enteremail';
import Otp from  './pages/otp/OTP';
import Password from './pages/otp/Password';
import MenuBar from './pages/Main/menubar';
import TripResultScreen  from './pages/Main/TripResultScreen'
import TripGenerationScreen from './pages/Main/TripGeneration';
import BudgetReportScreen from './pages/Main/BudgetReportScreen';
import TripPlansScreen from './pages/Main/TripPlansScreen';
import StripePaymentWrapper from './pages/payment-gateway/payment';
import PaymentSuccessScreen from './pages/payment-gateway/paymentsuccess';
import PaymentFailedScreen from './pages/payment-gateway/PaymentFailed';
import SelectGuideScreen from './pages/Main/SelectGuideScreen';
import TripMapScreen        from './pages/Main/TripMapScreen';
import SelectVehicleScreen from './pages/Main/SelectVehicleScreen';
import PaymentHistoryScreen from './pages/payment-gateway/paymenthistory';
const Stack = createStackNavigator();
const NewStack = () => {
    return (
        
        <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={App} />
            <Stack.Screen name="Register" component={RegistrationScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Email" component={Email} />
            <Stack.Screen name="Otp" component={Otp} />
            <Stack.Screen name="Password" component={Password} />
            <Stack.Screen name="MenuBar" component={MenuBar} />
            <Stack.Screen name="TripResult" component={TripResultScreen} />
            <Stack.Screen name="TripGeneration" component={TripGenerationScreen}/>
            <Stack.Screen name="SelectGuide" component={SelectGuideScreen} />
            <Stack.Screen name="BudgetReport" component={BudgetReportScreen}/>
            <Stack.Screen name="TripPlans" component={TripPlansScreen}/>
            <Stack.Screen name="StripePayment" component={StripePaymentWrapper} />
            <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
            <Stack.Screen name="PaymentFailed" component={PaymentFailedScreen} />
            <Stack.Screen name="TripMap" component={TripMapScreen} />
            <Stack.Screen name="SelectVehicle" component={SelectVehicleScreen} />
            <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />
            
        </Stack.Navigator>
      
    );  
}
export default NewStack;