<<<<<<< HEAD
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
=======
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167

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
<<<<<<< HEAD
  points: '4,500',
=======
  points: "4,500",
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
  comments: 80,
};

const defaultPersonalInfo: PersonalInfo = {
<<<<<<< HEAD
  address: '1234, Sample Street, Sample City',
  contact: '+1 234 567 890',
  email: 'john.doe@example.com',
  gender: 'Male',
=======
  address: "1234, Sample Street, Sample City",
  contact: "+1 234 567 890",
  email: "john.doe@example.com",
  gender: "Male",
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
};

const ProfileCard: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.hexagonWrapper}>
          <Image
<<<<<<< HEAD
            source={{ uri: 'https://your-image-url.com/profile.jpg' }}
            style={{ width: '100%', height: '100%' }}
=======
            source={{ uri: "https://your-image-url.com/profile.jpg" }}
            style={{ width: "100%", height: "100%" }}
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
          />
        </View>
        <Text style={styles.name}>John Doe</Text>
        <View style={styles.countryContainer}>
          <Image
<<<<<<< HEAD
            source={{ uri: 'https://flagcdn.com/w20/de.png' }}
=======
            source={{ uri: "https://flagcdn.com/w20/de.png" }}
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
            style={styles.flag}
          />
          <Text style={styles.countryText}>Germany</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons
<<<<<<< HEAD
            name='person-outline'
            color='black'
=======
            name="person-outline"
            color="black"
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
            style={styles.statIcon}
          />
          <Text style={styles.statNumber}>{defaultStats.trips}</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.statItem}>
<<<<<<< HEAD
          <Entypo name='star' color='gold' style={styles.statIcon} />
=======
          <Entypo name="star" color="gold" style={styles.statIcon} />
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
          <Text style={styles.statNumber}>{defaultStats.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons
<<<<<<< HEAD
            name='comment-text-multiple-outline'
            color='gray'
=======
            name="comment-text-multiple-outline"
            color="gray"
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
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
<<<<<<< HEAD
    backgroundColor: '#e6fff0',
=======
    backgroundColor: "#e6fff0",
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  profileHeader: {
<<<<<<< HEAD
    alignItems: 'center',
=======
    alignItems: "center",
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
    marginBottom: 20,
  },
  hexagonWrapper: {
    width: 80,
    height: 80,
<<<<<<< HEAD
    backgroundColor: '#fff',
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#40bfff',
    overflow: 'hidden',
=======
    backgroundColor: "#fff",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#40bfff",
    overflow: "hidden",
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
<<<<<<< HEAD
    fontWeight: 'bold',
    marginBottom: 4,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
=======
    fontWeight: "bold",
    marginBottom: 4,
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
  },
  flag: {
    width: 20,
    height: 15,
    marginRight: 8,
  },
  countryText: {
<<<<<<< HEAD
    color: '#40bfff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
=======
    color: "#40bfff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
  },
  statIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 16,
<<<<<<< HEAD
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  personalInfoContainer: {
    backgroundColor: '#fff',
=======
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  personalInfoContainer: {
    backgroundColor: "#fff",
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
<<<<<<< HEAD
    fontWeight: 'bold',
=======
    fontWeight: "bold",
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
<<<<<<< HEAD
    color: '#666',
=======
    color: "#666",
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
<<<<<<< HEAD
    color: '#000',
=======
    color: "#000",
>>>>>>> 6ae95a48eb2f640c25e6d2c8573f31a7d0f17167
  },
});

export default ProfileCard;
