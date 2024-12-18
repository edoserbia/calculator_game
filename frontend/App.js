import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';

// Import screens
import Calculator from './src/screens/Calculator';
import ScientificCalc from './src/screens/ScientificCalc';
import SnakeGame from './src/screens/SnakeGame';

const Stack = createNativeStackNavigator();

// Define theme
const theme = {
  colors: {
    primary: '#2089dc',
    secondary: '#8f9ca2',
    background: '#1c1c1c',
    white: '#ffffff',
    black: '#000000',
    grey0: '#2c2c2c',
    grey1: '#383838',
    grey2: '#4f4f4f',
  },
};

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Calculator"
          screenOptions={({ navigation, route }) => ({
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerRight: route.name !== 'SnakeGame' ? () => (
              <TouchableOpacity
                onPress={() => {
                  if (route.name === 'Calculator') {
                    navigation.navigate('ScientificCalc');
                  } else if (route.name === 'ScientificCalc') {
                    navigation.navigate('Calculator');
                  }
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ padding: 10 }}
              >
                <MaterialIcons
                  name={route.name === 'Calculator' ? 'functions' : 'calculate'}
                  size={24}
                  color={theme.colors.white}
                />
              </TouchableOpacity>
            ) : undefined
          })}>
          <Stack.Screen 
            name="Calculator" 
            component={Calculator} 
            options={{ title: 'Calculator' }}
          />
          <Stack.Screen 
            name="ScientificCalc" 
            component={ScientificCalc} 
            options={{ title: 'Scientific Calculator' }}
          />
          <Stack.Screen 
            name="SnakeGame" 
            component={SnakeGame} 
            options={{ title: 'Snake Game' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
} 