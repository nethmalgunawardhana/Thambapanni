import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";
import { fetchDestinations } from '../../../services/destinations/images';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  rating: number;
  type: string;
}

interface DestinationSearchProps {
  onSelectDestination: (destination: SearchResult) => void;
}

const DestinationSearch: React.FC<DestinationSearchProps> = ({ onSelectDestination }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch destinations when component mounts
  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    setIsSearching(true);
    setError(null);
    try {
      const destinations = await fetchDestinations('all');
      setSearchResults(destinations);
    } catch (error) {
      setError('Failed to load destinations. Please try again.');
      console.error('Error loading destinations:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      // If search is empty, reload all destinations
      loadDestinations();
      return;
    }

    // Filter destinations based on search query
    const filteredResults = searchResults.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const renderDestinationItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => onSelectDestination(item)}
    >
      <View style={styles.resultContent}>
        <View style={styles.resultTextContainer}>
          <Text style={styles.resultName}>{item.name}</Text>
          <Text style={styles.resultType}>{item.type}</Text>
          <Text numberOfLines={2} style={styles.resultDescription}>
            {item.description}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search destinations..."
          value={searchQuery}
          onChangeText={handleSearch}
          returnKeyType="search"
          placeholderTextColor="#999"
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => handleSearch('')}
            style={styles.clearButton}
          >
            <Icon name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={24} color="#FF6B6B" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadDestinations}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : isSearching ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading destinations...</Text>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderDestinationItem}
          keyExtractor={(item) => item.id}
          style={styles.resultsList}
          contentContainerStyle={styles.resultsContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="search" size={48} color="#E0E0E0" />
          <Text style={styles.emptyText}>No destinations found</Text>
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => handleSearch('')}
            >
              <Text style={styles.resetButtonText}>Show all destinations</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#1E3A2F',
  },
  clearButton: {
    padding: 8,
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    paddingBottom: 16,
  },
  resultItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  resultContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A2F',
    marginBottom: 4,
  },
  resultType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A2F',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  resetButton: {
    marginTop: 8,
    padding: 12,
  },
  resetButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default DestinationSearch;