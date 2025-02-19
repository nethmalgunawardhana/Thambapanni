import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type Vehicle = {
  type: string;
  pricePerKm: number;
  iconName: string;
};

type RootStackParamList = {
  TripResult: { success: boolean; tripPlan: any };
  SelectVehicle: { tripPlan: any };
  SelectGuide: { tripPlan: any; selectedVehicle?: Vehicle };
  BudgetReport: { tripPlan: any; selectedGuide?: any; selectedVehicle?: Vehicle };
  StripePayment: { amount: number; tripId: string };
};

type SelectVehicleScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SelectVehicle'>;
  route: RouteProp<RootStackParamList, 'SelectVehicle'>;
};

const SelectVehicleScreen: React.FC<SelectVehicleScreenProps> = ({ navigation, route }) => {
  const { tripPlan } = route.params;

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const totalDistanceKm = tripPlan.distanceInfo?.totalDistanceKm || 0;

  const vehicles: Vehicle[] = [
    { type: 'Bike', pricePerKm: 0.12, iconName: 'bike' },
    { type: 'Three Wheel', pricePerKm: 0.24, iconName: 'rickshaw' },
    { type: 'Car', pricePerKm: 0.36, iconName: 'car' },
    { type: 'Van', pricePerKm: 0.48, iconName: 'van-passenger' },
    { type: 'Jeep', pricePerKm: 0.60, iconName: 'jeepney' },
    { type: 'Bus', pricePerKm: 0.72, iconName: 'bus' },
  ];

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleNext = () => {
    navigation.navigate('SelectGuide', { tripPlan, selectedVehicle });
  };

  const handleSkip = () => {
    navigation.navigate('SelectGuide', { tripPlan });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Vehicle</Text>
      </View>

      <View style={styles.totalDistanceContainer}>
        <Icon name="map-marker-distance" size={32} color="#FF9800" />
        <Text style={styles.totalDistanceText}>Total Distance: {totalDistanceKm.toFixed(2)} km</Text>
      </View>

      <ScrollView style={styles.vehicleList}>
        {vehicles.map((vehicle, index) => {
          const priceInDollars = vehicle.pricePerKm * totalDistanceKm;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.vehicleCard,
                selectedVehicle?.type === vehicle.type && styles.selectedVehicleCard,
              ]}
              onPress={() => handleVehicleSelect(vehicle)}
            >
              <View style={styles.vehicleIconContainer}>
                <Icon name={vehicle.iconName} size={40} color="#FF9800" />
              </View>
              <View style={styles.vehicleDetails}>
                <Text style={styles.vehicleType}>{vehicle.type}</Text>
                <Text style={styles.vehiclePrice}>$ {priceInDollars.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.nextButton, !selectedVehicle && { backgroundColor: '#ccc' }]}
          onPress={handleNext}
          disabled={!selectedVehicle}
        >
          <Text style={styles.nextButtonText}>Next</Text>
          <Icon name="arrow-right" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 16,
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
  vehicleList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedVehicleCard: {
    backgroundColor: '#FFF3E0',
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  vehicleIconContainer: {
    marginRight: 16,
  },
  vehicleDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  vehiclePrice: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  skipButton: {
    padding: 16,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default SelectVehicleScreen;