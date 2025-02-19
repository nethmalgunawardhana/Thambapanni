import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Guides from '../components/GuideSelect';

type RootStackParamList = {
  TripResult: { success: boolean; tripPlan: any };
  SelectGuide: { tripPlan: any; selectedVehicle?: any };
  BudgetReport: { tripPlan: any; selectedGuide?: any; selectedVehicle?: any };
};

type SelectGuideScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SelectGuide'>;
  route: { params: { tripPlan: any; selectedVehicle?: any } };
};

const SelectGuideScreen: React.FC<SelectGuideScreenProps> = ({ navigation, route }) => {
  const { tripPlan, selectedVehicle } = route.params;

  const handleGuideSelect = (guide: any) => {
    navigation.navigate('BudgetReport', { tripPlan, selectedGuide: guide, selectedVehicle });
  };

  const handleSkip = () => {
    navigation.navigate('BudgetReport', { tripPlan, selectedVehicle });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Guide</Text>
      <Guides onGuideSelect={handleGuideSelect} tripPlan={tripPlan} />
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  skipButton: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#FF9800',
    borderRadius: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SelectGuideScreen;