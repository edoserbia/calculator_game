import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
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
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 8,
    margin: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  operatorButton: {
    backgroundColor: '#ff9500',
  },
  functionButton: {
    backgroundColor: '#a6a6a6',
  },
  text: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  operatorText: {
    color: '#ffffff',
  },
  functionText: {
    color: '#000000',
  },
});

export default React.memo(CalcButton);