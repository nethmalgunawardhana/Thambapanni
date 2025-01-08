import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, TextInput, Alert,DeviceEventEmitter } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://thambapanni-backend.vercel.app',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});
const defaultStats = {
  trips: 0,
  points: 0,
  comments: 0,
};
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const ProfileScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    nationality: '',
    gender: '',
    dateOfBirth: '',
    profilePhoto: null,
    stats: defaultStats,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data } = await api.get('/user/profile');
      
      if (data.success) {
        // Ensure stats object exists with default values if not provided
        const stats = data.data.stats || defaultStats;
        setProfileData({
          ...data.data,
          stats: {
            trips: stats.trips || 0,
            points: stats.points || 0,
            comments: stats.comments || 0,
          }
        });
      } else {
        Alert.alert('Error', 'Failed to fetch profile data');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile data';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const dataToUpdate = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        nationality: profileData.nationality,
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth,
        profilePhoto: profileData.profilePhoto,
      };

      const { data } = await api.put('/user/profile-update', dataToUpdate);
      
      if (data.success) {
        Alert.alert('Success', 'Profile updated successfully');
        DeviceEventEmitter.emit('profileUpdated');
        setIsEditing(false);
        fetchUserProfile();
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 2],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        const formData = new FormData();
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        formData.append('profilePhoto', blob, 'profile-photo.jpg');

        try {
          const { data } = await api.post('/user/upload-photo', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          
          if (data.success) {
            setProfileData(prev => ({
              ...prev,
              profilePhoto: data.photoUrl
            }));
          } else {
            Alert.alert('Error', 'Failed to upload image to server');
          }
        } catch (error) {
          console.error('Image upload error:', error);
          const errorMessage = error.response?.data?.message || 'Failed to upload image';
          Alert.alert('Error', errorMessage);
        }
      }
    } catch (error) {
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Ionicons style={styles.itemStyle} name="person-outline" size={42} color="black" />
        <Text style={styles.statNumber}>{profileData.stats?.trips || 0}</Text>
        <Text style={styles.statLabel}>Trips</Text>
      </View>
      <View style={styles.statItem}>
        <Entypo style={styles.itemStyle} name="star" size={42} color="gold" />
        <Text style={styles.statNumber}>{profileData.stats?.points || 0}</Text>
        <Text style={styles.statLabel}>Points</Text>
      </View>
      <View style={styles.statItem}>
        <MaterialCommunityIcons
          style={styles.itemStyle}
          name="comment-text-multiple-outline"
          size={42}
          color="gray"
        />
        <Text style={styles.statNumber}>{profileData.stats?.comments || 0}</Text>
        <Text style={styles.statLabel}>Comments</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity 
          style={styles.hexagonWrapper}
          onPress={isEditing ? handleImagePick : undefined}
        >
          <Image
            source={
              profileData.profilePhoto 
                ? { uri: profileData.profilePhoto }
                : require('../../../assets/images/default-avatar.png')
            }
            style={styles.profileImage}
          />
          {isEditing && (
            <View style={styles.editOverlay}>
              <Text style={styles.editText}>Edit</Text>
            </View>
          )}
        </TouchableOpacity>
        
        {isEditing ? (
          <View style={styles.nameInputContainer}>
            <TextInput
              style={styles.input}
              value={profileData.firstName}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, firstName: text }))}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              value={profileData.lastName}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, lastName: text }))}
              placeholder="Last Name"
            />
          </View>
        ) : (
          <Text style={styles.name}>{`${profileData.firstName} ${profileData.lastName}`}</Text>
        )}

        {profileData.nationality && (
          <View style={styles.countryContainer}>
            <Image
              source={{ uri: `https://flagcdn.com/w20/${profileData.nationality?.toLowerCase()}.png` }}
              style={styles.flag}
            />
            <Text style={styles.countryText}>{profileData.nationality}</Text>
          </View>
        )}
      </View>

      {renderStats()}

      <View style={styles.personalInfoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <TouchableOpacity 
            onPress={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
          >
            <Text style={styles.editButton}>
              {isEditing ? 'Save' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {isEditing ? (
          <View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={profileData.email}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nationality</Text>
              <TextInput
                style={styles.input}
                value={profileData.nationality}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, nationality: text }))}
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <TextInput
                style={styles.input}
                value={profileData.gender}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, gender: text }))}
              />
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <TextInput
                style={styles.input}
                value={profileData.dateOfBirth}
                onChangeText={(text) => setProfileData(prev => ({ ...prev, dateOfBirth: text }))}
                placeholder="YYYY-MM-DD"
              />
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{profileData.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nationality</Text>
              <Text style={styles.infoValue}>{profileData.nationality}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>{profileData.gender}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>{profileData.dateOfBirth}</Text>
            </View>
          </View>
        )}
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
    borderWidth: 3,
    borderColor: '#40bfff',
    overflow: 'hidden',
    marginBottom: 8,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontSize: 14,
  },
  nameInputContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
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
  itemStyle: {
    width: 100,
    height: 100,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#40bfff',
    overflow: 'hidden',
    marginBottom: 8,
    
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  editButton: {
    color: '#40bfff',
    fontSize: 14,
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

export default ProfileScreen;