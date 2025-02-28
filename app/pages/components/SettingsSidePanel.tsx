import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';

interface SettingsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
  navigation?: any; // Navigation prop for routing
}

const { width, height } = Dimensions.get('window');
const POPUP_WIDTH = width; // Full width
const POPUP_HEIGHT = height * 0.93; // 93% of screen height

const SettingsPopup: React.FC<SettingsPopupProps> = ({
  isVisible,
  onClose,
  onLogout,
  navigation,
}) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: height * 0.14, // Slides to show 85% of screen
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnim, fadeAnim, height]);

  // Simplified function to navigate to MenuBar tab
  const navigateToMenuBarTab = (tabName: string) => {
    onClose();
    
    if (navigation) {
      console.log('Navigating to MenuBar with tab:', tabName);
      
      // Use CommonActions for reliable nested navigation
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: 'MenuBar',
              state: {
                routes: [{ name: tabName }],
                index: 0,
              }
            },
          ],
        })
      );
    }
  };

  // Updated menu items with proper navigation
  const menuItems: Array<{ 
    icon: keyof typeof Ionicons.glyphMap; 
    label: string;
    onPress: () => void;
    color?: string;
  }> = [
    { 
      icon: 'search-outline', 
      label: 'Search',
      onPress: () => navigateToMenuBarTab('Search')
    },
    { 
      icon: 'bookmark-outline', 
      label: 'Bookmark',
      onPress: () => navigateToMenuBarTab('Bookmark') 
    },
    { 
      icon: 'person-outline', 
      label: 'Profile Settings',
      onPress: () => navigateToMenuBarTab('Profile')
    },
    { 
      icon: 'add-circle-outline', 
      label: 'Planning Trip',
      onPress: () => navigateToMenuBarTab('PlanningTrip')
    },
    { 
      icon: 'map-outline', 
      label: 'Trip Plans',
      onPress: () => {
        onClose();
        if (navigation) {
          navigation.navigate('TripPlans');
        }
      }
    },
    { 
      icon: 'time-outline', 
      label: 'Pending Payments',
      onPress: () => {
        onClose();
        if (navigation) {
          try {
            navigation.navigate('PendingPayments');
          } catch (error) {
            console.log('Navigation error:', error);
          }
        }
      }
    },
    { 
      icon: 'card-outline', 
      label: 'Payment History',
      onPress: () => {
        onClose();
        if (navigation) {
          navigation.navigate('PaymentHistory');
        }
      }
    },
    { 
      icon: 'notifications-outline', 
      label: 'Notifications',
      onPress: () => {
        onClose();
        console.log('Notifications pressed');
        // Add navigation when you have a Notifications screen
      }
    },
    { 
      icon: 'shield-outline', 
      label: 'Privacy',
      onPress: () => {
        onClose();
        console.log('Privacy pressed');
        // Add navigation when you have a Privacy screen
      }
    },
    { 
      icon: 'help-circle-outline', 
      label: 'Help & Support',
      onPress: () => {
        onClose();
        console.log('Help & Support pressed');
        // Add navigation when you have a Help & Support screen
      }
    },
    { 
      icon: 'information-circle-outline', 
      label: 'About',
      onPress: () => {
        onClose();
        console.log('About pressed');
        // Add navigation when you have an About screen
      }
    },
  ];

  if (!isVisible) return null;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop for closing popup */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <TouchableOpacity style={styles.backdropTouch} onPress={onClose} />
        </Animated.View>

        {/* Popup content */}
        <Animated.View
          style={[
            styles.popup,
            {
              transform: [
                { translateY: slideAnim },
              ],
            },
          ]}
        >
          {/* Handle for dragging */}
          <View style={styles.dragHandle}>
            <View style={styles.dragHandleBar} />
          </View>

          <View style={styles.header}>
            <Text style={styles.headerTitle}>Main Menu</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Main Content Container with Flex Layout */}
          <View style={styles.contentContainer}>
            {/* Scrollable Menu Items */}
            <ScrollView style={styles.scrollContent}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.menuItem}
                  onPress={item.onPress}
                >
                  <Ionicons name={item.icon} size={24} color={item.color || "#333"} />
                  <Text style={[styles.menuItemText, item.color ? {color: item.color} : null]}>
                    {item.label}
                  </Text>
                  <Ionicons name="chevron-forward-outline" size={20} color="#CCCCCC" style={styles.rightIcon} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {/* Fixed Logout Button */}
            <View style={styles.logoutWrapper}>
              <TouchableOpacity
                style={styles.logoutContainer}
                onPress={onLogout}
              >
                <View style={styles.logoutButton}>
                  <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                  <Text style={styles.logoutText}>Logout</Text>
                </View>
                
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end', // Align to bottom
    alignItems: 'center',
    marginBottom: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  backdropTouch: {
    flex: 1,
  },
  popup: {
    position: 'absolute',
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  dragHandle: {
    width: '100%',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  dragHandleBar: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#DDDDDD',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  scrollContent: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  rightIcon: {
    marginLeft: 'auto',
  },
  logoutWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    width: '100%',
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 18,
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '400',
    
  },
});

export default SettingsPopup;