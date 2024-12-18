import React from 'react';
import { TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from 'react-native-elements';
import { Icon } from 'react-native-elements';

// 导入页面
import Calculator from './src/screens/Calculator';
import ScientificCalc from './src/screens/ScientificCalc';
import SnakeGame from './src/screens/SnakeGame';

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
          screenOptions={({ navigation, route }) => ({
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            headerTintColor: theme.colors.white,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  if (route.name === 'Calculator') {
                    navigation.navigate('ScientificCalc');
                  } else if (route.name === 'ScientificCalc') {
                    navigation.navigate('Calculator');
                  }
                }}
                style={{ marginRight: 10 }}
              >
                <Icon
                  name={route.name === 'Calculator' ? 'functions' : 'calculate'}
                  type="material"
                  color={theme.colors.white}
                  size={24}
                />
              </TouchableOpacity>
            ),
          })}>
          <Stack.Screen 
            name="Calculator" 
            component={Calculator} 
            options={{ title: '基础计算器' }}
          />
          <Stack.Screen 
            name="ScientificCalc" 
            component={ScientificCalc} 
            options={{ title: '科学计算器' }}
          />
          <Stack.Screen 
            name="SnakeGame" 
            component={SnakeGame} 
            options={{ title: '贪吃蛇' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
} 