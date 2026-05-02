import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Services
import { errorTracking } from './src/services/errorTracking';

// Highlight.io telemetry
import { hookConsole } from './src/config/highlight';

// Hook console immediately at module level to capture early boot errors
hookConsole();

// Context
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Components
import { LoadingSpinner } from './src/components/LoadingSpinner';
import { ErrorBoundary } from './src/components/ErrorBoundary';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';

// Main Screens
import HomeScreen from './src/screens/HomeScreen';
import TrainingPlanScreen from './src/screens/TrainingPlanScreen';
import RangeTrainerScreen from './src/screens/RangeTrainerScreen';
import PushFoldScreen from './src/screens/PushFoldScreen';
import ExploitativeGuideScreen from './src/screens/ExploitativeGuideScreen';
import QuizGameScreen from './src/screens/QuizGameScreen';
import SpacedRepetitionScreen from './src/screens/SpacedRepetitionScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';

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

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
      />
    </Stack.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
      />
      <Stack.Screen
        name="MainApp"
        component={TabNavigator}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return isAuthenticated ? <RootStack /> : <AuthStack />;
}

export default function App() {
  // Initialize error tracking on app start
  useEffect(() => {
    errorTracking.initialize();
  }, []);

  // Navigation state change handler
  const handleNavigationStateChange = (state) => {
    if (state) {
      const currentRoute = getActiveRouteName(state);
      if (currentRoute) {
        errorTracking.trackScreenView(currentRoute);
      }
    }
  };

  return (
    <ErrorBoundary>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <NavigationContainer onStateChange={handleNavigationStateChange}>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </ErrorBoundary>
  );
}

// Helper to get active route name
function getActiveRouteName(state) {
  const route = state.routes[state.index];

  if (route.state) {
    return getActiveRouteName(route.state);
  }

  return route.name;
}
