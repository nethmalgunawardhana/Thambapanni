import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, SafeAreaView, Modal, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

interface Destination {
  name: string;
  description: string;
  image_url: string;
  visit_count: number;
  ai_summary: string;
  created_at: string;
  updated_at: string;
}

const { width } = Dimensions.get('window');

const TrendingDestinationsSection = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrendingDestinations();
  }, []);

  const fetchTrendingDestinations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://trip-planner-api-production-a10f.up.railway.app/api/trending-places');
      if (response.data.success) {
        setDestinations(response.data.data);
      } else {
        setError('Failed to fetch destinations');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error fetching trending destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationPress = (destination: Destination) => {
    setSelectedDestination(destination);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDestination(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#34D399" />
        <Text style={styles.loadingText}>Loading trending destinations...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchTrendingDestinations}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.destinationsScrollContent}
      >
        {destinations.map((destination, index) => (
          <TouchableOpacity
            key={index}
            style={styles.destinationCard}
            onPress={() => handleDestinationPress(destination)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: destination.image_url }}
              style={styles.destinationImage}
              resizeMode="cover"
            />
            <View style={styles.destinationOverlay}>
              <Text style={styles.destinationName}>{destination.name}</Text>
              <View style={styles.visitCountContainer}>
                <Ionicons name="eye-outline" size={14} color="#FFFFFF" />
                <Text style={styles.visitCount}>{destination.visit_count} visits</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        {selectedDestination && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name="close-circle" size={30} color="#000" />
              </TouchableOpacity>
              
              <Image
                source={{ uri: selectedDestination.image_url }}
                style={styles.modalImage}
                resizeMode="cover"
              />
              
              <View style={styles.modalTextContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{selectedDestination.name}</Text>
                  <View style={styles.modalVisitCount}>
                    <Ionicons name="eye-outline" size={16} color="#666" />
                    <Text style={styles.modalVisitCountText}>
                      {selectedDestination.visit_count} visits
                    </Text>
                  </View>
                </View>
                
                <ScrollView style={styles.modalDescription}>
                  <Text style={styles.summaryHeading}>Description</Text>
                  <Text style={styles.summaryText}>{selectedDestination.ai_summary}</Text>
                  
                  {selectedDestination.description !== selectedDestination.ai_summary && (
                    <>
                      <Text style={styles.descriptionHeading}>Local Description</Text>
                      <Text style={styles.descriptionText}>{selectedDestination.description}</Text>
                    </>
                  )}
                </ScrollView>
                
               
              </View>
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  destinationsScrollContent: {
    paddingHorizontal: 8,
    paddingBottom: 16
  },
  destinationCard: {
    width: width * 0.7,
    height: 180,
    borderRadius: 12,
    marginHorizontal: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  destinationImage: {
    width: '100%',
    height: '100%',
  },
  destinationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 12,
  },
  destinationName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  visitCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  visitCount: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#34D399',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 15,
  },
  modalImage: {
    width: '100%',
    height: 200,
  },
  modalTextContent: {
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalVisitCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalVisitCountText: {
    marginLeft: 4,
    color: '#666',
  },
  modalDescription: {
    maxHeight: 200,
  },
  summaryHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 16,
  },
  descriptionHeading: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
  },
  planTripButton: {
    backgroundColor: '#34D399',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  planTripButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default TrendingDestinationsSection;