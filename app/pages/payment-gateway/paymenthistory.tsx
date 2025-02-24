import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../../services/config';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const PaymentHistoryScreen = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      
      // Get the authentication token
      const authToken = await AsyncStorage.getItem('authToken');
      if (!authToken) {
        Alert.alert('Authentication Error', 'Please log in to view your payment history');
        navigation.goBack();
        return;
      }
      
      // Fetch payment history from API
      const response = await fetch(`${API_URL}/api/payments/history`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching payment history: ${errorText}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.payments)) {
        setPayments(data.payments);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      Alert.alert(
        'Error',
        'Unable to load payment history. Please try again later.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPaymentHistory();
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = timestamp.seconds 
      ? new Date(timestamp.seconds * 1000) 
      : new Date(timestamp);
      
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const navigateToTripDetails = (tripId) => {
    if (tripId) {
      navigation.navigate('TripDetails', { tripId });
    }
  };

  const renderPaymentItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={styles.paymentCard}
        onPress={() => navigateToTripDetails(item.tripId)}
      >
        <View style={styles.paymentHeader}>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.amount}>{item.amount.toFixed(2)}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
        
        <View style={styles.paymentDetails}>
          <View style={styles.detailRow}>
            <Icon name="calendar-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{formatDate(item.createdAt)}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="card-outline" size={16} color="#666" />
            <Text style={styles.detailText}>
              {item.paymentMethod ? item.paymentMethod.toUpperCase() : 'Card'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Icon name="pricetag-outline" size={16} color="#666" />
            <Text style={styles.detailText} numberOfLines={1}>
              ID: {item.paymentIntentId.substring(0, 15)}...
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.viewTripButton}
            onPress={() => navigateToTripDetails(item.tripId)}
          >
            <Text style={styles.viewTripText}>View Trip</Text>
            <Icon name="chevron-forward" size={16} color="#20B2AA" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'failed':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="receipt-outline" size={60} color="#ccc" />
      <Text style={styles.emptyText}>No payment history found</Text>
      <Text style={styles.emptySubText}>Your completed payments will appear here</Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#20B2AA" />
        <Text style={styles.loadingText}>Loading payment history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Payment History</Text>
      </View>
      
      <FlatList
        data={payments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id || item.paymentIntentId}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={EmptyListComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#20B2AA']}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  paymentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  amount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  paymentDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
    marginTop: 4,
  },
  viewTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  viewTripText: {
    color: '#20B2AA',
    fontWeight: '600',
    marginRight: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#9e9e9e',
    marginTop: 8,
    textAlign: 'center',
  }
});

export default PaymentHistoryScreen;