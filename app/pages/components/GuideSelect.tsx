import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput, ImageSourcePropType } from 'react-native';
import { fetchVerifiedGuides } from '../../../services/guides/request';

type GuidesProps = {
  onGuideSelect: (guide: any) => void;
};

const Guides: React.FC<GuidesProps> = ({ onGuideSelect }) => {
  const [guides, setGuides] = useState<any[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Define the default avatar image
  const defaultImage: ImageSourcePropType = require('../../../assets/images/defaultimage.png');

  useEffect(() => {
    // Fetch guides when the component mounts
    const getGuides = async () => {
      try {
        const fetchedGuides = await fetchVerifiedGuides();
        setGuides(fetchedGuides);
        setFilteredGuides(fetchedGuides); // Initially show all guides
      } catch (error) {
        console.error('Error loading guides:', error);
        setError('Failed to load guides. Please try again later.');
      }
    };

    getGuides();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Convert the query to lowercase for case-insensitive search
    const lowercasedQuery = query.toLowerCase();

    // Filter guides based on location or languages
    const filtered = guides.filter(
      (guide) =>
        guide.location.toLowerCase().includes(lowercasedQuery) ||
        guide.languages.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredGuides(filtered); // Update the filtered guides list
  };

  const renderGuideCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => onGuideSelect(item)}>
      {/* Render profile image for each guide */}
      <Image source={defaultImage} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.fullName}</Text>
        <Text style={styles.email}>{item.email}</Text>
        <Text style={styles.phone}>Phone: {item.phone}</Text>
        <Text style={styles.languages}>Languages: {item.languages}</Text>
        <Text style={styles.location}>Location: {item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return <Text>{error}</Text>; // Display the error message if an error occurs
  }

  if (guides.length === 0) {
      return <Text>Loading guides...</Text>;
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verified Guides</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Location or Languages"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      {filteredGuides.length === 0 ? (
              <Text style={styles.noGuides}>No guides available</Text>
            ) : (
              <FlatList
                data={filteredGuides}
                renderItem={renderGuideCard}
                keyExtractor={(item) => item.email}
                showsVerticalScrollIndicator={false}
              />
            )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Makes the container take up all available space
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  noGuides: {
    textAlign: 'center',
    fontSize: 18,
    color: '#888',
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    backgroundColor: '#f9f9f9',
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40, // Make it circular
    marginRight: 15,
  },
  cardContent: {
    justifyContent: 'center',
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    color: '#888',
    marginBottom: 5,
  },
  phone: {
    color: '#888',
    marginBottom: 5,
  },
  languages: {
    color: '#888',
    marginBottom: 5,
  },
  location: {
    color: '#888',
  },
});

export default Guides;