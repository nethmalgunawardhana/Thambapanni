// PrivacyScreen.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './styles';

interface PrivacyScreenProps {
  navigation: any;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Policy</Text>
          <Text style={styles.paragraph}>
            This Privacy Policy describes how your personal information is collected, used, and shared when you use our travel application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information We Collect</Text>
          <Text style={styles.paragraph}>
            When you use our app, we collect information that you provide directly to us, such as your name, email address, phone number, travel preferences, booking information, and payment details.
          </Text>
          <Text style={styles.paragraph}>
            We also automatically collect device information when you access our app, including IP address, device type, unique device identifiers, browser type, and mobile network information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How We Use Your Information</Text>
          <Text style={styles.paragraph}>
            We use the information we collect to:
          </Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletItem}>• Provide, maintain, and improve our services</Text>
            <Text style={styles.bulletItem}>• Process transactions and bookings</Text>
            <Text style={styles.bulletItem}>• Send you technical notices and support messages</Text>
            <Text style={styles.bulletItem}>• Respond to your comments and questions</Text>
            <Text style={styles.bulletItem}>• Personalize your experience</Text>
            <Text style={styles.bulletItem}>• Monitor and analyze usage patterns</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Sharing and Disclosure</Text>
          <Text style={styles.paragraph}>
            We may share your information with third-party service providers who help us deliver our services, such as payment processors, booking partners, and analytics providers.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Rights</Text>
          <Text style={styles.paragraph}>
            You can access, update, or delete your personal information at any time through your account settings or by contacting our support team.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          <Text style={styles.paragraph}>
            We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <Text style={styles.paragraph}>
            If you have any questions about our Privacy Policy, please contact us at privacy@travelapp.com.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Last Updated: February 28, 2025</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyScreen;