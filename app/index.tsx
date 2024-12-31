import { Text, View } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import App from "./splash";

export default function Index() {
  return (
    <SafeAreaProvider>
      
        <View style={{ flex: 1 }}>
          <App />
        </View>
    
    </SafeAreaProvider>
  );
}
