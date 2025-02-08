import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  Alert 
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import axios from 'axios';
import LottieView from 'lottie-react-native';

// Define navigation types
type RootStackParamList = {
  PlanningTrip: undefined;
  TripGeneration: { 
    requestData: {
      destinations: string[];
      categoryType: string;
      days: number;
      members: number;
      budgetRange: string;
    }
  };
  TripPlanResult: { tripPlan: any };
};

type TripGenerationScreenRouteProp = RouteProp<RootStackParamList, 'TripGeneration'>;
type TripGenerationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TripGeneration'>;

type Props = {
  route: TripGenerationScreenRouteProp;
  navigation: TripGenerationScreenNavigationProp;
};

const TripGenerationScreen: React.FC<Props> = ({ route, navigation }) => {
  // Destructure trip details from route params
  const { requestData } = route.params;

  useEffect(() => {
    const generatePlan = async () => {
      try {
        const response = await axios.post(
          'https://thambapanni-backend.vercel.app/api/generate-trip-plan',
          requestData,
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
        // Simulate some processing time
        await new Promise(resolve => setTimeout(resolve, 3000));

        if (response.data.success && response.data.tripPlan) {
          navigation.replace('TripPlanResult', {
            tripPlan: response.data.tripPlan
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error:', error);
        Alert.alert(
          'Error',
          'Failed to generate trip plan. Please try again.',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.goBack() 
            }
          ]
        );
      }
    };

    generatePlan();
  }, [navigation, requestData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Please Wait...</Text>
      <Text style={styles.subtitle}>Generating Your Trip</Text>

      <View style={styles.animationContainer}>
        <LottieView
          source={require('../../../assets/animations/Animation - 1738938094037.json')} 
          autoPlay
          loop
          style={styles.animation}
        />
      </View>

      <Text style={styles.warningText}>Don't go back</Text>

      <View style={styles.bottomBar}>
        <Text style={styles.loadingText}>Generating...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  animationContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  warningText: {
    fontSize: 14,
    color: '#888',
    marginTop: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TripGenerationScreen;