import React, { useState, useEffect, useRef } from 'react';
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
  
  // Using useRef instead of useState to ensure the value is immediately available
  const paymentIntentIdRef = useRef<string | null>(null);
  
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
        console.log('Retrieved auth token:', token);
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
  
      // Calculate the amount in cents
      const amountInCents = Math.round(amount * 100);
  
      // Log the request details for debugging
      console.log('Initiating payment request:', {
        amount: amountInCents,
        tripId,
      });
      
      // Explicitly create the request body object
      const requestBody = {
        tripId,
        amount: amountInCents // Convert to cents
      };
      
      console.log('Request body being sent:', JSON.stringify(requestBody));
      
      // Call your backend to create the payment intent
      const response = await fetch(`${API_URL}/api/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify(requestBody), // Use the explicit requestBody object
      });
      
      console.log('Backend response status:', response.status);
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Backend error response:', errorData);
        throw new Error(`Server responded with status ${response.status}: ${errorData}`);
      }
      
      let jsonResponse;
      
      try {
        jsonResponse = await response.json();
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        throw new Error('Invalid response format from server');
      }
      // Validate response data
      const { paymentIntent, ephemeralKey, customer, paymentIntentId: intentId } = jsonResponse;
      if (!paymentIntent || !ephemeralKey || !customer || !intentId) {
        throw new Error('Incomplete payment details received from server');
      }
      
      // Store the payment intent ID using ref for immediate access
      paymentIntentIdRef.current = intentId;
      console.log('Payment intent ID stored:', intentId);
      
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
      await openPaymentSheet();

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

  const openPaymentSheet = async () => {
    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        console.error('Payment sheet presentation error:', error);
        throw new Error(error.message);
      }

      // If we got here, payment succeeded
      // Get the stored payment intent ID from the ref
      const currentPaymentIntentId = paymentIntentIdRef.current;
      console.log('Payment succeeded, using payment intent ID:', currentPaymentIntentId);
      
      if (!currentPaymentIntentId) {
        console.error('Payment ID not available in ref');
        throw new Error('Payment ID not available. Please try again.');
      }
      
      // Record the successful payment in Firestore
      await recordPaymentSuccess(currentPaymentIntentId);

    } catch (error) {
      console.error('Payment presentation error:', error);
      Alert.alert(
        'Payment Failed',
        error instanceof Error ? error.message : 'Payment could not be completed'
      );
      navigation.navigate('PaymentFailed');
    }
  };

  const recordPaymentSuccess = async (intentId: string) => {
    try {
      console.log('Recording payment success for intent ID:', intentId);
      
      if (!authToken) {
        throw new Error('Authentication token not available');
      }
      
      // Multiple retry mechanism for recording payment
      let retryCount = 0;
      const maxRetries = 3;
      let success = false;
      let result: any = null;
      
      while (retryCount < maxRetries && !success) {
        try {
          console.log(`Attempt ${retryCount + 1} to record payment success`);
          
          // Send data to your backend to store in Firestore
          const response = await fetch(`${API_URL}/api/payments/handle-success`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              paymentIntentId: intentId,
              tripId,
              amount: Math.round(amount * 100), // Amount in cents
            }),
          });

          const responseBody = await response.text();
          console.log(`Server response (attempt ${retryCount + 1}):`, responseBody);
          
          if (!response.ok) {
            console.error(`Backend payment record error (attempt ${retryCount + 1}):`, responseBody);
            throw new Error(`Failed to record payment: ${responseBody}`);
          }

          try {
            result = JSON.parse(responseBody);
            success = true;
            console.log('Payment successfully recorded:', result);
          } catch (parseError) {
            console.error('Error parsing JSON response:', parseError);
            throw new Error('Invalid response format from server');
          }
        } catch (retryError) {
          console.error(`Payment recording attempt ${retryCount + 1} failed:`, retryError);
          retryCount++;
          
          if (retryCount < maxRetries) {
            // Wait before retrying - exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
          }
        }
      }
      
      if (!success) {
        throw new Error(`Failed to record payment after ${maxRetries} attempts`);
      }
      
      // Verify result has a paymentId before navigating
      if (!result.paymentId) {
        console.error('Payment recorded but no paymentId returned:', result);
        throw new Error('Payment ID not returned from server');
      }
      
      // Navigate to success screen with payment ID
      console.log('Navigating to success screen with payment ID:', result.paymentId);
      navigation.navigate('PaymentSuccess', { 
        paymentId: result.paymentId 
      });
      
    } catch (error) {
      console.error('Error recording payment success:', error);
      
      // Even if recording fails, we know the payment succeeded with Stripe
      // So we still navigate to success but without the payment ID
      Alert.alert(
        'Payment Successful',
        'Your payment was processed successfully, but there was an issue saving the payment details. Our team has been notified and will resolve this soon. Your trip is confirmed.'
      );
      
      // Log the error to your monitoring service
      console.error('Payment recording failure - Critical Error:', {
        tripId,
        paymentIntentId: intentId,
        amount: Math.round(amount * 100),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      // Still navigate to success screen even if we couldn't get a payment ID
      navigation.navigate('PaymentSuccess', { paymentId: 'pending' });
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