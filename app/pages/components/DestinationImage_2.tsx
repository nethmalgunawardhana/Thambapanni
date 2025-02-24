import React from 'react';
import { Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface DestinationImageProps {
  imageUrl: string;
  onPress: () => void;
}

const DestinationImage_2 = ({ imageUrl, onPress }: DestinationImageProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    width: windowWidth - 28,
    alignItems: 'center',
  },
  image: {
    width: '92%',
    height: 200,
    borderRadius: 12,
  },
});

export default DestinationImage_2;