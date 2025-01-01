import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Dashboard from './dashboard';

// Type definitions
type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  PlanningTrip: undefined;
  Bookmark: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

// Props interface for PlaceholderScreen
interface PlaceholderScreenProps {
  screenName: string;
}

// Component type definitions
const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ screenName }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>{screenName} Screen</Text>
    <Text style={styles.developmentText}>Under Development</Text>
  </View>
);

const TopGuides: React.FC = () => <PlaceholderScreen screenName="Search" />;
const PlanningTrip: React.FC = () => <PlaceholderScreen screenName="Planning Trip" />;
const SesonalTrends: React.FC = () => <PlaceholderScreen screenName="Bookmarks" />;
const ProfileScreen: React.FC = () => <PlaceholderScreen screenName="Profile" />;

const MenuBar: React.FC = () => {
  // Type the navigation
  const navigation = useNavigation();
  
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBarStyle,
        headerShown: false
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={Dashboard} 
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Ionicons 
              name="home-outline" 
              size={24} 
              color={focused ? '#FF9500' : 'white'} 
            />
          ),
        }} 
      />
      
      <Tab.Screen 
        name="Search" 
        component={TopGuides} 
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Ionicons 
              name="search-outline" 
              size={24} 
              color={focused ? '#FF9500' : 'white'} 
            />
          ),
        }} 
      />
      
      <Tab.Screen
        name="PlanningTrip"
        component={PlanningTrip}
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <View style={styles.customTabBarButton}>
              <View style={styles.customButtonBackground}>
                <Ionicons name="add" size={40} color={focused ? '#1E1E1E' : 'white'} />
              </View>
            </View>
          ),
        }}
      />
      
      <Tab.Screen 
        name="Bookmark" 
        component={SesonalTrends} 
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Ionicons 
              name="bookmark-outline" 
              size={24} 
              color={focused ? '#FF9500' : 'white'} 
            />
          ),
        }} 
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <Ionicons 
              name="person-outline" 
              size={24} 
              color={focused ? '#FF9500' : 'white'} 
            />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}


const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: '#4F46E5',
    borderRadius: 15,
    height: 90,
    paddingBottom: 10,
  },
  customTabBarButton: {
    top: -30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customButtonBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  placeholderText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  developmentText: {
    fontSize: 16,
    color: '#666',
  },
});

export default MenuBar;