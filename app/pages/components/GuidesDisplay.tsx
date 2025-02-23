import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput, ImageSourcePropType } from 'react-native';
import { fetchVerifiedGuides } from '../../../services/guides/request';

const Guides = () => {
  const [guides, setGuides] = useState<any[]>([]);
  const [filteredGuides, setFilteredGuides] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const defaultImage: ImageSourcePropType = require('../../../assets/images/defaultimage.png');

  useEffect(() => {
    const getGuides = async () => {
      try {
        const fetchedGuides = await fetchVerifiedGuides();
        setGuides(fetchedGuides);
        setFilteredGuides(fetchedGuides);
      } catch (error) {
        console.error('Error loading guides:', error);
        setError('Failed to load guides. Please try again later.');
      }
    };

    getGuides();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowercasedQuery = query.toLowerCase();

    const filtered = guides.filter(
      (guide) =>
        guide.location.toLowerCase().includes(lowercasedQuery) ||
        guide.languages.toLowerCase().includes(lowercasedQuery)
    );

    setFilteredGuides(filtered);
  };

  const renderGuideCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.cardInner}>
        <Image source={defaultImage} style={styles.image} />
        <View style={styles.cardContent}>
          <Text style={styles.name}>{item.fullName}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text>Phone: {item.phone}</Text>
          <Text >Languages: {item.languages}</Text>
          <Text >Location: {item.location}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (error) {
    return <Text>{error}</Text>;
  }

  if (guides.length === 0) {
    return <Text>Loading guides...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verified Guides</Text>

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
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

// Updated styles with optimized widths and spacing
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 12,
    letterSpacing: 0.5,
    paddingHorizontal: 8, // Reduced from 16
    alignSelf: 'center',
    marginTop: -8,
  },
  searchInput: {
    height: 50,
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    fontSize: 16,
    marginHorizontal: -8, // Reduced from 16
    color: '#1A1A1A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  noGuides: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 32,
    fontWeight: '500',
  },
  card: {
    marginHorizontal: -8, // Reduced from 16
    marginBottom: 12, // Slightly reduced for tighter vertical spacing
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 12, // Slightly reduced padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80, // Slightly reduced
    height: 80, // Slightly reduced
    borderRadius: 40,
    marginRight: 12, // Reduced from 16
    backgroundColor: '#F5F5F5',
    borderWidth: 2,
    borderColor: '#00BFA6',
  },
  cardContent: {
    flex: 1,
  },
  name: {
    fontSize: 18, // Slightly reduced
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  infoContainer: {
    backgroundColor: '#F8FDFB',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#4A4A4A',
    fontWeight: '600',
    width: 75, // Slightly reduced
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#00BFA6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});

export default Guides;