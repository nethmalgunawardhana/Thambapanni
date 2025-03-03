import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

interface DestinationModalProps {
  visible: boolean;
  destination: {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    
    rating: number;
  } | null;
  onClose: () => void;
  onSave: () => void;
}

const DestinationModal: React.FC<DestinationModalProps> = ({
  visible,
  destination,
  onClose,
  onSave,
}) => {
  if (!destination) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image source={{ uri: destination.imageUrl }} style={styles.modalImage} />
          <Text style={styles.title}>{destination.name}</Text>
          <Text style={styles.description}>{destination.description}</Text>
        
          <Text style={styles.rating}>Rating: {destination.rating}/5</Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={onSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({

    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
      },
      modalImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 16,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      description: {
        fontSize: 16,
        marginBottom: 12,
      },
      price: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
      },
      rating: {
        fontSize: 16,
        marginBottom: 16,
      },
      buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      saveButton: {
        backgroundColor: '#34D399',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
      },
      closeButton: {
        backgroundColor: '#666',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
      },
      buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '600',
      },

});
export default DestinationModal;