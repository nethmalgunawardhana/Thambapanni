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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../../services/config';
// Shared types
type Activity = {
  time: string;
  destination: string;
  description: string;
  image: string;
};

type DayData = {
  day: number;
  date: string;
  activities: Activity[];
  transportation: string;
  accommodation: string;
  estimatedCost: string;
};

type TripData = {
  tripId: string; 
  tripTitle: string;
  days: DayData[];
};

// Navigation types
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
  TripResult: { success: boolean; tripPlan: TripData };
  Login: undefined;
};

type TripGenerationScreenRouteProp = RouteProp<RootStackParamList, 'TripGeneration'>;
type TripGenerationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TripGeneration'>;

type Props = {
  route: TripGenerationScreenRouteProp;
  navigation: TripGenerationScreenNavigationProp;
};

const TripGenerationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { requestData } = route.params;

  useEffect(() => {
    const generatePlan = async () => {
      try {
         // Get the auth token from AsyncStorage
         const token = await AsyncStorage.getItem('authToken');
        
         if (!token) {
           throw new Error('Authentication token not found');
         }
        const response = await axios.post<{
          success: boolean;
          tripPlan: TripData;
        }>(
          `${ API_URL }/api/generate-trip-plan`,
          requestData,
          {
            headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
             }
          }
        );

        console.log('API Response:', response.data);
        console.log('Trip Plan:', response.data.tripPlan);

        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 3000));

        if (response.data.success && response.data.tripPlan) {
          // Validate the data structure
          if (!response.data.tripPlan.tripTitle || !Array.isArray(response.data.tripPlan.days)) {
            throw new Error('Invalid trip plan format');
          }

          navigation.replace('TripResult', {
            success: true,
            tripPlan: response.data.tripPlan
          });
        } else {
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error:', error);
         // Handle authentication errors separately
         if (error.message === 'Authentication token not found') {
          Alert.alert(
            'Authentication Error',
            'Please log in to generate a trip plan.',
            [
              { 
                text: 'OK', 
                onPress: () => navigation.navigate('Login') 
              }
            ]
          );
          return;
        }
        
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