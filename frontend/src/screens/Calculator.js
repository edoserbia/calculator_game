import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CalcButton from '../components/CalcButton';
import CalcDisplay from '../components/CalcDisplay';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [secretCode, setSecretCode] = useState('');
  const navigation = useNavigation();

  const handleNumber = (num) => {
    if (result === '0') {
      setResult(num);
    } else {
      setResult(result + num);
    }
    setExpression(expression + num);
    setSecretCode(secretCode + num);
  };

  const handleOperator = (operator) => {
    setExpression(expression + operator);
    setResult('0');
    if (operator === '=') {
      setSecretCode(secretCode + operator);
      // 检查秘籍
      if (secretCode + operator === '9527*9527-9527=') {
        navigation.navigate('SnakeGame');
      }
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
    setSecretCode('');
  };

  const handleDelete = () => {
    if (result.length > 1) {
      setResult(result.slice(0, -1));
    } else {
      setResult('0');
    }
    if (expression.length > 0) {
      setExpression(expression.slice(0, -1));
    }
  };

  const calculate = () => {
    try {
      const evalResult = eval(expression);
      setResult(evalResult.toString());
      setExpression(evalResult.toString());
    } catch (error) {
      setResult('错误');
    }
  };

  return (
    <View style={styles.container}>
      <CalcDisplay expression={expression} result={result} />
      <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <CalcButton title="C" onPress={handleClear} type="function" />
          <CalcButton title="⌫" onPress={handleDelete} type="function" />
          <CalcButton title="%" onPress={() => handleOperator('%')} type="operator" />
          <CalcButton title="÷" onPress={() => handleOperator('/')} type="operator" />
        </View>
        <View style={styles.row}>
          <CalcButton title="7" onPress={() => handleNumber('7')} />
          <CalcButton title="8" onPress={() => handleNumber('8')} />
          <CalcButton title="9" onPress={() => handleNumber('9')} />
          <CalcButton title="×" onPress={() => handleOperator('*')} type="operator" />
        </View>
        <View style={styles.row}>
          <CalcButton title="4" onPress={() => handleNumber('4')} />
          <CalcButton title="5" onPress={() => handleNumber('5')} />
          <CalcButton title="6" onPress={() => handleNumber('6')} />
          <CalcButton title="-" onPress={() => handleOperator('-')} type="operator" />
        </View>
        <View style={styles.row}>
          <CalcButton title="1" onPress={() => handleNumber('1')} />
          <CalcButton title="2" onPress={() => handleNumber('2')} />
          <CalcButton title="3" onPress={() => handleNumber('3')} />
          <CalcButton title="+" onPress={() => handleOperator('+')} type="operator" />
        </View>
        <View style={styles.row}>
          <CalcButton title="±" onPress={() => handleOperator('-')} />
          <CalcButton title="0" onPress={() => handleNumber('0')} />
          <CalcButton title="." onPress={() => handleNumber('.')} />
          <CalcButton title="=" onPress={() => {
            calculate();
            handleOperator('=');
          }} type="operator" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  buttonContainer: {
    flex: 1,
    padding: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default Calculator; 