import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import CalcButton from '../components/CalcButton';
import CalcDisplay from '../components/CalcDisplay';
import { verifySecret } from '../api';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [secretCode, setSecretCode] = useState('');
  const [isNewCalculation, setIsNewCalculation] = useState(false);
  const navigation = useNavigation();

  const handleNumber = (num) => {
    if (isNewCalculation) {
      setExpression(num);
      setResult(num);
      setSecretCode(num);
      setIsNewCalculation(false);
      return;
    }

    if (result === '0') {
      setResult(num);
    } else {
      setResult(result + num);
    }
    setExpression(expression + num);
    setSecretCode(secretCode + num);
  };

  const handleOperator = async (operator) => {
    if (operator === '=') {
      setSecretCode(secretCode + operator);
      try {
        // 验证秘籍
        const response = await verifySecret(secretCode + operator);
        console.log('秘籍验证响应:', response);
        if (response.valid && response.game_type === 'snake') {
          console.log('导航到贪吃蛇游戏');
          navigation.navigate('SnakeGame');
          return;
        }
      } catch (error) {
        console.error('验证秘籍失败:', error);
      }
      // 计算结果
      calculate();
      setIsNewCalculation(true);
    } else {
      setExpression(expression + operator);
      setResult('0');
      setSecretCode(secretCode + operator);
      setIsNewCalculation(false);
    }
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
    setSecretCode('');
    setIsNewCalculation(false);
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
    if (secretCode.length > 0) {
      setSecretCode(secretCode.slice(0, -1));
    }
  };

  const calculate = () => {
    try {
      if (expression) {
        // 替换显示符号为实际运算符
        let evalExpression = expression
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/,/g, '')
          .replace(/％/g, '/100');

        // 安全的表达式计算
        const sanitizedExpression = evalExpression.replace(/[^0-9+\-*/.()]/g, '');
        // eslint-disable-next-line no-new-func
        const evalResult = Function('"use strict";return (' + sanitizedExpression + ')')();
        
        // 格式化结果，处理精度问题
        let formattedResult;
        if (Number.isInteger(evalResult)) {
          formattedResult = evalResult.toString();
        } else {
          // 处理小数精度，最多保留8位小数
          formattedResult = parseFloat(evalResult.toFixed(8))
            .toString()
            .replace(/\.?0+$/, ''); // 移除尾部多余的0
        }
        
        setResult(formattedResult);
        setExpression(formattedResult);
      }
    } catch (error) {
      setResult('错误');
      setExpression('');
    }
  };

  const handlePercent = () => {
    try {
      const currentValue = parseFloat(result);
      const percentValue = currentValue / 100;
      setResult(percentValue.toString());
      setExpression(expression.slice(0, -result.length) + percentValue);
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
          <CalcButton title="%" onPress={handlePercent} type="function" />
          <CalcButton title="÷" onPress={() => handleOperator('÷')} type="operator" />
        </View>
        <View style={styles.row}>
          <CalcButton title="7" onPress={() => handleNumber('7')} />
          <CalcButton title="8" onPress={() => handleNumber('8')} />
          <CalcButton title="9" onPress={() => handleNumber('9')} />
          <CalcButton title="×" onPress={() => handleOperator('×')} type="operator" />
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
          <CalcButton title="±" onPress={() => {
            const currentValue = parseFloat(result);
            const newValue = -currentValue;
            setResult(newValue.toString());
            setExpression(expression.slice(0, -result.length) + newValue);
          }} type="function" />
          <CalcButton title="0" onPress={() => handleNumber('0')} />
          <CalcButton title="." onPress={() => {
            if (!result.includes('.')) {
              handleNumber('.');
            }
          }} />
          <CalcButton title="=" onPress={() => handleOperator('=')} type="operator" />
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
    padding: 2,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
});

export default Calculator; 