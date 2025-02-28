import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { DeviceEventEmitter } from 'react-native';
import Dashboard from './dashboard';
import PlanningTripScreen from './PlanningTrip';
import Search from './Search';
import ProfileCard from './profile';
import BookmarkedTripsScreen from './bookmarkScreen';

type RootStackParamList = {
  Home: undefined;
  Search: undefined;
  PlanningTrip: undefined;
  Bookmark: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<RootStackParamList>();

const MenuBar: React.FC = () => {
  // Create a global navigation handler for the tab switching
  useEffect(() => {
    // This will be our custom event for switching tabs in MenuBar
    const subscription = DeviceEventEmitter.addListener(
      'switchTab', 
      (data: { tabName: keyof RootStackParamList }) => {
        if (data?.tabName) {
          console.log('Tab switch received for:', data.tabName);
          // Just broadcast the selected tab name
          // We'll handle this in each individual tab screen
          DeviceEventEmitter.emit('tabSelected', data.tabName);
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);
  
  const renderTabIcon = (iconName: keyof typeof Ionicons.glyphMap, focusedIconName: keyof typeof Ionicons.glyphMap, focused: boolean) => {
    return (
      <Ionicons 
        name={focused ? focusedIconName : iconName}
        size={24} 
        color={focused ? '#FF9500' : 'white'} 
      />
    );
  };

  return (
    <Tab.Navigator
      id={undefined}
      initialRouteName="Home"
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
          tabBarIcon: ({ focused }) => renderTabIcon('home-outline', 'home', focused),
        }} 
        listeners={{
          tabPress: e => {
            // When tab is pressed directly, update other screens
            DeviceEventEmitter.emit('tabSelected', 'Home');
          }
        }}
      />
      
      <Tab.Screen 
        name="Search" 
        component={Search} 
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon('search-outline', 'search', focused),
        }}
        listeners={{
          tabPress: e => {
            DeviceEventEmitter.emit('tabSelected', 'Search');
          }
        }}
      />
      
      <Tab.Screen
        name="PlanningTrip"
        component={PlanningTripScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.customTabBarButton}>
              <View style={styles.customButtonBackground}>
                <Ionicons 
                  name="add" 
                  size={40} 
                  color="white" 
                />
              </View>
            </View>
          ),
        }}
        listeners={{
          tabPress: e => {
            DeviceEventEmitter.emit('tabSelected', 'PlanningTrip');
          }
        }}
      />
      
      <Tab.Screen 
        name="Bookmark" 
        component={BookmarkedTripsScreen} 
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon('bookmark-outline', 'bookmark', focused),
        }}
        listeners={{
          tabPress: e => {
            DeviceEventEmitter.emit('tabSelected', 'Bookmark');
          }
        }}
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileCard} 
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon('person-outline', 'person', focused),
        }}
        listeners={{
          tabPress: e => {
            DeviceEventEmitter.emit('tabSelected', 'Profile');
          }
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    marginTop: 30,
    position: 'absolute',
    marginBottom: 0,
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: '#34D399',
    height: 60,
    borderTopWidth: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
  },
  customTabBarButton: {
    position: 'absolute',
    top: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(255, 166, 0)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  customButtonBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuBar;