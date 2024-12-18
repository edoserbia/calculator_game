import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';

const CalcButton = ({ title, onPress, type = 'number' }) => {
  const buttonStyle = [
    styles.button,
    type === 'operator' && styles.operatorButton,
    type === 'function' && styles.functionButton,
  ];

  const textStyle = [
    styles.text,
    type === 'operator' && styles.operatorText,
    type === 'function' && styles.functionText,
  ];

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c2c2c',
    margin: 5,
    borderRadius: 10,
    height: 60,
  },
  operatorButton: {
    backgroundColor: '#2089dc',
  },
  functionButton: {
    backgroundColor: '#4f4f4f',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  operatorText: {
    color: 'white',
  },
  functionText: {
    color: '#e0e0e0',
  },
});

export default CalcButton;