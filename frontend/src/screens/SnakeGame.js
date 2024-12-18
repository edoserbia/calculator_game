import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Text } from 'react-native-elements';

const GRID_SIZE = 20;
const CELL_SIZE = Math.floor(Dimensions.get('window').width / GRID_SIZE);
const INITIAL_SNAKE = [{ x: 5, y: 5 }];
const INITIAL_FOOD = { x: 10, y: 10 };
const INITIAL_DIRECTION = 'RIGHT';

const SnakeGame = () => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoop = useRef(null);

  const generateFood = () => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  };

  const checkCollision = (head) => {
    // 检查是否撞墙
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    // 检查是否撞到自己
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  };

  const moveSnake = () => {
    const head = { ...snake[0] };
    switch (direction) {
      case 'UP':
        head.y -= 1;
        break;
      case 'DOWN':
        head.y += 1;
        break;
      case 'LEFT':
        head.x -= 1;
        break;
      case 'RIGHT':
        head.x += 1;
        break;
      default:
        break;
    }

    if (checkCollision(head)) {
      Alert.alert('游戏结束', `得分: ${score}`, [
        { text: '重新开始', onPress: resetGame },
      ]);
      return;
    }

    const newSnake = [head, ...snake];
    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
      setScore(score + 10);
    } else {
      newSnake.pop();
    }
    setSnake(newSnake);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    if (!isPaused) {
      gameLoop.current = setInterval(moveSnake, 200);
    }
    return () => clearInterval(gameLoop.current);
  }, [snake, direction, food, isPaused]);

  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const isSnake = snake.some((s) => s.x === col && s.y === row);
        const isFood = food.x === col && food.y === row;
        const cellStyle = [
          styles.cell,
          isSnake && styles.snake,
          isFood && styles.food,
        ];
        grid.push(<View key={`${row}-${col}`} style={cellStyle} />);
      }
    }
    return grid;
  };

  const handleControl = (newDirection) => {
    const opposites = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    };
    if (opposites[newDirection] !== direction) {
      setDirection(newDirection);
    }
  };

  return (
    <View style={styles.container}>
      <Text h4 style={styles.score}>得分: {score}</Text>
      <View style={styles.grid}>{renderGrid()}</View>
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => handleControl('UP')}>
          <Text style={styles.controlText}>↑</Text>
        </TouchableOpacity>
        <View style={styles.horizontalControls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleControl('LEFT')}>
            <Text style={styles.controlText}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.pauseButton]}
            onPress={() => setIsPaused(!isPaused)}>
            <Text style={styles.controlText}>{isPaused ? '▶' : '⏸'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => handleControl('RIGHT')}>
            <Text style={styles.controlText}>→</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => handleControl('DOWN')}>
          <Text style={styles.controlText}>↓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    color: 'white',
    marginBottom: 20,
  },
  grid: {
    width: GRID_SIZE * CELL_SIZE,
    height: GRID_SIZE * CELL_SIZE,
    backgroundColor: '#2c2c2c',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: '#1c1c1c',
  },
  snake: {
    backgroundColor: '#2089dc',
  },
  food: {
    backgroundColor: '#ff4444',
  },
  controls: {
    marginTop: 20,
    alignItems: 'center',
  },
  horizontalControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 60,
    height: 60,
    backgroundColor: '#2c2c2c',
    margin: 5,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#4f4f4f',
  },
  controlText: {
    color: 'white',
    fontSize: 24,
  },
});

export default SnakeGame;