import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Linking } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import polyline from '@mapbox/polyline'; // For decoding polyline geometry

type TripData = {
  tripId: string; 
  tripTitle: string;
  days: {
    day: number;
    date: string;
    activities: {
      time: string;
      destination: string;
      description: string;
      image: string;
    }[];
    transportation: string;
    accommodation: string;
    estimatedCost: string;
  }[];
  distanceInfo?: {
    totalDistanceKm: number;
    dailyBreakdown: {
      day: number;
      distanceKm: number;
    }[];
  };
};

type RootStackParamList = {
  TripMap: { tripPlan: TripData };
};

type Props = {
  route: RouteProp<RootStackParamList, 'TripMap'>;
  navigation: StackNavigationProp<RootStackParamList>;
};

type Coordinate = {
  latitude: number;
  longitude: number;
  destination: string;
};

type RouteSegment = {
  from: Coordinate;
  to: Coordinate;
  distance: string;
  duration: string;
  coordinates: { latitude: number; longitude: number }[]; // Full road coordinates
};

const TripMapScreen: React.FC<Props> = ({ route, navigation }) => {
  const { tripPlan } = route.params;
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinatesAndRoutes = async () => {
      const coords: Coordinate[] = [];
      const segments: RouteSegment[] = [];

      // Fetch coordinates for all destinations
      for (const day of tripPlan.days) {
        for (const activity of day.activities) {
          try {
            const response = await axios.get('https://nominatim.openstreetmap.org/search', {
              params: {
                q: `${activity.destination}, Sri Lanka`,
                format: 'json',
                limit: 1,
              },
              headers: {
                'User-Agent': 'TripPlannerApp/1.0',
              },
            });

            if (response.data && response.data.length > 0) {
              coords.push({
                latitude: parseFloat(response.data[0].lat),
                longitude: parseFloat(response.data[0].lon),
                destination: activity.destination,
              });
            }
          } catch (error) {
            console.error(`Error fetching coordinates for ${activity.destination}:`, error);
          }
        }
      }

      // Fetch routes and distances between destinations
      for (let i = 0; i < coords.length - 1; i++) {
        const from = coords[i];
        const to = coords[i + 1];

        try {
          const response = await axios.get(
            `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full`
          );

          if (response.data && response.data.routes && response.data.routes.length > 0) {
            const route = response.data.routes[0];
            // Decode the polyline geometry
            const routeCoordinates = polyline.decode(route.geometry).map(([latitude, longitude]) => ({
              latitude,
              longitude,
            }));
            segments.push({
              from,
              to,
              distance: `${Math.round(route.distance / 1000)} km`,
              duration: `${Math.round(route.duration / 60)} mins`,
              coordinates: routeCoordinates, // Full road coordinates
            });
          }
        } catch (error) {
          console.error(`Error fetching route between ${from.destination} and ${to.destination}:`, error);
        }
      }

      setCoordinates(coords);
      setRouteSegments(segments);
      setLoading(false);
    };

    fetchCoordinatesAndRoutes();
  }, [tripPlan]);

  const handleMarkerPress = (coord: Coordinate) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coord.latitude},${coord.longitude}`;
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading map...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: coordinates[0]?.latitude || 7.8731,
          longitude: coordinates[0]?.longitude || 80.7718,
          latitudeDelta: 0.5,
          longitudeDelta: 0.5,
        }}
      >
        {/* Markers for each destination */}
        {coordinates.map((coord, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: coord.latitude, longitude: coord.longitude }}
            title={`${index + 1}. ${coord.destination} 👉`} // Add special mark (👉) to title
            description={`Tap to open in Google Maps`} // Add description
            onCalloutPress={() => handleMarkerPress(coord)} // Handle marker title click
          />
        ))}

        {/* Polylines for actual road routes */}
        {routeSegments.map((segment, index) => (
          <Polyline
            key={index}
            coordinates={segment.coordinates} // Use full road coordinates
            strokeColor="#FF9800"
            strokeWidth={3}
          />
        ))}
      </MapView>

      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Bottom Panel for Route Segments */}
      <View style={styles.bottomPanel}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {routeSegments.map((segment, index) => (
            <View key={index} style={styles.segmentCard}>
              <Text style={styles.segmentText}>
                {index + 1}. {segment.from.destination} → {segment.to.destination}
              </Text>
              <Text style={styles.segmentText}>
                Distance: {segment.distance} | Duration: {segment.duration}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FF9800',
    padding: 12,
    borderRadius: 24,
    elevation: 4,
  },
  bottomPanel: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    elevation: 4,
  },
  segmentCard: {
    marginRight: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  segmentText: {
    fontSize: 14,
    color: '#333',
  },
});

export default TripMapScreen;