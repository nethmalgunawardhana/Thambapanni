import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Image, ImageSourcePropType } from 'react-native';
import { StatusBar } from 'expo-status-bar';


interface ButtonProps {
  title: string;
  onPress?: () => void;
  className?: string;
}

const CustomButton: React.FC<ButtonProps> = ({ title, onPress, className }) => (
  <TouchableOpacity className={`bg-orange-500 rounded-lg py-4 ${className}`} onPress={onPress}>
    <Text className="text-center text-white text-lg font-semibold">{title}</Text>
  </TouchableOpacity>
);

const App: React.FC = () => {
const backgroundImage: ImageSourcePropType = { uri: 'https://www.annees-de-pelerinage.com/wp-content/uploads/2019/03/elephants.jpg' };
const logoImage: ImageSourcePropType = { uri: 'https://www.annees-de-pelerinage.com/wp-content/uploads/2019/03/elephants.jpg' };

  return (
    <ImageBackground source={backgroundImage} className="flex-1">
      <StatusBar style="light" />
      <View className="flex-1 bg-black/30">
        <View className="items-center mt-10">
          <View className="bg-sky-200 rounded-full p-4 w-24 h-24 items-center justify-center">
            <Image
              source={logoImage}
              className="w-16 h-16"
              resizeMode="contain"
            />
          </View>
        </View>

        <View className="flex-1 justify-center px-8">
          <Text className="text-white text-4xl font-bold text-center mb-20">
            Your One Stop for{'\n'}Sri Lankan Travel
          </Text>

          <CustomButton 
            title="Create an Account" 
            className="mb-4"
          />
          
          <CustomButton 
            title="Already have an account"
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default App;