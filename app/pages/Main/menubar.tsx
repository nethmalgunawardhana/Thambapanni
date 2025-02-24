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
                  color={focused ? '#1E1E1E' : 'white'} 
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
    backgroundColor: '#4F46E5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 50,
    paddingBottom: 5,
    borderTopWidth: 0,
  },
  customTabBarButton: {
    position: 'absolute',
    top: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF9500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  customButtonBackground: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuBar;