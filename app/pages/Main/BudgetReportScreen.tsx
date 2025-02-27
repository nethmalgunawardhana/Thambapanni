import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../../services/config'; // Ensure this is correctly set

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
  distanceInfo?: {
    totalDistanceKm: number;
    dailyBreakdown: {
      day: number;
      distanceKm: number;
    }[];
  };
};

type RootStackParamList = {
  BudgetReport: { tripPlan: TripData; selectedGuide?: any; selectedVehicle?: any; confirmationStatus?: string };
  StripePayment: { amount: number; tripId: string };
  SelectGuide: { tripPlan: TripData; selectedVehicle?: any };
};

type BudgetReportScreenProps = {
  route: RouteProp<RootStackParamList, 'BudgetReport'>;
  navigation: StackNavigationProp<RootStackParamList>;
};

const getGuideConfirmationStatus = async (tripId: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/guides/confirmation-status/${tripId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching confirmation status:', error);
    throw error;
  }
};

const BudgetReportScreen: React.FC<BudgetReportScreenProps> = ({ navigation, route }) => {
  const { tripPlan, selectedGuide, selectedVehicle, confirmationStatus: initialStatus } = route.params;
  const [confirmationStatus, setConfirmationStatus] = useState(initialStatus || 'pending');

  useEffect(() => {
    const fetchConfirmationStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Error', 'User token not found. Please log in again.');
          return;
        }

        const response = await getGuideConfirmationStatus(tripPlan.tripId, token);
        if (response.success) {
          setConfirmationStatus(response.status);
        }
      } catch (error) {
        console.error('Error fetching confirmation status:', error);
      }
    };

    if (selectedGuide) {
      fetchConfirmationStatus();
      const interval = setInterval(fetchConfirmationStatus, 5000); // Poll every 5 seconds
      return () => clearInterval(interval);
    }
  }, [selectedGuide, tripPlan.tripId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF9800'; // Orange
      case 'confirmed':
        return '#4CAF50'; // Green
      case 'rejected':
        return '#FF0000'; // Red
      default:
        return '#333'; // Default color
    }
  };

  const totalDistanceKm = tripPlan.distanceInfo?.totalDistanceKm || 0;
  const totalEstimatedCost = tripPlan.days.reduce((total, day) => {
    const cost = parseFloat(day.estimatedCost.replace(/[^0-9.]/g, ''));
    return total + (isNaN(cost) ? 0 : cost);
  }, 0);

  const vehicleCost = selectedVehicle ? selectedVehicle.pricePerKm * totalDistanceKm : 0;
  const guideCost = selectedGuide ? (selectedGuide.pricePerKm || 0.5) * totalDistanceKm : 0;
  const totalBudget = totalEstimatedCost + vehicleCost + guideCost;

  const totalDestinations = tripPlan.days.reduce((total, day) => total + day.activities.length, 0);
  const totalAccommodations = tripPlan.days.filter(day => day.accommodation).length;

  const handleProceedToPayment = () => {
    if (selectedGuide && confirmationStatus !== 'confirmed') {
      Alert.alert('Guide Not Confirmed', 'Please wait for the guide to confirm the request.');
      return;
    }
    navigation.navigate('StripePayment', { amount: totalBudget, tripId: tripPlan.tripId });
  };
  const handleSelectAnotherGuide = () => {
    navigation.navigate('SelectGuide', { tripPlan, selectedVehicle });
  };
  return (
    <SafeAreaView style={styles.container}>
     
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon2 name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Budget Report</Text>
        </View>

        {/* Guide Confirmation Status */}
        {selectedGuide && (
          <View style={styles.confirmationStatusContainer}>
            <Text style={styles.confirmationStatusText}>
              Guide Confirmation Status: <Text style={{ color: getStatusColor(confirmationStatus) }}>{confirmationStatus}</Text>
            </Text>
            {confirmationStatus === 'rejected' && (
              <View style={styles.rejectedContainer}>
              <Text style={styles.rejectedText}>Please select another guide.</Text>
              <TouchableOpacity
                style={styles.selectAnotherGuideButton}
                onPress={handleSelectAnotherGuide}
              >
                <Text style={styles.selectAnotherGuideButtonText}>Select Another Guide</Text>
              </TouchableOpacity>
            </View>
            )}
          </View>
        )}

        {/* Total Distance */}
        <View style={styles.totalDistanceContainer}>
          <Icon name="map-marker-distance" size={32} color="#FF9800" />
          <Text style={styles.totalDistanceText}>
            Total Distance: {totalDistanceKm.toFixed(2)} km
          </Text>
        </View>

        {/* Selected Guide Information */}
        {selectedGuide && (
          <View style={styles.guideInfoContainer}>
            <Text style={styles.guideInfoTitle}>Selected Guide:</Text>
            <Text style={styles.guideInfoText}>Name: {selectedGuide.fullName}</Text>
            <Text style={styles.guideInfoText}>Location: {selectedGuide.location}</Text>
            <Text style={styles.guideInfoText}>Languages: {selectedGuide.languages}</Text>
            <Text style={styles.guideInfoText}>Cost: $ {guideCost.toFixed(2)}</Text>
          </View>
        )}

        {/* Selected Vehicle Information */}
        {selectedVehicle && (
          <View style={styles.vehicleInfoContainer}>
            <Text style={styles.vehicleInfoTitle}>Selected Vehicle:</Text>
            <Text style={styles.vehicleInfoText}>Type: {selectedVehicle.type}</Text>
            <Text style={styles.vehicleInfoText}>Cost: $ {vehicleCost.toFixed(2)}</Text>
          </View>
        )}

        {/* Trip Statistics */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{tripPlan.days.length} Days</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Destinations</Text>
            <Text style={styles.statValue}>{totalDestinations}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Accommodations</Text>
            <Text style={styles.statValue}>{totalAccommodations}</Text>
          </View>
        </View>

        {/* Cost Breakdown */}
        <View style={styles.costContainer}>
          {tripPlan.days.map((day, index) => (
            <View key={index} style={styles.costItem}>
              <Text style={styles.costLabel}>Day {day.day}</Text>
              <Text style={styles.costValue}>{day.estimatedCost}</Text>
            </View>
          ))}

          {selectedVehicle && (
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Vehicle Cost</Text>
              <Text style={styles.costValue}>$ {vehicleCost.toFixed(2)}</Text>
            </View>
          )}

          {selectedGuide && (
            <View style={styles.costItem}>
              <Text style={styles.costLabel}>Guide Cost</Text>
              <Text style={styles.costValue}>$ {guideCost.toFixed(2)}</Text>
            </View>
          )}

          <View style={[styles.costItem, styles.totalCostItem]}>
            <Text style={styles.totalLabel}>Total Budget</Text>
            <Text style={styles.totalValue}>$ {totalBudget.toFixed(2)}</Text>
          </View>
        </View>

        {/* Proceed Button */}
        <TouchableOpacity
          style={[
            styles.proceedButton,
            selectedGuide && confirmationStatus !== 'confirmed' && styles.disabledButton,
          ]}
          onPress={handleProceedToPayment}
          disabled={selectedGuide && confirmationStatus !== 'confirmed'}
        >
          <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
          <Icon2 name="arrow-forward" size={24} color="#FFF" style={styles.proceedIcon} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  header2: {
    flexDirection: 'row',
   
   
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginRight: 28,
  },
  confirmationStatusContainer: {
    padding: 16,
    backgroundColor: '#FFF3E0',
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmationStatusText: {
    fontSize: 16,
    fontWeight: '500',
    
  },
  rejectedText: {
    fontSize: 14,
    color: '#FF0000',
    marginTop: 8,
  },
  totalDistanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFF3E0',
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  totalDistanceText: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 8,
    color: '#333',
  },
  statsContainer: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  costContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#E8FFF1',
    borderRadius: 8,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  costLabel: {
    fontSize: 16,
    color: '#666',
  },
  costValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  totalCostItem: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 12,
    marginTop: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#20B2AA',
  },
  proceedButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#20B2AA',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  proceedIcon: {
    marginLeft: 4,
  },
  guideInfoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  guideInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  guideInfoText: {
    fontSize: 16,
    color: '#333',
  },
  vehicleInfoContainer: {
    margin: 16,
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  vehicleInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  vehicleInfoText: {
    fontSize: 16,
    color: '#333',
  },
  rejectedContainer: {
    marginTop: 2,
    alignItems: 'center',
  },
  selectAnotherGuideButton: {
    backgroundColor: '#20B2AA',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  selectAnotherGuideButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BudgetReportScreen;