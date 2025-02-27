import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import {
  submitGuideApplication,
  getApplicationStatus,
} from '../../../services/guides/request';
import Guides from '../components/GuidesDisplay';

const JoinTeamForm: React.FC<{
  visible: boolean;
  onClose: () => void;
  fetchApplicationStatus: () => Promise<void>;
}> = ({ visible, onClose, fetchApplicationStatus }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    languages: '',
    location: '',
    experience: '',
    license: null as { name: string; uri: string; type: string } | null,
  });

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const fileUri = result.assets[0]?.uri.startsWith('file://')
        ? result.assets[0]?.uri
        : `file://${result.assets[0]?.uri}`;

      setFormData({
        ...formData,
        license: {
          name: result.assets[0]?.name,
          uri: fileUri,
          type: 'application/pdf',
        },
      });
    } catch (err) {
      Alert.alert('Error', 'Failed to pick the document');
    }
  };

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.email || !formData.phone || !formData.languages || !formData.location || !formData.license) {
      Alert.alert('Error', 'All fields are required, including the license file.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('fullName', formData.fullName);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('languages', formData.languages);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('experience', formData.experience || '');
    formDataToSend.append('license', {
      uri: formData.license.uri,
      name: formData.license.name,
      type: 'application/pdf',
    } as any);

    try {
      await submitGuideApplication(formDataToSend);
      Alert.alert('Success', 'Application submitted successfully!');
      fetchApplicationStatus();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit the application.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Join Our Guide Team</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TextInput
              style={styles.formInput}
              placeholder="Full Name"
              placeholderTextColor="#666"
              value={formData.fullName}
              onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Phone Number"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Languages Spoken"
              placeholderTextColor="#666"
              value={formData.languages}
              onChangeText={(text) => setFormData({ ...formData, languages: text })}
            />
            <TextInput
              style={styles.formInput}
              placeholder="Base Location"
              placeholderTextColor="#666"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />
            <TextInput
              style={[styles.formInput, styles.textArea]}
              placeholder="Experience Description"
              placeholderTextColor="#666"
              multiline
              numberOfLines={4}
              value={formData.experience}
              onChangeText={(text) => setFormData({ ...formData, experience: text })}
            />

            <View style={styles.licenseContainer}>
              <Text style={styles.licenseLabel}>
                SLTDA Tourist Guide License (PDF)*
              </Text>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleDocumentPick}
              >
                <Ionicons name="document-attach" size={24} color="#00BFA6" />
                <Text style={styles.uploadButtonText}>
                  {formData.license ? formData.license.name : 'Upload License'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Submit Application</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const TopGuides: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isOfficialGuide, setIsOfficialGuide] = useState(false);

  const fetchApplicationStatus = async () => {
    try {
      const response = await getApplicationStatus();

      if (response.message === 'No application found.') {
        setStatusMessage('You haven’t applied yet.');
        setIsOfficialGuide(false);
      } else {
        setStatusMessage(response.message);
        setIsOfficialGuide(response.message === 'You are an official guide for the Thambapanni team.');
      }
    } catch (error: any) {
      setStatusMessage('You can apply apply with our guide team.');
      setIsOfficialGuide(false);
    }
  };

  useEffect(() => {
    // Fetch application status immediately on component mount
    fetchApplicationStatus();

    // Poll the application status every 1 second
    const intervalId = setInterval(() => {
      fetchApplicationStatus();
    }, 1000);

    // Clear interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      
      <Text style={styles.statusMessage}>{statusMessage}</Text>
      {!isOfficialGuide && (
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => setIsFormVisible(true)}
        >
          <Text style={styles.joinButtonText}>Join Our Guide Team</Text>
        </TouchableOpacity>
      )}

      <JoinTeamForm
        visible={isFormVisible}
        onClose={() => setIsFormVisible(false)}
        fetchApplicationStatus={fetchApplicationStatus}
      />

      <Guides />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flex: 1,
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  title: {
    marginTop: 16,
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.7,
    marginBottom: 24,
  },
  joinButton: {
    backgroundColor: '#00BFA6',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    elevation: 4,
    shadowColor: '#00BFA6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    marginVertical: 16,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 17,
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  statusMessage: {
    marginTop: -20,
    marginBottom: 0,
    fontSize: 16,
    color: '#34D399',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(5px)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    width: '92%',
    maxHeight: '88%',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.8,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    marginBottom: 18,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  textArea: {
    height: 140,
    textAlignVertical: 'top',
    paddingTop: 18,
    lineHeight: 24,
  },
  licenseContainer: {
    marginBottom: 24,
    marginTop: 8,
  },
  licenseLabel: {
    fontSize: 17,
    color: '#1A1A1A',
    marginBottom: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FDFB',
    borderRadius: 14,
    padding: 20,
    borderWidth: 2,
    borderColor: '#00BFA6',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    marginLeft: 14,
    color: '#4A4A4A',
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#00BFA6',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 28,
    elevation: 4,
    shadowColor: '#00BFA6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.8,
  },
});

export default TopGuides;
