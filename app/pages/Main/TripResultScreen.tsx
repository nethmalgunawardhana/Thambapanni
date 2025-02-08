import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  Dimensions 
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

// Navigation Type Definitions
type RootStackParamList = {
  TripPlanResult: { 
    success: boolean;
    tripPlan: TripPlan 
  };
  PlanningTrip: undefined;
};

// Updated Trip Plan Type Definition
type Activity = {
  time: string;
  destination: string;
  description: string;
  image: string;
};

type DayPlan = {
  day: number;
  date: string;
  activities: Activity[];
  transportation: string;
  accommodation: string;
  estimatedCost: string;
};

type TripPlan = {
  tripTitle: string;
  days: DayPlan[];
};

type TripResultScreenRouteProp = RouteProp<RootStackParamList, 'TripPlanResult'>;
type TripResultScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TripPlanResult'>;

type Props = {
  route: TripResultScreenRouteProp;
  navigation: TripResultScreenNavigationProp;
};

const { width } = Dimensions.get('window');

const TripResultScreen: React.FC<Props> = ({ route, navigation }) => {
  const { tripPlan } = route.params;
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const toggleDayExpansion = (day: number) => {
    setExpandedDay(expandedDay === day ? null : day);
  };

  const renderActivityCard = (activity: Activity, index: number) => (
    <View key={index} style={styles.activityCard}>
      <Image 
        source={{ uri: activity.image }} 
        style={styles.activityImage} 
        resizeMode="cover"
      />
      <View style={styles.activityDetails}>
        <Text style={styles.activityTime}>{activity.time}</Text>
        <Text style={styles.activityDestination}>{activity.destination}</Text>
        <Text style={styles.activityDescription}>{activity.description}</Text>
      </View>
    </View>
  );

  const renderDayPlan = (dayPlan: DayPlan) => {
    const isExpanded = expandedDay === dayPlan.day;

    return (
      <TouchableOpacity 
        key={dayPlan.day} 
        style={styles.dayCard}
        onPress={() => toggleDayExpansion(dayPlan.day)}
      >
        <View style={styles.dayHeader}>
          <Text style={styles.dayTitle}>Day {dayPlan.day}</Text>
          <Text style={styles.dayDate}>{dayPlan.date}</Text>
          <Icon 
            name={isExpanded ? 'chevron-up' : 'chevron-down'} 
            size={24} 
            color="#4CAF50" 
          />
        </View>

        {isExpanded && (
          <View style={styles.dayDetails}>
            {/* Transportation */}
            <View style={styles.metaInfoContainer}>
              <Icon name="car" size={20} color="#4CAF50" />
              <Text style={styles.metaInfoText}>
                Transportation: {dayPlan.transportation}
              </Text>
            </View>

            {/* Accommodation */}
            <View style={styles.metaInfoContainer}>
              <Icon name="bed" size={20} color="#4CAF50" />
              <Text style={styles.metaInfoText}>
                Accommodation: {dayPlan.accommodation}
              </Text>
            </View>

            {/* Estimated Cost */}
            <View style={styles.metaInfoContainer}>
              <Icon name="wallet" size={20} color="#4CAF50" />
              <Text style={styles.metaInfoText}>
                Estimated Cost: {dayPlan.estimatedCost}
              </Text>
            </View>

            {/* Activities */}
            <View style={styles.activitiesSection}>
              <Text style={styles.sectionTitle}>Activities</Text>
              {dayPlan.activities.map(renderActivityCard)}
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#81C784']}
        style={styles.headerContainer}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={2}>
          {tripPlan.tripTitle}
        </Text>
      </LinearGradient>

      <View style={styles.dayPlansSection}>
        <Text style={styles.sectionTitle}>Detailed Itinerary</Text>
        {tripPlan.days.map(renderDayPlan)}
      </View>

      <TouchableOpacity style={styles.shareButton}>
        <Icon name="share-social" size={24} color="#FFFFFF" />
        <Text style={styles.shareButtonText}>Share Trip Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  headerContainer: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  dayPlansSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  dayCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  dayDate: {
    fontSize: 14,
    color: '#666',
  },
  dayDetails: {
    padding: 16,
  },
  metaInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaInfoText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#333',
  },
  activitiesSection: {
    marginTop: 16,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
  },
  activityImage: {
    width: 100,
    height: 100,
  },
  activityDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  activityTime: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 4,
  },
  activityDestination: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    color: '#666',
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TripResultScreen;