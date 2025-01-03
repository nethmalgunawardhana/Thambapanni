import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface Stats {
  trips: number;
  points: string;
  comments: number;
}

interface PersonalInfo {
  address: string;
  contact: string;
  email: string;
  gender: string;
}

const defaultStats: Stats = {
  trips: 75,
  points: '4,500',
  comments: 80,
};

const defaultPersonalInfo: PersonalInfo = {
  address: '1234, Sample Street, Sample City',
  contact: '+1 234 567 890',
  email: 'john.doe@example.com',
  gender: 'Male',
};

const ProfileCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.hexagonWrapper}>
          <Image
            source={{ uri: 'https://your-image-url.com/profile.jpg' }}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
        <Text style={styles.name}>John Doe</Text>
        <View style={styles.countryContainer}>
          <Image
            source={{ uri: 'https://flagcdn.com/w20/de.png' }}
            style={styles.flag}
          />
          <Text style={styles.countryText}>Germany</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons
            name='person-outline'
            color='black'
            style={styles.statIcon}
          />
          <Text style={styles.statNumber}>{defaultStats.trips}</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.statItem}>
          <Entypo name='star' color='gold' style={styles.statIcon} />
          <Text style={styles.statNumber}>{defaultStats.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name='comment-text-multiple-outline'
            color='gray'
            style={styles.statIcon}
          />
          <Text style={styles.statNumber}>{defaultStats.comments}</Text>
          <Text style={styles.statLabel}>Comments</Text>
        </View>
      </View>

      <View style={styles.personalInfoContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>John Doe</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Address</Text>
          <Text style={styles.infoValue}>{defaultPersonalInfo.address}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Contact</Text>
          <Text style={styles.infoValue}>{defaultPersonalInfo.contact}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{defaultPersonalInfo.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>{defaultPersonalInfo.gender}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6fff0',
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  hexagonWrapper: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#40bfff',
    overflow: 'hidden',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    width: 20,
    height: 15,
    marginRight: 8,
  },
  countryText: {
    color: '#40bfff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  personalInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#000',
  },
});

export default ProfileCard;
