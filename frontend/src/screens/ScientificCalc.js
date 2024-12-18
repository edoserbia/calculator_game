import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CalcButton from '../components/CalcButton';
import CalcDisplay from '../components/CalcDisplay';

const ScientificCalc = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');

  const handleNumber = (num) => {
    if (result === '0') {
      setResult(num);
    } else {
      setResult(result + num);
    }
    setExpression(expression + num);
  };

  const handleOperator = (operator) => {
    setExpression(expression + operator);
    setResult('0');
  };

  const handleFunction = (func) => {
    switch (func) {
      case 'sin':
      case 'cos':
      case 'tan':
        setExpression(expression + func + '(');
        break;
      case 'ln':
        setExpression(expression + 'Math.log(');
        break;
      case 'log':
        setExpression(expression + 'Math.log10(');
        break;
      case 'π':
        setExpression(expression + 'Math.PI');
        break;
      case 'e':
        setExpression(expression + 'Math.E');
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
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
      // 替换三角函数为JavaScript Math函数
      let evalExpression = expression
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan');
      const evalResult = eval(evalExpression);
      setResult(evalResult.toString());
      setExpression(evalResult.toString());
    } catch (error) {
      setResult('错误');
    }
  };

  return (
    <View style={styles.container}>
      <CalcDisplay expression={expression} result={result} />
      <ScrollView style={styles.buttonContainer}>
        <View style={styles.row}>
          <CalcButton title="sin" onPress={() => handleFunction('sin')} type="function" />
          <CalcButton title="cos" onPress={() => handleFunction('cos')} type="function" />
          <CalcButton title="tan" onPress={() => handleFunction('tan')} type="function" />
          <CalcButton title="π" onPress={() => handleFunction('π')} type="function" />
        </View>
        <View style={styles.row}>
          <CalcButton title="ln" onPress={() => handleFunction('ln')} type="function" />
          <CalcButton title="log" onPress={() => handleFunction('log')} type="function" />
          <CalcButton title="e" onPress={() => handleFunction('e')} type="function" />
          <CalcButton title="^" onPress={() => handleOperator('**')} type="operator" />
        </View>
        <View style={styles.row}>
          <CalcButton title="(" onPress={() => handleOperator('(')} type="function" />
          <CalcButton title=")" onPress={() => handleOperator(')')} type="function" />
          <CalcButton title="C" onPress={handleClear} type="function" />
          <CalcButton title="⌫" onPress={handleDelete} type="function" />
        </View>
        <View style={styles.row}>
          <CalcButton title="7" onPress={() => handleNumber('7')} />
          <CalcButton title="8" onPress={() => handleNumber('8')} />
          <CalcButton title="9" onPress={() => handleNumber('9')} />
          <CalcButton title="÷" onPress={() => handleOperator('/')} type="operator" />
        </View>
        <View style={styles.row}>
          <CalcButton title="4" onPress={() => handleNumber('4')} />
          <CalcButton title="5" onPress={() => handleNumber('5')} />
          <CalcButton title="6" onPress={() => handleNumber('6')} />
          <CalcButton title="×" onPress={() => handleOperator('*')} type="operator" />
        </View>
        <View style={styles.row}>
          <CalcButton title="1" onPress={() => handleNumber('1')} />
          <CalcButton title="2" onPress={() => handleNumber('2')} />
          <CalcButton title="3" onPress={() => handleNumber('3')} />
          <CalcButton title="-" onPress={() => handleOperator('-')} type="operator" />
        </View>
        <View style={styles.row}>
          <CalcButton title="0" onPress={() => handleNumber('0')} />
          <CalcButton title="." onPress={() => handleNumber('.')} />
          <CalcButton title="=" onPress={calculate} type="operator" />
          <CalcButton title="+" onPress={() => handleOperator('+')} type="operator" />
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default ScientificCalc; 