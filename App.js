import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TrainingPlanScreen from './src/screens/TrainingPlanScreen';
import RangeTrainerScreen from './src/screens/RangeTrainerScreen';
import PushFoldScreen from './src/screens/PushFoldScreen';
import ExploitativeGuideScreen from './src/screens/ExploitativeGuideScreen';
import QuizGameScreen from './src/screens/QuizGameScreen';
import SpacedRepetitionScreen from './src/screens/SpacedRepetitionScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Learn') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Practice') {
            iconName = focused ? 'gamepad-variant' : 'gamepad-variant-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account-circle' : 'account-circle-outline';
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
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home', headerTitle: 'Poker Training Pro' }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnStack}
        options={{ title: 'Lernen', headerShown: false }}
      />
      <Tab.Screen
        name="Practice"
        component={PracticeStack}
        options={{ title: 'Üben', headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

function LearnStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2d5f3f' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="Training"
        component={TrainingPlanScreen}
        options={{ title: '40h Trainingsplan' }}
      />
      <Stack.Screen
        name="Ranges"
        component={RangeTrainerScreen}
        options={{ title: 'Range Trainer' }}
      />
      <Stack.Screen
        name="PushFold"
        component={PushFoldScreen}
        options={{ title: 'Push/Fold Charts' }}
      />
      <Stack.Screen
        name="Exploits"
        component={ExploitativeGuideScreen}
        options={{ title: 'Exploitative Strategies' }}
      />
    </Stack.Navigator>
  );
}

function PracticeStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2d5f3f' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="QuizGame"
        component={QuizGameScreen}
        options={{ title: 'Quiz Game' }}
      />
      <Stack.Screen
        name="SpacedRepetition"
        component={SpacedRepetitionScreen}
        options={{ title: 'Spaced Repetition' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
