import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SnakeGame = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>贪吃蛇游戏开发中...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#ffffff',
    fontSize: 20,
  },
});

export default SnakeGame;