import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface GuideCardProps {
  name: string;
  language: string;
  baseLocation: string;
  age: number;
  totalTrips: number;
  telephone: string;
  pricePerHour: string;
  rating: number;
}

const GuideCard: React.FC<GuideCardProps> = ({
  name,
  language,
  baseLocation,
  age,
  totalTrips,
  telephone,
  pricePerHour,
  rating,
}) => (
  <View style={styles.guideCard}>
    <View style={styles.guideInfo}>
      <Image
        source={{ uri: 'https://your-image-url.com/profile.jpg' }}
        style={styles.guideImage}
      />
      <View style={styles.guideDetails}>
        <Text style={styles.guideName}>{name}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Language : {language}</Text>
          <Text style={styles.infoText}>Age : {age} years</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>Base Location : {baseLocation}</Text>
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.tripText}>Total Trips : {totalTrips}</Text>
          <View style={styles.ratingContainer}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < rating ? 'star' : 'star-outline'}
                size={16}
                color='#FFD700'
              />
            ))}
          </View>
        </View>
        <Text style={styles.phoneText}>Telephone : {telephone}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{pricePerHour}$ per Hour</Text>
          <TouchableOpacity style={styles.hireButton}>
            <Text style={styles.hireButtonText}>HIRE NOW</Text>
            <Ionicons name='arrow-forward' size={20} color='white' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
);

const TopGuides: React.FC = () => {
  const guides: GuideCardProps[] = [
    {
      name: 'M. SAMEERA PERERA',
      language: 'English',
      baseLocation: 'Jaffna',
      age: 28,
      totalTrips: 15,
      telephone: '+94 77 4688 714',
      pricePerHour: '7',
      rating: 5,
    },
    // Add more guides as needed
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Guides</Text>

      <View style={styles.searchContainer}>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder='Guide Name'
            placeholderTextColor='#666'
          />
          <TextInput
            style={styles.input}
            placeholder='Base Location'
            placeholderTextColor='#666'
          />
        </View>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder='Language'
            placeholderTextColor='#666'
          />
          <TextInput
            style={styles.input}
            placeholder='Date'
            placeholderTextColor='#666'
          />
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.guidesList}>
        {guides.map((guide, index) => (
          <GuideCard key={index} {...guide} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: '#e6fff0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    flex: 0.48,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchButton: {
    backgroundColor: '#00BFA6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  guidesList: {
    flex: 1,
  },
  guideCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e6fff0',
  },
  guideInfo: {
    flexDirection: 'row',
  },
  guideImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  guideDetails: {
    flex: 1,
  },
  guideName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripText: {
    fontSize: 14,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  phoneText: {
    fontSize: 14,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00BFA6',
  },
  hireButton: {
    backgroundColor: '#00BFA6',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  hireButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default TopGuides;
