import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

interface DayPlan {
  day: number;
  activities: string[];
  timeEstimates: string[];
  locations: string[];
}

interface TripPlanDetailsProps {
  route: {
    params: {
      plan: {
        id: string;
        title: string;
        imageUrl: string;
        description: string;
        days: DayPlan[];
        totalCost: string;
        accommodation: string;
        transportation: string;
        notes: string[];
      };
    };
  };
  navigation: any;
}

const TripPlanDetailsScreen: React.FC<TripPlanDetailsProps> = ({ route, navigation }) => {
  const { plan } = route.params;
  const [selectedDay, setSelectedDay] = useState(1);

  const renderDaySelector = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.daySelector}
    >
      {plan.days.map((day) => (
        <TouchableOpacity
          key={day.day}
          style={[
            styles.dayButton,
            selectedDay === day.day && styles.selectedDayButton
          ]}
          onPress={() => setSelectedDay(day.day)}
        >
          <Text style={[
            styles.dayButtonText,
            selectedDay === day.day && styles.selectedDayButtonText
          ]}>
            Day {day.day}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDayPlan = () => {
    const currentDay = plan.days.find(day => day.day === selectedDay);
    if (!currentDay) return null;

    return (
      <View style={styles.dayPlanContainer}>
        {currentDay.activities.map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.timelineConnector}>
              <View style={styles.timelineDot} />
              {index !== currentDay.activities.length - 1 && (
                <View style={styles.timelineLine} />
              )}
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTime}>{currentDay.timeEstimates[index]}</Text>
              <Text style={styles.activityText}>{activity}</Text>
              <Text style={styles.locationText}>{currentDay.locations[index]}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{plan.title}</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        <ImageBackground
          source={{ uri: plan.imageUrl }}
          style={styles.coverImage}
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.5)', 'transparent']}
            style={styles.gradient}
          />
        </ImageBackground>

        <View style={styles.detailsContainer}>
          <View style={styles.overviewSection}>
            <Text style={styles.sectionTitle}>Trip Overview</Text>
            <View style={styles.overviewItem}>
              <Icon name="cash-outline" size={20} color="#4CAF50" />
              <Text style={styles.overviewText}>Estimated Cost: {plan.totalCost}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Icon name="bed-outline" size={20} color="#4CAF50" />
              <Text style={styles.overviewText}>Accommodation: {plan.accommodation}</Text>
            </View>
            <View style={styles.overviewItem}>
              <Icon name="car-outline" size={20} color="#4CAF50" />
              <Text style={styles.overviewText}>Transportation: {plan.transportation}</Text>
            </View>
          </View>

          <View style={styles.dayPlanSection}>
            <Text style={styles.sectionTitle}>Daily Itinerary</Text>
            {renderDaySelector()}
            {renderDayPlan()}
          </View>

          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Important Notes</Text>
            {plan.notes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Icon name="information-circle-outline" size={20} color="#4CAF50" />
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  contentContainer: {
    flex: 1,
  },
  coverImage: {
    width: width,
    height: 200,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  detailsContainer: {
    padding: 16,
  },
  overviewSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#666',
  },
  daySelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  dayButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  selectedDayButton: {
    backgroundColor: '#4CAF50',
  },
  dayButtonText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDayButtonText: {
    color: '#FFF',
  },
  dayPlanContainer: {
    marginTop: 16,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineConnector: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E0E0E0',
    marginTop: 4,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  activityText: {
    fontSize: 16,
    color: '#333',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  notesSection: {
    marginTop: 24,
  },
  noteItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  noteText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  dayPlanSection: {
    marginTop: 24,
  },
});

export default TripPlanDetailsScreen;