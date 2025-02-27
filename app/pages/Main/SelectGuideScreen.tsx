import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Guides from '../components/GuideSelect';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../../services/config'; // Ensure this is correctly set
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo

type RootStackParamList = {
  TripResult: { success: boolean; tripPlan: any };
  SelectGuide: { tripPlan: any; selectedVehicle?: any };
  BudgetReport: { tripPlan: any; selectedGuide?: any; selectedVehicle?: any; confirmationStatus?: string };
};

type SelectGuideScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SelectGuide'>;
  route: { params: { tripPlan: any; selectedVehicle?: any } };
};

// Modified function in SelectGuideScreen.tsx
const confirmGuideRequest = async (data: {
  tripId: string;
  guideId: string;
  tripDetails: any;
  guidePrice: number;
  token: string;
}) => {
  try {
    // Add better logging to debug the issue
    console.log('Sending guide confirmation request with data:', {
      tripId: data.tripId,
      guideId: data.guideId,
      guidePrice: data.guidePrice
    });
    
    const response = await axios.post(
      `${API_URL}/guides/request-confirmation`,
      {
        tripId: data.tripId,
        guideId: data.guideId,
        tripDetails: data.tripDetails,
        guidePrice: data.guidePrice
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`
        }
      }
    );

    console.log('API Response:', response.data);
    
    // More robust response checking
    if (response.data && (response.data.success || response.status === 200)) {
      return response.data;
    } else {
      throw new Error(
        (response.data && response.data.message) ||
        'Failed to confirm guide. Server did not return success status.'
      );
    }
  } catch (error: any) {
    console.error('Error confirming guide:', error);

    // More detailed error logging
    if (error.response) {
      console.error('Server responded with:', {
        status: error.response.status,
        data: error.response.data
      });
      throw new Error(error.response.data?.message || `Request failed with status code ${error.response.status}`);
    } else if (error.request) {
      console.error('No response received from server');
      throw new Error('No response received from the server. Please check your internet connection.');
    } else {
      console.error('Error setting up request:', error.message);
      throw new Error(`Error setting up the request: ${error.message}`);
    }
  }
};

const SelectGuideScreen: React.FC<SelectGuideScreenProps> = ({ navigation, route }) => {
  const { tripPlan, selectedVehicle } = route.params;

  const handleGuideSelect = async (guide: any) => {
    try {
      
      
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Authentication Error', 'User token not found. Please log in again.');
        return;
      }
      
      // Calculate the guide price correctly
      const guidePrice = guide.pricePerKm *
        (tripPlan.distanceInfo?.totalDistanceKm || 0);
      
      // Make sure tripId exists
      if (!tripPlan.tripId) {
        Alert.alert('Error', 'Trip ID is missing. Cannot proceed with guide selection.');
        return;
      }
  
      // Log the current searchParams to debug
      console.log('Original searchParams:', JSON.stringify(tripPlan.searchParams));
      
      // Convert members to string to ensure consistent formatting
      // This is important if members is a number but needs to be displayed as text
      const members = tripPlan.searchParams?.members !== undefined 
        ? String(tripPlan.searchParams.members) 
        : 'Not specified';
        
      const budgetRange = tripPlan.searchParams?.budgetRange 
        ? String(tripPlan.searchParams.budgetRange)
        : 'Not specified';
      
      // Enhanced version with more explicit formatting
      const enhancedTripPlan = {
        ...tripPlan,
        searchParams: {
          members: members,
          budgetRange: budgetRange,
          destinations: tripPlan.searchParams?.destinations || [],
          categoryType: tripPlan.searchParams?.categoryType || 'Not specified'
        }
      };
      
      // Log the enhanced searchParams
      console.log('Enhanced searchParams:', JSON.stringify(enhancedTripPlan.searchParams));
  
      // Send the enhanced trip plan data
      const response = await confirmGuideRequest({
        tripId: tripPlan.tripId,
        guideId: guide.id,
        tripDetails: enhancedTripPlan,
        guidePrice: guidePrice,
        token,
      });
  
      // Navigate regardless of response status - we'll check confirmation later
      navigation.navigate('BudgetReport', {
        tripPlan,
        selectedGuide: guide,
        selectedVehicle,
        confirmationStatus: response.status || 'pending',
      });
      
    } catch (error: any) {
      console.error('Error selecting guide:', error);
      Alert.alert(
        'Guide Selection Failed',
        error.message || 'An error occurred while selecting the guide. Please try again.'
      );
    }
  };

  const handleSkip = () => {
    navigation.navigate('BudgetReport', { tripPlan, selectedVehicle });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Select a Guide</Text>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Balance the layout since we have back button on the left
  },
  backButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
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