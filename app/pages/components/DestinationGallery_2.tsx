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

const DestinationGallery_2 = ({ destinationType, onSaveDestination }: DestinationGalleryProps) => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        const data = await fetchDestinations(destinationType);
        setDestinations(data || []); // Ensure we always have an array
      } catch (error) {
        console.error('Error loading destinations:', error);
        setDestinations([]); // Set empty array on error
      }
    };
    loadDestinations();
  }, [destinationType]);

  const handleImagePress = (destination: Destination) => {
    setSelectedDestination(destination);
    setModalVisible(true);
  };

  const handleSave = () => {
    if (selectedDestination) {
      onSaveDestination(selectedDestination.name);
      setModalVisible(false);
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

      {selectedDestination && (
        <DestinationModal_2
          visible={modalVisible}
          destination={selectedDestination}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
        />
      )}
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
    marginBottom: 15,
    alignItems: 'center',
  }
});

export default DestinationGallery_2;