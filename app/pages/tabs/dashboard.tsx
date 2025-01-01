import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  name: string;
  rating: number;
  trips: number;
  location: string;
  languages: string[];
  image: string;
}

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
    <Image source={{ uri: guide.image }} style={styles.guideImage} />
    <View style={styles.guideInfo}>
      <Text style={styles.guideName}>{guide.name}</Text>
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
      <Text style={styles.guideLanguages}>{guide.languages.join('/')}</Text>
    </View>
    <TouchableOpacity style={styles.hireButton}>
      <Text style={styles.hireButtonText}>HIRE NOW</Text>
      <Ionicons name="chevron-forward" size={20} color="#fff" />
    </TouchableOpacity>
  </View>
);

export default function Dashboard() {
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

  const guides: Guide[] = [
    {
      name: 'Kiyan Gathota',
      rating: 5,
      trips: 124,
      location: 'Colombo',
      languages: ['French', 'German'],
      image: 'https://example.com/guide1.jpg'
    },
    {
      name: 'Sumudu Kodikara',
      rating: 4.5,
      trips: 124,
      location: 'Galle',
      languages: ['French', 'German'],
      image: 'https://example.com/guide2.jpg'
    }
  ];

  return (
    
       <ScrollView style={styles.container}  contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Hi Harris...</Text>
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
          <Text style={styles.sectionTitle}>Hire a Guide</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {guides.map((guide, index) => (
              <GuideCard key={index} guide={guide} />
            ))}
          </ScrollView>
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
    paddingBottom: 90, //  padding to prevent MenuBar overlap
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
  },
  guideImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 8,
  },
  guideInfo: {
    gap: 4,
  },
  guideName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripCount: {
    marginLeft: 8,
    color: '#666',
  },
  guideLocation: {
    color: '#666',
  },
  guideLanguages: {
    color: '#666',
  },
  hireButton: {
    backgroundColor: '#34D399',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 6,
    marginTop: 12,
  },
  hireButtonText: {
    color: '#fff',
    fontWeight: '500',
    marginRight: 4,
  },
});