import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Font loading
import { useFonts, Inter_400Regular, Inter_700Bold } from '@expo-google-fonts/inter';

// Screens
import HomeScreen from './screens/HomeScreen';
import AddPhotoScreen from './screens/AddPhotoScreen';
import EditPhotoScreen from './screens/EditPhotoScreen';

// Sample Data Screen
import DataLoaderScreen from './screens/DataLoaderScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer theme={DarkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerTitleStyle: {
            fontFamily: 'Inter_700Bold',
          },
        }}
      >
        <Stack.Screen name="Photo Log" component={HomeScreen} />
        <Stack.Screen name="Add" component={AddPhotoScreen} />
        <Stack.Screen name="Edit" component={EditPhotoScreen} />

        { /* Sample Data */}
        <Stack.Screen
          name="DataLoader"
          component={DataLoaderScreen}
          options={{ title: 'Data Loader' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
