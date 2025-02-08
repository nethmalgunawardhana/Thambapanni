import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Types
type RootStackParamList = {
  BudgetReport: { tripData: TripData };
};

type TripData = {
  days: any[];
  totalDestinations: number;
  totalHotels: number;
  memberCount: number;
  costs: {
    transport: number;
    accommodations: number;
    tax: number;
  };
};

type BudgetReportScreenProps = {
  route: RouteProp<RootStackParamList, 'BudgetReport'>;
  navigation: StackNavigationProp<RootStackParamList>;
};

const BudgetReportScreen: React.FC<BudgetReportScreenProps> = ({ navigation, route }) => {
  const { tripData } = route.params;
  const totalPrice = 
    tripData.costs.transport + 
    tripData.costs.accommodations + 
    tripData.costs.tax;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Budget Report</Text>
      </View>

      {/* Trip Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>No of Days</Text>
          <Text style={styles.statValue}>{tripData.days.length}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>No of Destinations</Text>
          <Text style={styles.statValue}>{tripData.totalDestinations}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>No of Hotels</Text>
          <Text style={styles.statValue}>{tripData.totalHotels}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Member Count</Text>
          <Text style={styles.statValue}>{tripData.memberCount}</Text>
        </View>
      </View>

      {/* Cost Breakdown */}
      <View style={styles.costContainer}>
        <View style={styles.costItem}>
          <Text style={styles.costLabel}>Transport</Text>
          <Text style={styles.costValue}>{tripData.costs.transport}</Text>
        </View>
        <View style={styles.costItem}>
          <Text style={styles.costLabel}>Accommodations</Text>
          <Text style={styles.costValue}>{tripData.costs.accommodations}</Text>
        </View>
        <View style={styles.costItem}>
          <Text style={styles.costLabel}>Tax</Text>
          <Text style={styles.costValue}>{tripData.costs.tax}</Text>
        </View>
        <View style={[styles.costItem, styles.totalCostItem]}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalValue}>{totalPrice}</Text>
        </View>
      </View>

      {/* Proceed Button */}
      <TouchableOpacity style={styles.proceedButton}>
        <Text style={styles.proceedButtonText}>Proceed to Pay</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    fontSize: 24,
    color: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  statsContainer: {
    padding: 16,
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
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  proceedButton: {
    margin: 16,
    backgroundColor: '#20B2AA',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  proceedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BudgetReportScreen;