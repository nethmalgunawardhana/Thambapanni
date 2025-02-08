import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type Activity = {
  time: string;
  destination: string;
  description: string;
  image: string;
};

type DayData = {
  day: number;
  date: string;
  activities: Activity[];
  transportation: string;
  accommodation: string;
  estimatedCost: string;
};

type TripData = {
  tripTitle: string;
  days: DayData[];
};

type RootStackParamList = {
  TripResult: { success: boolean; tripPlan: TripData };
  BudgetReport: { tripPlan: TripData };
};

type Props = {
  route: RouteProp<RootStackParamList, 'TripResult'>;
  navigation: StackNavigationProp<RootStackParamList>;
};

const TripResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedDay, setSelectedDay] = useState(0);

  useEffect(() => {
    console.log('Route Params:', route.params);
    console.log('Trip Plan:', route.params?.tripPlan);
  }, [route.params]);
  
  if (!route.params?.success || !route.params?.tripPlan) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={48} color="#FF6B6B" />
          <Text style={styles.errorText}>Trip data not found</Text>
          <TouchableOpacity 
            style={styles.errorButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { tripPlan } = route.params;

  const renderDayTab = (day: DayData) => (
    <TouchableOpacity
      key={day.day}
      style={[styles.dayTab, selectedDay === day.day - 1 && styles.selectedDayTab]}
      onPress={() => setSelectedDay(day.day - 1)}
    >
      <Text style={[styles.dayText, selectedDay === day.day - 1 && styles.selectedDayText]}>
        Day {String(day.day).padStart(2, '0')}
      </Text>
      <Text style={[styles.dateText, selectedDay === day.day - 1 && styles.selectedDateText]}>
        {new Date(day.date).toLocaleDateString()}
      </Text>
    </TouchableOpacity>
  );

  const renderActivity = (activity: Activity, index: number) => (
    <View key={index} style={styles.activityContainer}>
      <View style={styles.timelineContainer}>
        <View style={styles.timelineDot} />
        <View style={styles.timelineLine} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityTime}>{activity.time}</Text>
        <Text style={styles.activityDestination}>{activity.destination}</Text>
        <Image
          source={{ uri: activity.image }}
          style={styles.activityImage}
          resizeMode="cover"
          defaultSource={require('../../../assets/images/beach1.png')}
        />
        <Text style={styles.activityDescription}>{activity.description}</Text>
      </View>
    </View>
  );

  const currentDay = tripPlan.days[selectedDay];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{tripPlan.tripTitle}</Text>
          <Text style={styles.headerSubtitle}>Day {selectedDay + 1} of {tripPlan.days.length}</Text>
        </View>
      </View>

      {/* Day Selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
        {tripPlan.days.map(day => renderDayTab(day))}
      </ScrollView>

      {/* Activities */}
      <ScrollView style={styles.content}>
        {/* Transport Info */}
        <View style={styles.infoCard}>
          <Icon name="car-outline" size={24} color="#666" />
          <Text style={styles.infoText}>{currentDay.transportation}</Text>
        </View>

        {/* Activities */}
        {currentDay.activities.map((activity, index) => renderActivity(activity, index))}

        {/* Accommodation Info */}
        <View style={styles.infoCard}>
          <Icon name="bed-outline" size={24} color="#666" />
          <Text style={styles.infoText}>{currentDay.accommodation}</Text>
        </View>

        {/* Cost Info */}
        <View style={styles.infoCard}>
          <Icon name="wallet-outline" size={24} color="#666" />
          <Text style={styles.infoText}>Estimated Cost: {currentDay.estimatedCost}</Text>
        </View>
      </ScrollView>

      {/* Next Button */}
      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => navigation.navigate('BudgetReport', { tripPlan })}
      >
        <Text style={styles.nextButtonText}>Next: View Budget</Text>
        <Icon name="arrow-forward" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  daySelector: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dayTab: {
    marginRight: 24,
    paddingVertical: 8,
  },
  selectedDayTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  selectedDayText: {
    color: '#000',
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  selectedDateText: {
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  activityContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineContainer: {
    width: 20,
    alignItems: 'center',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    marginTop: 8,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#CCCCCC',
    marginTop: 4,
  },
  activityContent: {
    flex: 1,
    marginLeft: 12,
  },
  activityTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activityDestination: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  activityDescription: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },
  activityImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  nextButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#FF9800',
    borderRadius: 8,
  },
  errorButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TripResultScreen;