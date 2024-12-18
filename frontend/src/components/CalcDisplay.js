import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

const CalcDisplay = ({ expression, result }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.expression}>{expression}</Text>
      <Text style={styles.result}>{result}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    minHeight: 120,
  },
  expression: {
    color: '#8f9ca2',
    fontSize: 24,
    marginBottom: 10,
  },
  result: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
  },
});

export default CalcDisplay;