import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon2 from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
  BudgetReport: { tripPlan: TripData; selectedGuide?: any; selectedVehicle?: any };
  StripePayment: { amount: number; tripId: string };
};

type BudgetReportScreenProps = {
  route: RouteProp<RootStackParamList, 'BudgetReport'>;
  navigation: StackNavigationProp<RootStackParamList>;
};

const BudgetReportScreen: React.FC<BudgetReportScreenProps> = ({ navigation, route }) => {
  const { tripPlan, selectedGuide, selectedVehicle } = route.params;

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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon2 name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Budget Report</Text>
        </View>

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
          style={styles.proceedButton}
          onPress={() => navigation.navigate('StripePayment', { amount: totalBudget, tripId: tripPlan.tripId })}
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
    paddingBottom: 20, // Add padding to avoid cutting off the last element
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
});

export default BudgetReportScreen;