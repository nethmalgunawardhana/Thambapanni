import { Text, View } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NewStack from "./Navigation";

export default function Index() {
  return (
    <SafeAreaProvider>
      
        <View style={{ flex: 1 }}>
          <NewStack />
        </View>
    
    </SafeAreaProvider>
  );
}
