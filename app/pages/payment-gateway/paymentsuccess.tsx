import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

type RootStackParamList = {
  Home: undefined;
  PaymentSuccess: undefined;
};

type PaymentSuccessScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const PaymentSuccessScreen: React.FC<PaymentSuccessScreenProps> = ({ navigation }) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          <Icon name="checkmark-circle" size={100} color="#4CAF50" />
        </Animated.View>

        <Text style={styles.title}>Payment Successful!</Text>
        <Text style={styles.message}>
          Thank you for your payment. Your trip has been successfully booked.
          You will receive a confirmation email shortly.
        </Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>What's Next?</Text>
          <View style={styles.detailItem}>
            <Icon name="mail-outline" size={24} color="#666" />
            <Text style={styles.detailText}>Check your email for booking confirmation</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="calendar-outline" size={24} color="#666" />
            <Text style={styles.detailText}>Review your trip details in the app</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="help-circle-outline" size={24} color="#666" />
            <Text style={styles.detailText}>Contact support if you have any questions</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleBackToHome}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
          <Icon name="home" size={20} color="#FFF" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  detailsContainer: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#20B2AA',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});

export default PaymentSuccessScreen;