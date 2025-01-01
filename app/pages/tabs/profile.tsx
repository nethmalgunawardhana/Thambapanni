import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface ProfileCardProps {
  fullName: string;
  country: string;
  stats: {
    trips: number;
    points: string;
    comments: number;
  };
  personalInfo: {
    address: string;
    contact: string;
    email: string;
    gender: string;
  };
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  fullName = "John Doe",
  country = "Germany",
  stats = {
    trips: 75,
    points: "4,500",
    comments: 80,
  },
  personalInfo = {
    address: "1234, Sample Street, Sample City",
    contact: "+1 234 567 890",
    email: "john.doe@example.com",
    gender: "Male",
  },
}) => {
  return (
    <View style={styles.container}>
      {/* Profile Header Section */}
      <View style={styles.profileHeader}>
        <View style={styles.hexagonWrapper}>
          <Image source={{ uri: "https://your-image-url.com/profile.jpg" }} />
        </View>
        <Text style={styles.name}>{fullName}</Text>
        <View style={styles.countryContainer}>
          <Image
            source={{ uri: "https://flagcdn.com/w20/de.png" }}
            style={styles.flag}
          />
          <Text style={styles.countryText}>{country}</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Ionicons
            name="person-outline"
            color="black"
            style={styles.statIcon}
          />
          <Text style={styles.statNumber}>{stats.trips}</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.statItem}>
          <Entypo name="star" color="gold" style={styles.statIcon} />
          <Text style={styles.statNumber}>{stats.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statItem}>
          <MaterialCommunityIcons
            name="comment-text-multiple-outline"
            color="gray"
            style={styles.statIcon}
          />
          <Text style={styles.statNumber}>{stats.comments}</Text>
          <Text style={styles.statLabel}>Comments</Text>
        </View>
      </View>

      {/* Personal Information Section */}
      <View style={styles.personalInfoContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Full Name</Text>
          <Text style={styles.infoValue}>{fullName}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Address</Text>
          <Text style={styles.infoValue}>{personalInfo.address}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Contact</Text>
          <Text style={styles.infoValue}>{personalInfo.contact}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{personalInfo.email}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Gender</Text>
          <Text style={styles.infoValue}>{personalInfo.gender}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e6fff0",
    borderRadius: 12,
    padding: 16,
    margin: 16,
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  hexagonWrapper: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#40bfff",
    overflow: "hidden",
    marginBottom: 8,
  },
  //   profileImage: {
  //     width: "100%",
  //     height: "100%",
  //   },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  countryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 20,
    height: 15,
    marginRight: 8,
  },
  countryText: {
    color: "#40bfff",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  personalInfoContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: "#000",
  },
});
export default ProfileCard;
