import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView ,
  ActivityIndicator 
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
  tripId: string; 
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
const API_BASE_URL = 'https://thambapanni-backend.vercel.app/images';
const TripResultScreen: React.FC<Props> = ({ navigation, route }) => {
  const [selectedDay, setSelectedDay] = useState(0);
  const [destinationImages, setDestinationImages] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  useEffect(() => {
    if (route.params?.tripPlan) {
      fetchAllDestinationImages();
    }
    console.log('Route Params:', route.params);
    console.log('Trip Plan:', route.params?.tripPlan);
  }, [route.params]);
  
  const fetchDestinationImage = async (destination: string) => {
    try {
      setLoading(prev => ({ ...prev, [destination]: true }));
      setImageErrors(prev => ({ ...prev, [destination]: false }));
      const formattedDestination = destination.toLowerCase().replace(/[^a-z0-9]/g, '-');
      const response = await fetch(`${API_BASE_URL}/destination-images/${formattedDestination}`);
      
      if (!response.ok) {
        throw new Error('Image fetch failed');
      }

      // Convert the response to base64
      const imageUrl = response.url;
      setDestinationImages(prev => ({ ...prev, [destination]: imageUrl }));
      
      
    } catch (error) {
      console.error('Error fetching image:', error);
      setImageErrors(prev => ({ ...prev, [destination]: true }));
    } finally {
      setLoading(prev => ({ ...prev, [destination]: false }));
    }
  };

  const fetchAllDestinationImages = () => {
    const { tripPlan } = route.params;
    tripPlan.days.forEach(day => {
      day.activities.forEach(activity => {
        if (!destinationImages[activity.destination]) {
          fetchDestinationImage(activity.destination);
        }
      });
    });
  };

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
      {/* <Text style={[styles.dayDateText, selectedDay === day.day - 1 && styles.selectedDayText]}>
        {day.day}
      </Text> */}
    </TouchableOpacity>
  );

  const getImageSource = (destination: string) => {
    if (imageErrors[destination]) {

      return require('../../../assets/images/login.png');
    }
    
    if (destinationImages[destination]) {

      return { uri: destinationImages[destination] };
    }
    
 
    return require('../../../assets/images/login.png');
  };
  const renderActivity = (activity: Activity, index: number) => (
    <View key={index} style={styles.activityContainer}>
      <View style={styles.timelineContainer}>
        <View style={[styles.timelineDot, { backgroundColor: '#FF9800' }]} />
        <View style={[styles.timelineLine, { backgroundColor: '#FFE0B2' }]} />
      </View>
      <View style={[styles.activityContent, styles.activityCardShadow]}>
        <Text style={styles.activityTime}>{activity.time}</Text>
        <Text style={styles.activityDestination}>{activity.destination}</Text>
        
        <View style={styles.imageContainer}>
          {loading[activity.destination] ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF9800" />
            </View>
          ) : (
            <Image
              source={getImageSource(activity.destination)}
              style={styles.activityImage}
              resizeMode="cover"
              onError={() => {
                setImageErrors(prev => ({ ...prev, [activity.destination]: true }));
              }}
            />
          )}
        </View>
        
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
  daySelectorContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  daySelector: {
    flexGrow: 0,
  },
  daySelectorContent: {
    paddingHorizontal: 16,
  },
  dayTab: {
    marginRight: 24,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  selectedDayTab: {
    borderBottomColor: '#FF9800',
    transform: [{ scale: 1.05 }],
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 4,
  },
  dayDateText: {
    fontSize: 14,
    color: '#666',
  },
  selectedDayText: {
    color: '#FF9800',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5', 
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  fadeIn: {
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityCardShadow: {
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
 
});

export default TripResultScreen;