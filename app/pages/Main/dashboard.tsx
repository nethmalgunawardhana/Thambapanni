import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Dimensions, ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrendingDestinationsSection from '../components/TrendingDestinations';
import { DeviceEventEmitter } from 'react-native';
import { API_URL } from '../../../services/config';
import { fetchVerifiedGuides } from '../../../services/guides/request';

interface Trip {
  name: string;
  date: string;
  nextStop?: string;
  locations?: string[];
  travelers?: number;
  price?: string;
  image?: string;
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
 const defaultImage: ImageSourcePropType = require('../../../assets/images/defaultimage.png');
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
          <Image
            source={{ uri: profile.profilePhoto }}
            style={styles.profilePhoto}
          />
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
        <Text style={styles.emailText}>{profile.email}</Text>
      </View>
    </View>
  );
};

const TripCard: React.FC<{ trip: Trip; upcoming?: boolean }> = ({ trip, upcoming }) => (
  <View style={styles.tripCard}>
    <View style={styles.tripHeader}>
      <View style={styles.bookmarkContainer}>
        <Ionicons name="bookmark-outline" size={24} color="#000" />
        <Text style={styles.tripName}>{trip.name}</Text>
      </View>
      <Text style={styles.tripDate}>{trip.date}</Text>
    </View>
    
    {upcoming && trip.image && (
      <Image
        source={{ uri: trip.image }}
        style={styles.tripImage}
      />
    )}
    
    <View style={styles.tripDetails}>
      {trip.nextStop && (
        <View style={styles.locationRow}>
          <Text>Next Stop</Text>
          <Text>{trip.nextStop}</Text>
        </View>
      )}
      
      {trip.locations?.map((location, index) => (
        <View key={index} style={styles.locationRow}>
          <View style={styles.locationDot} />
          <Text>{location}</Text>
        </View>
      ))}
      
      {trip.travelers && (
        <View style={styles.tripInfo}>
          <Text>{trip.travelers} Travelers</Text>
          <Text>{trip.price}</Text>
        </View>
      )}
    </View>
    
    <TouchableOpacity style={styles.detailsButton}>
      <Text style={styles.detailsButtonText}>Details</Text>
    </TouchableOpacity>
  </View>
);

const GuideCard: React.FC<{ guide: Guide }> = ({ guide }) => (
  <View style={styles.guideCard}>
     <Image source={defaultImage} style={styles.image} />
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
    <TouchableOpacity style={styles.hireButton}>
      <Text style={styles.hireButtonText}>SEARCH NOW</Text>
      <Ionicons name="chevron-forward" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default function Dashboard() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const fetchedGuides = await fetchVerifiedGuides();
        setGuides(fetchedGuides);
      } catch (error) {
        console.error('Error loading guides:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGuides();
  }, []);

  const currentTrip: Trip = {
    name: 'HIGHLAND ESCAPE',
    date: '22 August 2024',
    nextStop: 'Nine Arch',
    locations: ['Queens', 'Park', 'Colombo Fort'],
    travelers: 9,
    price: 'LKR 890000'
  };

  const upcomingTrip: Trip = {
    name: 'NORTHERN HERITAGE',
    date: '30 August 2024',
    locations: ['Jaffna Fort', 'Point Pedro'],
    image: 'https://example.com/trip-image.jpg'
  };

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
        <TripCard trip={currentTrip} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming trips</Text>
        <TripCard trip={upcomingTrip} upcoming />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Guide Team</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading guides...</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {guides.map((guide, index) => (
              <GuideCard key={index} guide={guide} />
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingBottom: 90,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  tripDate: {
    color: '#666',
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginRight: 8,
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
    marginLeft: 16,
    marginRight: 8,
    width: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center', // Center contents horizontally
  },
  guideContent: {
    alignItems: 'center', // Center all guide content
    width: '100%',
  },
  guideImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  guideInfo: {
    alignItems: 'center', // Center all text and elements
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
    justifyContent: 'center', // Center stars and trip count
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
    width: '100%', // Make button full width
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
    marginRight: 15,
  },
});