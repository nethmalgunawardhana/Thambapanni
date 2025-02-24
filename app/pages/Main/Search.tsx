import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, DeviceEventEmitter } from 'react-native';
import TopGuides from './guides';
import DestinationSearch, { DestinationType } from './DestinationSearch';

const { width } = Dimensions.get('window');

const Search: React.FC = () => {
  // Initial state should be 'destination'
  const [activeTab, setActiveTab] = useState<'destination' | 'topGuides'>('destination');
  const [selectedDestinations, setSelectedDestinations] = useState<DestinationType[]>([]);

  // Single useEffect for handling tab switching
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('switchToTopGuides', () => {
      setActiveTab('topGuides');
    });

    // Reset to destination tab when component unmounts
    return () => {
      subscription.remove();
      setActiveTab('destination');
    };
  }, []);

  const handleToggleDestination = (destination: DestinationType) => {
    setSelectedDestinations(prev => {
      const isSelected = prev.includes(destination);
      if (isSelected) {
        return prev.filter(d => d !== destination);
      }
      return [...prev, destination];
    });
  };

  const handleSaveDestination = (name: string, type: DestinationType) => {
    console.log('Saving destination:', { name, type });
  };

  const renderContent = () => {
    if (activeTab === 'destination') {
      return (
        <DestinationSearch 
          selectedDestinations={selectedDestinations}
          onToggleDestination={handleToggleDestination}
          onSaveDestination={handleSaveDestination}
        />
      );
    }
    return <TopGuides />;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'destination' && styles.activeTab]}
          onPress={() => setActiveTab('destination')}
        >
          <Text style={[styles.tabText, activeTab === 'destination' && styles.activeTabText]}>
            Destination
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'topGuides' && styles.activeTab]}
          onPress={() => setActiveTab('topGuides')}
        >
          <Text style={[styles.tabText, activeTab === 'topGuides' && styles.activeTabText]}>
            Top Guides
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={[null]}
        keyExtractor={() => 'content'}
        renderItem={() => renderContent()}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    backgroundColor: 'rgba(249, 249, 249, 0.97)',   
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    minWidth: width * 0.35,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#00BFA6',
    elevation: 4,
    shadowColor: '#00BFA6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
});

export default Search;