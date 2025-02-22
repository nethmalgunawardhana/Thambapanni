import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Guides from '../components/GuideSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../../services/config'; // Ensure this is correctly set

type RootStackParamList = {
  TripResult: { success: boolean; tripPlan: any };
  SelectGuide: { tripPlan: any; selectedVehicle?: any };
  BudgetReport: { tripPlan: any; selectedGuide?: any; selectedVehicle?: any; confirmationStatus?: string };
};

type SelectGuideScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SelectGuide'>;
  route: { params: { tripPlan: any; selectedVehicle?: any } };
};

const confirmGuideRequest = async (data: {
  tripId: string;
  guideId: string;
  tripDetails: any;
  guidePrice: number;
  token: string;
}) => {
  try {
    const response = await axios.post(
      `${API_URL}/guides/request-confirmation`,
      data,
      {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      }
    );

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Failed to confirm guide.');
    }
  } catch (error: any) {
    console.error('Error confirming guide:', error);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      throw new Error(error.response.data.message || 'Request failed with status code ' + error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response received from the server.');
    } else {
      // Something happened in setting up the request
      throw new Error('Error setting up the request: ' + error.message);
    }
  }
};

const SelectGuideScreen: React.FC<SelectGuideScreenProps> = ({ navigation, route }) => {
  const { tripPlan, selectedVehicle } = route.params;

  const handleGuideSelect = async (guide: any) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Error', 'User token not found. Please log in again.');
        return;
      }

      const response = await confirmGuideRequest({
        tripId: tripPlan.tripId,
        guideId: guide.id,
        tripDetails: tripPlan,
        guidePrice: guide.pricePerKm * tripPlan.distanceInfo.totalDistanceKm,
        token,
      });

      if (response.success) {
        navigation.navigate('BudgetReport', {
          tripPlan,
          selectedGuide: guide,
          selectedVehicle,
          confirmationStatus: 'pending', // Initial status
        });
      } else {
        Alert.alert('Error', response.message || 'Failed to send guide confirmation request.');
      }
    } catch (error: any) {
      console.error('Error confirming guide:', error);
      Alert.alert(
        'Error',
        error.message || 'An error occurred while confirming the guide.'
      );
    }
  };

  const handleSkip = () => {
    navigation.navigate('BudgetReport', { tripPlan, selectedVehicle });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Guide</Text>
      <Guides onGuideSelect={handleGuideSelect} tripPlan={tripPlan} />
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  skipButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FF9800',
    borderRadius: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SelectGuideScreen;