import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
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

interface TabIconProps {
  focused: boolean;
  color: string;
  size: number;
}

const MenuBar: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'switchTab', 
      (data: { screen: keyof RootStackParamList }) => {
        if (data?.screen) {
          const currentRoute = navigation.getState().routes[navigation.getState().index];
          if (currentRoute.name !== data.screen) {
            try {
              navigation.navigate(data.screen);
            } catch (error) {
              console.error('Navigation error:', error);
            }
          }
        }
    });

    return () => {
      subscription.remove();
    };
  }, [navigation]);
  
  const renderTabIcon = (iconName: keyof typeof Ionicons.glyphMap, focused: boolean) => {
    return (
      <Ionicons 
        name={iconName}
        size={24} 
        color={focused ? '#FF9500' : 'black'} 
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
          tabBarIcon: ({ focused }) => renderTabIcon('home-outline', focused),
        }} 
      />
      
      <Tab.Screen 
        name="Search" 
        component={Search} 
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon('search-outline', focused),
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
      />
      
      <Tab.Screen 
        name="Bookmark" 
        component={BookmarkedTripsScreen} 
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon('bookmark-outline', focused),
        }} 
      />
      
      <Tab.Screen 
        name="Profile" 
        component={ProfileCard} 
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon('person-outline', focused),
        }} 
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: 'rgb(60, 130, 127)', // Updated to purple/indigo color
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
    backgroundColor: ' #FF9500', // Orange color for the add button
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
    backgroundColor: ' #FF9500', // Orange color for the add button
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuBar;