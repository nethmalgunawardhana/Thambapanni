import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrendingDestinationsSection from '../components/TrendingDestinations';
import { DeviceEventEmitter } from 'react-native';
import { API_URL } from '../../../services/config';
import { fetchVerifiedGuides } from '../../../services/guides/request';
import { useNavigation } from '@react-navigation/native';

interface Trip {
  name: string;
  date: string;
  nextStop?: string;
  locations?: string[];
  travelers?: number;
  price?: string;
  image?: string;
}

interface TripPlan {
  id: string;
  tripTitle: string;
  coverImage: string;
  days: any[];
  estimatedTotalCost: string;
}

interface Guide {
  fullName: string;
  rating: number;
  trips: number;
  location: string;
  languages: string;
  profilePhoto: string;
}

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  nationality: string;
  gender: string;
  profilePhoto?: string;
}

const { width } = Dimensions.get('window');
const defaultImage: ImageSourcePropType = require('../../../assets/images/tripplan-cover.jpg');
const defaultProfileImage: ImageSourcePropType = require('../../../assets/images/defaultimage.png');

const UserProfile = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserProfile();
    const subscription = DeviceEventEmitter.addListener(
      'profileUpdated',
      fetchUserProfile
    );
    return () => {
      subscription.remove();
    };
  }, [fetchUserProfile]);

  if (loading) {
    return (
      <View style={styles.profileContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.profileContainer}>
        <Text>No profile data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.profileContainer}>
      <View style={styles.profilePhotoContainer}>
        {profile.profilePhoto ? (
          <Image source={{ uri: profile.profilePhoto }} style={styles.profilePhoto} />
        ) : (
          <View style={[styles.profilePhoto, styles.placeholderPhoto]}>
            <Text style={styles.placeholderText}>
              {profile.firstName?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.profileInfo}>
        <Text style={styles.welcomeText}>
          Hi {profile.firstName} {profile.lastName}
        </Text>
       
      </View>
    </View>
  );
};

const TripCard: React.FC<{ tripPlan: TripPlan; onBookmark: (id: string) => void; isBookmarked: boolean }> = ({ 
  tripPlan, 
  onBookmark,
  isBookmarked 
}) => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.bookmarkContainer}>
          <TouchableOpacity onPress={() => onBookmark(tripPlan.id)}>
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color="#FF9800" 
            />
          </TouchableOpacity>
          <Text style={styles.tripName}>{tripPlan.tripTitle}</Text>
        </View>
      </View>
      
      <Image
        source={tripPlan.coverImage ? { uri: tripPlan.coverImage } : defaultImage}
        style={styles.tripImage}
      />
      
    
      
      <TouchableOpacity 
        style={styles.detailsButton}
        onPress={() => navigation.navigate('TripResult', { 
          success: true, 
          tripPlan 
        })}
      >
        <Text style={styles.detailsButtonText}>Details</Text>
      </TouchableOpacity>
    </View>
  );
};
const GuideCard: React.FC<{ guide: Guide; navigation: any }> = ({ guide, navigation }) => (
  <View style={styles.guideCard}>
    <Image source={defaultProfileImage} style={styles.image} />
    <View style={styles.guideInfo}>
      <Text style={styles.guideName}>{guide.fullName}</Text>
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Ionicons 
            key={i} 
            name={i < Math.floor(guide.rating) ? "star" : "star-outline"} 
            size={16} 
            color="#FFD700" 
          />
        ))}
        <Text style={styles.tripCount}>{guide.trips} Trips</Text>
      </View>
      <Text style={styles.guideLocation}>{guide.location}</Text>
      <Text style={styles.guideLanguages}>{guide.languages}</Text>
    </View>
    <TouchableOpacity 
      style={styles.hireButton}
      onPress={() => {
        // First navigate back to MenuBar if not already there
        navigation.getParent()?.navigate('MenuBar', {
          screen: 'Search' // This specifies which tab in MenuBar
        });
        // Then switch to top guides tab
        setTimeout(() => {
          DeviceEventEmitter.emit('switchToTopGuides');
        }, 100);
      }}
    >
      <Text style={styles.hireButtonText}>SEARCH NOW</Text>
      <Ionicons name="chevron-forward" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default function Dashboard() {
  const navigation = useNavigation<any>();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTrip, setCurrentTrip] = useState<TripPlan | null>(null);
  const [upcomingTrips, setUpcomingTrips] = useState<TripPlan[]>([]);
  const [bookmarkedTrips, setBookmarkedTrips] = useState<Set<string>>(new Set());

  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');
      return token;
    } catch (error) {
      throw new Error('Authentication required');
    }
  };

  const fetchBookmarkedTripIds = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/api/bookmarks/ids`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch bookmarked trip IDs');
      
      const data = await response.json();
      if (data.success) {
        setBookmarkedTrips(new Set(data.bookmarkedIds));
      }
    } catch (error) {
      console.error('Error fetching bookmarked trip IDs:', error);
    }
  };

  const handleBookmark = async (tripId: string) => {
    try {
      const token = await getAuthToken();
      const isBookmarked = bookmarkedTrips.has(tripId);
      const endpoint = isBookmarked ? 'remove' : 'add';
      
      const response = await fetch(`${API_URL}/api/bookmarks/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tripId })
      });

      if (!response.ok) throw new Error('Failed to update bookmark');

      const newBookmarkedTrips = new Set(bookmarkedTrips);
      if (isBookmarked) {
        newBookmarkedTrips.delete(tripId);
      } else {
        newBookmarkedTrips.add(tripId);
      }
      setBookmarkedTrips(newBookmarkedTrips);
    } catch (error) {
      console.error('Error updating bookmark:', error);
    }
  };

  const fetchTripPlans = async () => {
    try {
      const token = await getAuthToken();
      
      // Fetch user's latest trip
      const userResponse = await fetch(`${API_URL}/api/my-trips`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (userResponse.ok) {
        const userTripData = await userResponse.json();
        if (userTripData.success && userTripData.trips.length > 0) {
          setCurrentTrip(userTripData.trips[0]); // Get the latest trip
        }
      }

      // Fetch public trips
      const publicResponse = await fetch(`${API_URL}/api/public`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });
      
      if (publicResponse.ok) {
        const publicData = await publicResponse.json();
        if (publicData.success) {
          setUpcomingTrips(publicData.trips.slice(0, 3)); // Get first 3 public trips
        }
      }
    } catch (error) {
      console.error('Error fetching trip plans:', error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const fetchedGuides = await fetchVerifiedGuides();
        setGuides(fetchedGuides);
        await fetchTripPlans();
        await fetchBookmarkedTripIds();
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <UserProfile />
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Trip</Text>
        {currentTrip && (
          <TripCard 
            tripPlan={currentTrip} 
            onBookmark={handleBookmark}
            isBookmarked={bookmarkedTrips.has(currentTrip.id)}
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming trips</Text>
          <TouchableOpacity 
            style={styles.seeMoreButton}
            onPress={() => navigation.navigate("TripPlans")}
          >
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {upcomingTrips.map((trip) => (
            <View key={trip.id} style={styles.horizontalTripCard}>
              <TripCard 
                tripPlan={trip} 
                onBookmark={handleBookmark}
                isBookmarked={bookmarkedTrips.has(trip.id)}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Guide Team</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading guides...</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {guides.map((guide, index) => (
              <GuideCard key={index} guide={guide} navigation={navigation} />
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Destinations</Text>
        <TrendingDestinationsSection />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  seeMoreButton: {
    padding: 8,
  },
  seeMoreText: {
    color: '#FF9800',
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  horizontalTripCard: {
    width: width - 64,
    marginLeft: 5,
    marginRight: 8,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginRight: 20,
    marginLeft: 10,
  },
  bookmarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tripName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  tripImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
  },
  tripDetails: {
    gap: 8,
  },
  tripInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
   
  },
  detailsButton: {
    backgroundColor: '#34D399',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  guideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginLeft: 6,
    marginRight: 8,
    marginBottom: 8,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  guideContent: {
    alignItems: 'center',
    width: '100%',
  },
  guideImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  guideInfo: {
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  guideName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
  },
  tripCount: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },
  guideLocation: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
    textAlign: 'center',
  },
  guideLanguages: {
    color: '#666',
    fontSize: 14,
    marginTop: 2,
    textAlign: 'center',
  },
  hireButton: {
    backgroundColor: '#34D399',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 6,
    marginTop: 16,
    width: '100%',
  },
  hireButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginRight: 4,
    fontSize: 14,
  },
  profileContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profilePhotoContainer: {
    marginRight: 12,
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  placeholderPhoto: {
    backgroundColor: '#34D399',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  emailText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  loadingText: {
    textAlign: 'center',
    marginLeft: 16,
    color: '#666',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 10,
  },
});