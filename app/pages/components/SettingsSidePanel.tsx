import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SettingsSidePanelProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const PANEL_WIDTH = Dimensions.get('window').width * 0.75;

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
  }, [isVisible]);

  const menuItems: Array<{ icon: keyof typeof Ionicons.glyphMap, label: string }> = [
    { icon: 'person-outline', label: 'Profile' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'shield-outline', label: 'Privacy' },
    { icon: 'help-circle-outline', label: 'Help & Support' },
    { icon: 'information-circle-outline', label: 'About' },
  ];

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
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

      <Animated.View
        style={[
          styles.panel,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
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
                  // Handle menu item press
                  onClose();
                }}
              >
                <Ionicons name={item.icon} size={24} color="#333" />
                <Text style={styles.menuItemText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
            <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '500',
  },
});

export default SettingsSidePanel;