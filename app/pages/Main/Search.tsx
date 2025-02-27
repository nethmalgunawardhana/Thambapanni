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
          style={styles.tabButton1}
          onPress={() => setActiveTab('destination')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'destination' && styles.activeTabText
          ]}>
            Destination
          </Text>
          {activeTab === 'destination' && <View style={styles.activeIndicator1} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton2}
          onPress={() => setActiveTab('topGuides')}
        >
          <Text style={[
            styles.tabText, 
            activeTab === 'topGuides' && styles.activeTabText
          ]}>
            Top Guides
          </Text>
          {activeTab === 'topGuides' && <View style={styles.activeIndicator2} />}
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
    marginTop: 5,
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  tabButton1: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    position: 'relative',
    alignItems: 'center',
    minWidth: width * 0.35,
  },
  tabButton2: {
    paddingVertical: 16,
    paddingHorizontal: 22,
    position: 'relative',
    alignItems: 'center',
    minWidth: width * 0.35,
  },
  activeIndicator1: {
    position: 'absolute',
    bottom: -2,
    left: 36,
    right: 36,
    height: 3,
    backgroundColor: 'rgb(255, 166, 0)',
    
  },
  activeIndicator2: {
    position: 'absolute',
    bottom: -2,
    left: 12,
    right: 12,
    height: 3,
    backgroundColor: 'rgb(255, 166, 0)',
    
  },
  tabText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#757575',
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: 'rgb(255, 166, 0)',
    fontWeight: '700',
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 60,
  },
});

export default Search;