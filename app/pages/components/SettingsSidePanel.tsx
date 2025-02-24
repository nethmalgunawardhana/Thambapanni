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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsSidePanelProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

// Adjust panel width based on screen size
const { width } = Dimensions.get('window');
const PANEL_WIDTH = width * 0.75; // 75% of screen width

const SettingsSidePanel: React.FC<SettingsSidePanelProps> = ({
  isVisible,
  onClose,
  onLogout,
}) => {
  const slideAnim = useRef(new Animated.Value(-PANEL_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
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
          toValue: -PANEL_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, slideAnim, fadeAnim]);

  const menuItems = [
    { icon: 'home-outline', label: 'Dashboard' },
    { icon: 'search-outline', label: 'Search' },
    { icon: 'airplane-outline', label: 'Planning Trip' },
    { icon: 'bookmark-outline', label: 'Book Mark' },
    { icon: 'map-outline', label: 'Trip Plans' },
    { icon: 'timer-outline', label: 'Pending Payments' },
    { icon: 'card-outline', label: 'Payment History' },
    { icon: 'person-outline', label: 'Profile Settings' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'shield-outline', label: 'Privacy' },
    { icon: 'help-circle-outline', label: 'Help & Support' },
    { icon: 'information-circle-outline', label: 'About' },
  ];

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      {/* Backdrop for closing panel */}
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

      {/* Panel content */}
      <Animated.View
        style={[
          styles.panel,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Main Menu</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                console.log(`Selected: ${item.label}`);
                onClose();
              }}
            >
              <Ionicons name={item.icon} size={24} color="#333" />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Logout button appears directly after menu items */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    marginLeft:-10,
    marginTop:-10,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  backdropTouch: {
    flex: 1,
  },
  panel: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: PANEL_WIDTH,
    height: '100%',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 16 : 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    // Makes content scrollable when many menu items are present
    maxHeight: '85%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    // No marginTop: 'auto' - we want it to appear directly after the menu items
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingVertical: 20,
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
});

export default SettingsSidePanel;