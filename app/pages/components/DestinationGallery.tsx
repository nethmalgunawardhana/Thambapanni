import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import  DestinationImage  from './DestinationImage';
import DestinationModal  from './DestinationModal';
import { fetchDestinations} from '../../../services/destinations/images';

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

 const DestinationGallery: React.FC<DestinationGalleryProps> = ({ destinationType , onSaveDestination }) => {
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
        // Call the parent component's callback with the destination name
        onSaveDestination(selectedDestination.name);
        setModalVisible(false);
      } catch (error) {
        console.error('Error saving destination:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {destinations.map((destination) => (
          <DestinationImage
            key={destination.id}
            imageUrl={destination.imageUrl}
            onPress={() => handleImagePress(destination)}
          />
        ))}
      </ScrollView>

      <DestinationModal
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
  
});
export default DestinationGallery;