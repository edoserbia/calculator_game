import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from 'react-native-elements';

// 导入页面
import Calculator from './screens/Calculator';
import ScientificCalc from './screens/ScientificCalc';
import SnakeGame from './screens/SnakeGame';

const Stack = createNativeStackNavigator();

// 定义主题
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
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
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