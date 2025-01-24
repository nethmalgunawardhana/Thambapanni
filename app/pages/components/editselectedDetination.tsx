// SelectedDestinationPopup.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { fetchDestinations } from '../../../services/destinations/images';

interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  type: string;
}

interface SelectedDestinationPopupProps {
  visible: boolean;
  destinationName: string;
  destinationType: string;
  onClose: () => void;
  onRemove: () => void;
}

const SelectedDestinationPopup: React.FC<SelectedDestinationPopupProps> = ({
  visible,
  destinationName,
  destinationType,
  onClose,
  onRemove,
}) => {
  const [destinationData, setDestinationData] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && destinationName && destinationType) {
      loadDestinationData();
    }
  }, [visible, destinationName, destinationType]);

  const loadDestinationData = async () => {
    setLoading(true);
    setError(null);
    try {
      const destinations = await fetchDestinations(destinationType);
      const destination = destinations.find(d => d.name === destinationName);
      if (destination) {
        setDestinationData(destination);
      } else {
        setError('Destination not found');
      }
    } catch (err) {
      setError('Error loading destination data');
      console.error('Error loading destination:', err);
    } finally {
      setLoading(false);
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
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Icon name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{destinationName}</Text>
          </View>

          <View style={styles.imageContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#4CAF50" />
            ) : error ? (
              <View style={styles.errorContainer}>
                <Icon name="alert-circle-outline" size={24} color="#FF5252" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : destinationData ? (
              <>
                <Image
                  source={{ uri: destinationData.imageUrl }}
                  style={styles.destinationImage}
                />
                <View style={styles.destinationInfo}>
                  <Text style={styles.description}>
                    {destinationData.description}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{destinationData.rating}</Text>
                  </View>
                </View>
              </>
            ) : null}
          </View>

          <TouchableOpacity 
            style={styles.removeButton}
            onPress={onRemove}
          >
            <Icon name="trash-outline" size={20} color="#fff" />
            <Text style={styles.removeButtonText}>Remove Destination</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    minHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  imageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationImage: {
    width: Dimensions.get('window').width,
    height: 250,
    resizeMode: 'cover',
  },
  destinationInfo: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    marginTop: 8,
    color: '#FF5252',
    fontSize: 14,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5252',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  removeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default SelectedDestinationPopup;