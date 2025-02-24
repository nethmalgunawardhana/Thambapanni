import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../../services/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  StripePayment: {
    amount: number;
    tripId: string;
  };
  PaymentSuccess: {
    paymentId: string;
  };
  PaymentFailed: undefined;
};

type StripePaymentScreenProps = {
  route: RouteProp<RootStackParamList, 'StripePayment'>;
  navigation: StackNavigationProp<RootStackParamList>;
};

// Wrapper component that provides Stripe context
export const StripePaymentWrapper: React.FC<StripePaymentScreenProps> = (props) => {
  return (
    <StripeProvider publishableKey="pk_test_51QrxZzKyDhqBRh782K5MWAxApZck9r5CgVhKhGNANKxNzwVxRUlMaAM6hejh98rrkqY4zJMALPb8CVTD5es36coG00kt5fPwBI">
      <StripePaymentScreen {...props} />
    </StripeProvider>
  );
};

const StripePaymentScreen: React.FC<StripePaymentScreenProps> = ({ route, navigation }) => {
  const { amount, tripId } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  
  // Fetch the authentication token when component mounts
  useEffect(() => {
    const getAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Authentication Error', 'Please log in to continue');
          navigation.goBack();
          return;
        }
        setAuthToken(token);
      } catch (error) {
        console.error('Error retrieving auth token:', error);
        Alert.alert('Authentication Error', 'Unable to retrieve authentication details');
        navigation.goBack();
      }
    };
    
    getAuthToken();
  }, [navigation]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      if (!amount || !tripId) {
        throw new Error('Missing required payment parameters');
      }
      
      if (!authToken) {
        throw new Error('Authentication token not available');
      }

      // Log the request details for debugging
      console.log('Initiating payment request:', {
        amount: Math.round(amount * 100),
        tripId,
      });
      
      // Call your backend to create the payment intent
      const response = await fetch(`${API_URL}/api/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to cents
          tripId,
        }),
      });
      
      console.log('Backend response status:', response.status);
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error response:', errorData);
        throw new Error(`Server responded with status ${response.status}: ${errorData}`);
      }
      
      let jsonResponse: any;
      
      try {
        jsonResponse = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      // Validate response data
      const { paymentIntent, ephemeralKey, customer } = jsonResponse;
      if (!paymentIntent || !ephemeralKey || !customer) {
        throw new Error('Incomplete payment details received from server');
      }
      
      const initResult = await initPaymentSheet({
        merchantDisplayName: 'Thambapanni App',
        paymentIntentClientSecret: paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        defaultBillingDetails: {
          name: '',
        },
        allowsDelayedPaymentMethods: true,
        style: 'automatic',
      });

      if (initResult.error) {
        console.error('Payment sheet initialization error:', initResult.error);
        throw new Error(initResult.error.message);
      }

      // Present payment sheet
      await openPaymentSheet(paymentIntent);

    } catch (error) {
      console.error('Payment initialization error:', error);
      
      // Provide more specific error messages based on error type
      let errorMessage = 'Unable to process payment. Please try again later.';
      if (error instanceof TypeError) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else if (error instanceof SyntaxError) {
        errorMessage = 'Invalid response from server. Please try again.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert('Payment Error', errorMessage);
      navigation.navigate('PaymentFailed');
    } finally {
      setLoading(false);
    }
  };

  const openPaymentSheet = async (clientSecret) => {
    try {
      const { error, paymentOption } = await presentPaymentSheet();

      if (error) {
        console.error('Payment sheet presentation error:', error);
        throw new Error(error.message);
      }

      // Extract paymentIntentId from the client secret
      // Client secret format: pi_xxx_secret_yyy
      const paymentIntentId = clientSecret.split('_secret_')[0];
      
      // Record the successful payment in Firestore
      await recordPaymentSuccess(paymentIntentId);

    } catch (error) {
      console.error('Payment presentation error:', error);
      Alert.alert(
        'Payment Failed',
        error instanceof Error ? error.message : 'Payment could not be completed'
      );
      navigation.navigate('PaymentFailed');
    }
  };

  const recordPaymentSuccess = async (paymentIntentId) => {
    try {
      if (!authToken) {
        throw new Error('Authentication token not available');
      }
      
      // Send data to your backend to store in Firestore
      const response = await fetch(`${API_URL}/api/payments/handle-success`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          paymentIntentId,
          tripId,
          amount: Math.round(amount * 100), // Amount in cents
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend payment record error:', errorData);
        throw new Error(`Failed to record payment: ${errorData}`);
      }

      const result = await response.json();
      
      // Navigate to success screen with payment ID
      navigation.navigate('PaymentSuccess', { 
        paymentId: result.paymentId 
      });
      
    } catch (error) {
      console.error('Error recording payment success:', error);
      
      // Even if recording fails, we know the payment succeeded with Stripe
      // So we still navigate to success but without the payment ID
      Alert.alert(
        'Payment Successful',
        'Your payment was processed successfully, but there was an issue saving the payment details. Please contact support if needed.'
      );
      
      navigation.navigate('PaymentSuccess', { paymentId: null });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Complete Your Booking</Text>
        <Text style={styles.amount}>${amount.toFixed(2)}</Text>
        
        <View style={styles.infoContainer}>
          <Icon name="shield-checkmark" size={24} color="#4CAF50" />
          <Text style={styles.infoText}>Secure payment powered by Stripe</Text>
        </View>

        <TouchableOpacity
          style={[styles.payButton, loading && styles.payButtonDisabled]}
          onPress={initializePayment}
          disabled={loading || !authToken}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.payButtonText}>Pay Now</Text>
              <Icon name="card" size={20} color="#FFF" style={styles.buttonIcon} />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#20B2AA',
    marginBottom: 32,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
  },
  infoText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20B2AA',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  cancelButton: {
    padding: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default StripePaymentWrapper;