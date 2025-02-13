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
  BudgetReport: undefined;
  PaymentFailed: undefined;
};

type PaymentFailedScreenProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const PaymentFailedScreen: React.FC<PaymentFailedScreenProps> = ({ navigation }) => {
  const shakeAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleTryAgain = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ translateX: shakeAnimation }],
            },
          ]}
        >
          <Icon name="close-circle" size={100} color="#FF6B6B" />
        </Animated.View>

        <Text style={styles.title}>Payment Failed</Text>
        <Text style={styles.message}>
          We couldn't process your payment. Please check your payment details and try again.
        </Text>

        <View style={styles.troubleshootContainer}>
          <Text style={styles.troubleshootTitle}>Possible Issues:</Text>
          <View style={styles.troubleshootItem}>
            <Icon name="card-outline" size={24} color="#666" />
            <Text style={styles.troubleshootText}>Insufficient funds or card declined</Text>
          </View>
          <View style={styles.troubleshootItem}>
            <Icon name="warning-outline" size={24} color="#666" />
            <Text style={styles.troubleshootText}>Incorrect card information</Text>
          </View>
          <View style={styles.troubleshootItem}>
            <Icon name="wifi-outline" size={24} color="#666" />
            <Text style={styles.troubleshootText}>Network connection issues</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.tryAgainButton}
            onPress={handleTryAgain}
          >
            <Text style={styles.tryAgainButtonText}>Try Again</Text>
            <Icon name="refresh" size={20} color="#FFF" style={styles.buttonIcon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => {/* Implement contact support */}}
          >
            <Text style={styles.supportButtonText}>Contact Support</Text>
            <Icon name="help-circle" size={20} color="#666" style={styles.buttonIcon} />
          </TouchableOpacity>
        </View>
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
  troubleshootContainer: {
    width: '100%',
    backgroundColor: '#FFF5F5',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  troubleshootTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  troubleshootItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  troubleshootText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  tryAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#20B2AA',
    paddingVertical: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tryAgainButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 8,
  },
  supportButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});

export default PaymentFailedScreen;