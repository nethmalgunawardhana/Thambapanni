import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Guides from '../components/GuideSelect'; // Adjust the import path as needed

type RootStackParamList = {
  TripResult: { success: boolean; tripPlan: any };
  SelectGuide: { tripPlan: any };
  BudgetReport: { tripPlan: any; selectedGuide: any };
};

type SelectGuideScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SelectGuide'>;
  route: { params: { tripPlan: any } };
};

const SelectGuideScreen: React.FC<SelectGuideScreenProps> = ({ navigation, route }) => {
  const { tripPlan } = route.params;

  const handleGuideSelect = (guide: any) => {
    navigation.navigate('BudgetReport', { tripPlan, selectedGuide: guide });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Guide</Text>
      <Guides onGuideSelect={handleGuideSelect} />
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
});

export default SelectGuideScreen;