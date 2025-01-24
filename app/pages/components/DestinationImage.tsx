import React from 'react';
import { Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface DestinationImageProps {
  imageUrl: string;
  onPress: () => void;
}

 const DestinationImage: React.FC<DestinationImageProps> = ({ imageUrl, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
    image: {
        width: 200,
        height: 120,
        marginRight: 8,
        borderRadius: 12,
      },
    
    
});
export default DestinationImage;