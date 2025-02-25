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

interface SettingsPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
  navigation?: any; // Add navigation prop for routing
}

const { width, height } = Dimensions.get('window');
const POPUP_WIDTH = width; // Full width
const POPUP_HEIGHT = height * 0.89; // 95% of screen height

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

  // Add payment history to menu items
  const menuItems: Array<{ 
    icon: keyof typeof Ionicons.glyphMap; 
    label: string;
    onPress?: () => void;
  }> = [
    { icon: 'person-outline', label: 'Account Settings' },
    { icon: 'notifications-outline', label: 'Notifications' },
    { icon: 'shield-outline', label: 'Privacy' },
    { icon: 'language-outline', label: 'Language' },
    { icon: 'color-palette-outline', label: 'Appearance' },
    { icon: 'cloud-download-outline', label: 'Offline Mode' },
    { 
      icon: 'card-outline', 
      label: 'Payment History',
      onPress: () => {
        onClose(); // Close the settings popup
        if (navigation) {
          // Navigate to the Payment History screen
          navigation.navigate('PaymentHistory');
        }
      }
    },
    { icon: 'help-circle-outline', label: 'Help & Support' },
    { icon: 'information-circle-outline', label: 'About' },
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
            <Text style={styles.headerTitle}>Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={item.onPress || (() => {
                  console.log(`Selected: ${item.label}`);
                  // Don't close popup when an item is selected unless specified
                })}
              >
                <Ionicons name={item.icon} size={24} color="#333" />
                <Text style={styles.menuItemText}>{item.label}</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#CCCCCC" style={styles.rightIcon} />
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Logout button appears at the bottom */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
              <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
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
  content: {
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
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    backgroundColor: '#f8f8f8',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 24,
  },
  logoutText: {
    marginLeft: 16,
    fontSize: 18,
    color: '#FF3B30',
    fontWeight: '500',
  },
});

export default SettingsPopup;