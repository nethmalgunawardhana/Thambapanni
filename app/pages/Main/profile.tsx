import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  DeviceEventEmitter,
  RefreshControl,
  ScrollView,
  ImageSourcePropType,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import {
  fetchUserProfile,
  updateUserProfile,
  uploadProfilePhoto,
} from '../../../services/profile/profileservices';
import { ProfileData, Stats } from '../../../services/profile/types/profile';

interface ProfileState extends ProfileData {
  stats: Stats;
}

const defaultStats: Stats = {
  trips: 0,
  points: 0,
  comments: 0,
};

const defaultProfileData: ProfileState = {
  firstName: '',
  lastName: '',
  email: '',
  nationality: '',
  gender: '',
  dateOfBirth: '',
  profilePhoto: null,
  stats: defaultStats,
};

const ProfileScreen: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileState>(defaultProfileData);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const loadProfile = async (): Promise<void> => {
    try {
      const data = await fetchUserProfile();
      setProfileData(data);
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile data';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const onRefresh = React.useCallback((): void => {
    setRefreshing(true);
    loadProfile();
  }, []);

  const handleUpdateProfile = async (): Promise<void> => {
    try {
      const dataToUpdate: Partial<ProfileData> = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        nationality: profileData.nationality,
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth,
        profilePhoto: profileData.profilePhoto,
      };

      const response = await updateUserProfile(dataToUpdate);
      Alert.alert('Success', 'Profile updated successfully');
      DeviceEventEmitter.emit('profileUpdated');
      setIsEditing(false);
      loadProfile();
    } catch (error: any) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleImagePick = async (): Promise<void> => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }
  
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        selectionLimit: 1,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
        base64: false,
      });
  
      if (!result.canceled && result.assets[0].uri) {
        const formData = new FormData();
        const response = await fetch(result.assets[0].uri);
        const blob = await response.blob();
        const fileName = `profile-photo-${Date.now()}.jpg`;
        formData.append('profilePhoto', blob, fileName);
  
        try {
          const data = await uploadProfilePhoto(formData);
          setProfileData(prev => ({
            ...prev,
            profilePhoto: data.photoUrl
          }));
          Alert.alert('Success', 'Profile photo updated successfully');
        } catch (error: any) {
          console.error('Image upload error:', error);
          const errorMessage = error.response?.data?.message || 'Failed to upload image';
          Alert.alert('Error', errorMessage);
        }
      }
    } catch (error: any) {
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const renderStats = (): JSX.Element => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Ionicons name="person-outline" size={24} color="black" />
        <Text style={styles.statNumber}>{profileData.stats?.trips || 0}</Text>
        <Text style={styles.statLabel}>Trips</Text>
      </View>
      <View style={styles.statItem}>
        <Entypo name="star" size={24} color="gold" />
        <Text style={styles.statNumber}>{profileData.stats?.points || 0}</Text>
        <Text style={styles.statLabel}>Points</Text>
      </View>
      <View style={styles.statItem}>
        <MaterialCommunityIcons
          name="comment-text-multiple-outline"
          size={24}
          color="gray"
        />
        <Text style={styles.statNumber}>{profileData.stats?.comments || 0}</Text>
        <Text style={styles.statLabel}>Comments</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const defaultAvatar: ImageSourcePropType = require('../../../assets/images/default-avatar.png');

  return (
    <ScrollView
      style={styles.scrollContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
                  : defaultAvatar
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
                onChangeText={(text: string) => setProfileData(prev => ({ ...prev, firstName: text }))}
                placeholder="First Name"
              />
              <TextInput
                style={styles.input}
                value={profileData.lastName}
                onChangeText={(text: string) => setProfileData(prev => ({ ...prev, lastName: text }))}
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
                  onChangeText={(text: string) => setProfileData(prev => ({ ...prev, email: text }))}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Nationality</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.nationality}
                  onChangeText={(text: string) => setProfileData(prev => ({ ...prev, nationality: text }))}
                />
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Gender</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.gender}
                  onChangeText={(text: string) => setProfileData(prev => ({ ...prev, gender: text }))}
                />
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <TextInput
                  style={styles.input}
                  value={profileData.dateOfBirth}
                  onChangeText={(text: string) => setProfileData(prev => ({ ...prev, dateOfBirth: text }))}
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#333',
  },
  editButton: {
    color: '#40bfff',
    fontSize: 14,
    fontWeight: '500',
  },
  infoItem: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryButton: {
    padding: 8,
    backgroundColor: '#40bfff',
    borderRadius: 4,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  }
});

export default ProfileScreen;