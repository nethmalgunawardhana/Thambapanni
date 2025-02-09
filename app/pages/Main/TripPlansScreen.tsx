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

// Types
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
  TripPlans: undefined;
  PlanningTrip: undefined;
  TripResult: { success: boolean; tripPlan: TripPlan };
};

type Props = {
  navigation: StackNavigationProp<RootStackParamList>;
};

const API_BASE_URL = 'https://thambapanni-backend.vercel.app/api';

const TripPlansScreen: React.FC<Props> = ({ navigation }) => {
  const [myTripPlans, setMyTripPlans] = useState<TripPlan[]>([]);
  const [publicTripPlans, setPublicTripPlans] = useState<TripPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'myTrips' | 'public'>('myTrips');
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    setError(null);
    await fetchTripPlans();
  };

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

  const fetchTripPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await getAuthToken();
      if (!token) {
        throw new Error('Authentication required');
      }
      // Fetch user's trip plans
      const userResponse = await fetch(`${API_BASE_URL}/my-trips`,{
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!userResponse.ok) {
        if (userResponse.status === 401) {
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }

      const userTripData = await userResponse.json();
      if (userTripData.success) {
        setMyTripPlans(userTripData.trips);
      }

      // Fetch public trip plans
      const publicResponse = await fetch(`${API_BASE_URL}/public`,{
        headers: { 'Content-Type': 'application/json' }
      });
      if (!publicResponse.ok) {
        throw new Error(`HTTP error! status: ${publicResponse.status}`);
      }
      const publicTripPlans = await publicResponse.json();
      setPublicTripPlans(publicTripPlans);

    } catch (error) {
      console.error('Error fetching trip plans:', error);
      setError('Failed to load trip plans. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTripPlans();
  }, [userId]);

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
      <Icon name="document-outline" size={48} color="#666" />
      <Text style={styles.emptyStateText}>
        {activeTab === 'myTrips' 
          ? "You haven't created any trips yet"
          : "No public trips available"}
      </Text>
    </View>
  );

  const renderContent = () => {
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
          <TouchableOpacity style={styles.retryButton} onPress={fetchTripPlans}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={activeTab === 'myTrips' ? myTripPlans : publicTripPlans}
        renderItem={renderTripCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip Plans</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'myTrips' && styles.activeTab]}
          onPress={() => setActiveTab('myTrips')}
        >
          <Text style={[styles.tabText, activeTab === 'myTrips' && styles.activeTabText]}>
            My Trips
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'public' && styles.activeTab]}
          onPress={() => setActiveTab('public')}
        >
          <Text style={[styles.tabText, activeTab === 'public' && styles.activeTabText]}>
            Public Trips
          </Text>
        </TouchableOpacity>
      </View>

      {renderContent()}
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
    fontSize: 24,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF9800',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#FF9800',
    fontWeight: '600',
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

export default TripPlansScreen;