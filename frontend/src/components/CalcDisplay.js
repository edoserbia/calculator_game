import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

const CalcDisplay = ({ expression, result }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.expression} numberOfLines={2} ellipsizeMode="head">
        {expression}
      </Text>
      <Text style={styles.result} numberOfLines={1} ellipsizeMode="head">
        {result}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    minHeight: 150,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  expression: {
    color: '#8f9ca2',
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'right',
  },
  result: {
    color: '#ffffff',
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default React.memo(CalcDisplay);