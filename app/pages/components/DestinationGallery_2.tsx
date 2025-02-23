import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import DestinationImage_2 from './DestinationImage_2';
import DestinationModal_2 from './DestinationModal_2';
import { fetchDestinations } from '../../../services/destinations/images';

interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  type: string;
}

interface DestinationGalleryProps {
  destinationType: string;
  onSaveDestination: (destinationName: string) => void;
}

const DestinationGallery_2: React.FC<DestinationGalleryProps> = ({ destinationType, onSaveDestination }) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadDestinations();
  }, [destinationType]);

  const loadDestinations = async () => {
    try {
      const data = await fetchDestinations(destinationType);
      setDestinations(data);
    } catch (error) {
      console.error('Error loading destinations:', error);
    }
  };

  const handleImagePress = (destination: Destination) => {
    setSelectedDestination(destination);
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (selectedDestination) {
      try {
        onSaveDestination(selectedDestination.name);
        setModalVisible(false);
      } catch (error) {
        console.error('Error saving destination:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {destinations.map((destination) => (
          <View key={destination.id} style={styles.imageContainer}>
            <DestinationImage_2
              imageUrl={destination.imageUrl}
              onPress={() => handleImagePress(destination)}
            />
          </View>
        ))}
      </ScrollView>

      <DestinationModal_2
        visible={modalVisible}
        destination={selectedDestination}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10,
  },
  imageContainer: {
    marginBottom: 15, // Adds space between images
  }
});

export default DestinationGallery_2;