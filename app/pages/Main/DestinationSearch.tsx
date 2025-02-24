import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import DestinationGallery_2 from "../components/DestinationGallery_2";

export type DestinationType = "Hiking" | "Nature" | "Historical" | "Beach" | "Religious" | "Other";

interface DestinationSearchProps {
  selectedDestinations: DestinationType[];
  onToggleDestination: (destination: DestinationType) => void;
  onSaveDestination: (name: string, type: DestinationType) => void;
  keyboardVisible?: boolean;
}

const DestinationSearch = ({
  selectedDestinations,
  onToggleDestination,
  onSaveDestination,
  keyboardVisible = false
}: DestinationSearchProps) => {
  const destinations: DestinationType[] = [
    "Hiking",
    "Nature",
    "Historical",
    "Beach",
    "Religious",
    "Other"
  ];

  useEffect(() => {
    if (selectedDestinations.length === 0) {
      onToggleDestination("Hiking");
    }
  }, []);

  const handleDestinationPress = (selectedDestination: DestinationType) => {
    if (selectedDestinations.includes(selectedDestination)) {
      return;
    }
    
    if (selectedDestinations.length > 0) {
      onToggleDestination(selectedDestinations[0]);
    }
    
    onToggleDestination(selectedDestination);
  };

  return (
    <ScrollView 
      style={styles.mainContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Select Destinations</Text>
        <View style={styles.destinationsContainer}>
          {destinations.map((destination) => (
            <TouchableOpacity
              key={destination}
              style={[
                styles.destinationButton,
                selectedDestinations.includes(destination) && 
                styles.selectedDestination,
              ]}
              onPress={() => handleDestinationPress(destination)}
            >
              <Text
                style={[
                  styles.destinationText,
                  selectedDestinations.includes(destination) && 
                  styles.selectedDestinationText,
                ]}
              >
                {destination}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {!keyboardVisible && selectedDestinations.length > 0 && (
          <View style={styles.destinationGalleryContainer}>
            {selectedDestinations.map((destinationType) => (
              <View key={destinationType} style={styles.galleryItem}>
                <DestinationGallery_2
                  destinationType={destinationType}
                  onSaveDestination={(name) => 
                    onSaveDestination(name, destinationType)
                  }
                />
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 28,
    paddingHorizontal: 14,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
    marginBottom: 12,
    color: "#1E3A2F",
    letterSpacing: 0.5,
    alignSelf: "center",
  },
  destinationsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  destinationButton: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  selectedDestination: {
    backgroundColor: "#4CAF50",
    borderColor: "#2E7D32",
  },
  destinationText: {
    color: "#1E3A2F",
    fontSize: 16,
    fontWeight: "600",
  },
  selectedDestinationText: {
    color: "#FFFFFF",
  },
  destinationGalleryContainer: {
    marginTop: 20,
  },
  galleryItem: {
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  }
});

export default DestinationSearch;