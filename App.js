import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TrainingPlanScreen from './src/screens/TrainingPlanScreen';
import RangeTrainerScreen from './src/screens/RangeTrainerScreen';
import PushFoldScreen from './src/screens/PushFoldScreen';
import ExploitativeGuideScreen from './src/screens/ExploitativeGuideScreen';

const Tab = createBottomTabNavigator();

// Custom theme based on poker green
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2d5f3f',
    secondary: '#c41e3a',
    background: '#f5f5f5',
    surface: '#ffffff',
    onSurface: '#1a1a1a',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'cards' : 'cards-outline';
              } else if (route.name === 'Training') {
                iconName = focused ? 'calendar-check' : 'calendar-check-outline';
              } else if (route.name === 'Ranges') {
                iconName = focused ? 'grid' : 'grid-large';
              } else if (route.name === 'Push/Fold') {
                iconName = focused ? 'chart-line' : 'chart-line-variant';
              } else if (route.name === 'Exploits') {
                iconName = focused ? 'target' : 'target-variant';
              }

              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#2d5f3f',
            tabBarInactiveTintColor: '#666',
            headerStyle: {
              backgroundColor: '#2d5f3f',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Poker Training Pro' }}
          />
          <Tab.Screen
            name="Training"
            component={TrainingPlanScreen}
            options={{ title: '40h Plan' }}
          />
          <Tab.Screen
            name="Ranges"
            component={RangeTrainerScreen}
            options={{ title: 'Range Trainer' }}
          />
          <Tab.Screen
            name="Push/Fold"
            component={PushFoldScreen}
            options={{ title: 'Push/Fold Charts' }}
          />
          <Tab.Screen
            name="Exploits"
            component={ExploitativeGuideScreen}
            options={{ title: 'Exploits' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
