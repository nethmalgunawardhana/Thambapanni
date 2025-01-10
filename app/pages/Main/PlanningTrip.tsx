import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { DestinationGallery } from '../components/DestinationGallery';
const trending1 = require("../../../assets/images/trending1.png");
const trending2 = require("../../../assets/images/trending2.png");
const trending3 = require("../../../assets/images/trending3.png");

type DestinationType = "Hiking" | "Nature" | "Historical" | "Beach";
type CategoryType = "solo" | "friends" | "family" | "couple" | "";

interface CategoryOption {
  label: string;
  value: CategoryType;
  icon: string;
}

const categoryOptions: CategoryOption[] = [
  { label: "Solo", value: "solo", icon: "person" },
  { label: "Friends", value: "friends", icon: "people" },
  { label: "Family", value: "family", icon: "home" },
  { label: "Couple", value: "couple", icon: "heart" },
];

const PlanningTripScreen = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categoryType, setCategoryType] = useState<CategoryType>("");
  const [selectedDestinations, setSelectedDestinations] = useState<DestinationType[]>([]);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [savedDestinationNames, setSavedDestinationNames] = useState<string[]>([]);
  const trendingImages = [trending1, trending2, trending3];

  // const destinationImages: Record<DestinationType, any> = {
  //   Hiking: require("../../../assets/images/hiking1.png"),
  //   Nature: require("../../../assets/images/nature1.png"),
  //   Historical: require("../../../assets/images/historical1.png"),
  //   Beach: require("../../../assets/images/beach1.png"),
  // };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % trendingImages.length);
    }, 3000);

    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      clearInterval(interval);
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const toggleDestination = (destination: DestinationType) => {
    setSelectedDestinations((prev) =>
      prev.includes(destination)
        ? prev.filter((d) => d !== destination)
        : [...prev, destination]
    );
  };
  const handleSaveDestination = (destinationName: string) => {
    setSavedDestinationNames((prev) => {
      if (!prev.includes(destinationName)) {
        return [...prev, destinationName];
      }
      return prev;
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollViewContent,
            keyboardVisible && styles.scrollViewContentWithKeyboard,
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity>
              <Icon name="chevron-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Trending Trips</Text>
          </View>

          {!keyboardVisible && (
            <>
              <View style={styles.trendingTripCard}>
                <Image
                  source={trendingImages[currentImageIndex]}
                  style={styles.trendingTripImage}
                />
                <View style={styles.dotContainer}>
                  {trendingImages.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        index === currentImageIndex && styles.activeDot,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </>
          )}

<View style={styles.planTripSection}>
            <Text style={styles.planTripTitle}>Plan a new trip</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Selected Destinations</Text>
              <View style={styles.savedDestinationsContainer}>
                {savedDestinationNames.map((name, index) => (
                  <View key={index} style={styles.savedDestinationTag}>
                    <Text style={styles.savedDestinationText}>{name}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Select Destinations</Text>
              <View style={styles.destinationsContainer}>
                {["Hiking", "Nature", "Historical", "Beach"].map(
                  (destination) => (
                    <TouchableOpacity
                      key={destination}
                      style={[
                        styles.destinationButton,
                        selectedDestinations.includes(destination as DestinationType) &&
                          styles.selectedDestination,
                      ]}
                      onPress={() => toggleDestination(destination as DestinationType)}
                    >
                      <Text
                        style={[
                          styles.destinationText,
                          selectedDestinations.includes(destination as DestinationType) &&
                            styles.selectedDestinationText,
                        ]}
                      >
                        {destination}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>

            {!keyboardVisible && selectedDestinations.length > 0 && (
              <View style={styles.destinationGalleryContainer}>
                <DestinationGallery 
                  destinationType={selectedDestinations[0]}
                  onSaveDestination={handleSaveDestination}
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category Type</Text>
              <View style={styles.categoryContainer}>
                {categoryOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.categoryButton,
                      categoryType === option.value && styles.selectedCategory,
                    ]}
                    onPress={() => setCategoryType(option.value)}
                  >
                    <Icon
                      name={option.icon}
                      size={24}
                      color={categoryType === option.value ? "#fff" : "#333"}
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        categoryType === option.value && styles.selectedCategoryText,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Days</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter number of days"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Members</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter number of members"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Budget Range</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter your budget"
              />
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollViewContent: {
    paddingBottom: 86,
  },
  scrollViewContentWithKeyboard: {
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 16,
  },
  savedDestinationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  savedDestinationTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  savedDestinationText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
  trendingTripCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  trendingTripImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#4CAF50",
  },
  planTripSection: {
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  planTripTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: "#FFF",
    fontSize: 16,
  },
  destinationsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  destinationButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  selectedDestination: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  destinationText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  selectedDestinationText: {
    color: "#FFF",
  },
  destinationCarousel: {
    marginVertical: 16,
  },
  destinationImage: {
    width: 200,
    height: 120,
    marginRight: 8,
    borderRadius: 12,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryButton: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  selectedCategory: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  selectedCategoryText: {
    color: "#FFF",
  },
  destinationGalleryContainer: {
    marginVertical: 16,
    height: 160, 
  },
});

export default PlanningTripScreen;