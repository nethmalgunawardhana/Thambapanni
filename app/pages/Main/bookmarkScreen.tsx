import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../../services/config';
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
  
  type TripPlan = {
    id: string;
    tripTitle: string;
    coverImage: string;
    days: DayData[];
    estimatedTotalCost: string;
  };

type RootStackParamList = {
  BookmarkedTrips: undefined;
  TripResult: { success: boolean; tripPlan: TripPlan };
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};



const BookmarkedTripsScreen: React.FC<Props> = ({ navigation }) => {
  const [bookmarkedTrips, setBookmarkedTrips] = useState<TripPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBookmarkedTrips();
  }, []);

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      return token;
    } catch (error) {
      throw new Error('Authentication required');
    }
  };

  const fetchBookmarkedTrips = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/api/bookmarks/get`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookmarked trips');
      }

      const data = await response.json();
      if (data.success) {
        setBookmarkedTrips(data.trips);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      console.error('Error fetching bookmarked trips:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchBookmarkedTrips();
  }, []);

  const handleTripPress = (tripPlan: TripPlan) => {
    try {
      const formattedTripPlan = {
        ...tripPlan,
        days: tripPlan.days.map((day, index) => ({
          ...day,
          day: index + 1,
          activities: day.activities.map(activity => ({
            ...activity,
            time: activity.time || '09:00 AM',
            description: activity.description || 'Visit this beautiful destination',
          }))
        }))
      };

      navigation.navigate('TripResult', {
        success: true,
        tripPlan: formattedTripPlan
      });
    } catch (error) {
      console.error('Error handling trip press:', error);
      Alert.alert('Error', 'Failed to open trip details. Please try again.');
    }
  };

  const renderTripCard = ({ item }: { item: TripPlan }) => (
    <TouchableOpacity
      style={styles.tripCard}
      onPress={() => handleTripPress(item)}
    >
      <Image
        source={require('../../../assets/images/cover.jpg')}
        style={styles.tripImage}
        defaultSource={require('../../../assets/images/cover.jpg')}
      />
      <View style={styles.tripInfo}>
        <Text style={styles.tripTitle}>{item.tripTitle}</Text>
        <View style={styles.tripDetails}>
          <Icon name="calendar-outline" size={16} color="#666" />
          <Text style={styles.tripDetailText}>{item.days.length} Days</Text>
          <Icon name="wallet-outline" size={16} color="#666" style={styles.detailIcon} />
          <Text style={styles.tripDetailText}>{item.estimatedTotalCost}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Icon name="bookmark-outline" size={48} color="#666" />
      <Text style={styles.emptyStateText}>
        No bookmarked trips yet
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={48} color="#FF5252" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchBookmarkedTrips}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Bookmarked Trips</Text>
      </View>

      <FlatList
        data={bookmarkedTrips}
        renderItem={renderTripCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '600',
    marginLeft: 90,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tripImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#F0F0F0',
  },
  tripInfo: {
    padding: 16,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  detailIcon: {
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    minHeight: 300,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default BookmarkedTripsScreen;