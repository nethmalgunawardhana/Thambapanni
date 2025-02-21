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
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  
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
    if (uploadingPhoto) return; // Prevent multiple simultaneous uploads

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library');
      return;
    }
  
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        selectionLimit: 1,
      });
  
      if (!result.canceled && result.assets && result.assets[0].uri) {
        setUploadingPhoto(true);
        
        // Create form data
        const formData = new FormData();
        
        // Get file extension from URI
        const uriParts = result.assets[0].uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formData.append('profilePhoto', {
          uri: result.assets[0].uri,
          name: `profile-photo-${Date.now()}.${fileType}`,
          type: `image/${fileType}`,
        } as any);
  
        try {
          const uploadResponse = await uploadProfilePhoto(formData);
          
          // Update local state with new photo URL
          setProfileData(prev => ({
            ...prev,
            profilePhoto: uploadResponse.photoUrl
          }));
          
          // Update profile with new photo URL
          await updateUserProfile({
            ...profileData,
            profilePhoto: uploadResponse.photoUrl
          });
          
          Alert.alert('Success', 'Profile photo updated successfully');
          DeviceEventEmitter.emit('profilePhotoUpdated');
        } catch (error: any) {
          console.error('Image upload error:', error);
          const errorMessage = error.response?.data?.message || 'Failed to upload image';
          Alert.alert('Error', errorMessage);
        }
      }
    } catch (error: any) {
      console.error('Image pick error:', error);
      Alert.alert('Error', 'Failed to pick image');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const renderStats = (): JSX.Element => (
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

  if (loading) {
    return (
      <View >
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
      <View >
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
    backgroundColor: '#f8f9fa',
    paddingBottom: 80,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  hexagonWrapper: {
    width: 120,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 60,
    borderWidth: 4,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#8b5cf6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  editOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(139, 92, 246, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  nameInputContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    fontSize: 16,
    color: '#1a1b1e',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#1a1b1e',
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  flag: {
    width: 24,
    height: 18,
    marginRight: 8,
    borderRadius: 4,
  },
  countryText: {
    color: '#8b5cf6',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: '28%',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  itemStyle: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#8b5cf6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  personalInfoContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 90,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1b1e',
    letterSpacing: 0.5,
  },
  editButton: {
    color: '#8b5cf6',
    fontSize: 16,
    fontWeight: '600',
  },
  infoItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#1a1b1e',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 16,
    margin: 16,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  }
});

export default ProfileScreen;