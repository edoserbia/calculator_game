import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import { submitScore } from '../api';

// 获取屏幕尺寸
const windowWidth = Dimensions.get('window').width;
const GRID_SIZE = 20;
const CELL_SIZE = Math.floor(windowWidth / GRID_SIZE);

// 定义方向
const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

const SnakeGame = () => {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
  ]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(DIRECTIONS.UP);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [gameLoop, setGameLoop] = useState(null);

  // 生成新的食物位置
  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  }, [snake]);

  // 检查碰撞
  const checkCollision = useCallback((head) => {
    // 检查墙壁碰撞
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    // 检查自身碰撞（跳过头部）
    return snake.slice(1).some(
      segment => segment.x === head.x && segment.y === head.y
    );
  }, [snake]);

  // 移动蛇
  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y,
      };

      if (checkCollision(newHead)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // 检查是否吃到食物
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, checkCollision, generateFood]);

  // 游戏结束处理
  const handleGameOver = useCallback(async () => {
    if (gameLoop) {
      clearInterval(gameLoop);
    }
    setIsGameOver(true);
    try {
      await submitScore(score, 'Player', 'snake');
    } catch (error) {
      console.error('提交分数失败:', error);
    }
  }, [gameLoop, score]);

  // 重新开始游戏
  const restartGame = useCallback(() => {
    if (gameLoop) {
      clearInterval(gameLoop);
    }
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
    ]);
    setDirection(DIRECTIONS.UP);
    setScore(0);
    setIsGameOver(false);
    setIsPaused(false);
    generateFood();
  }, [gameLoop, generateFood]);

  // 开始游戏循环
  useEffect(() => {
    if (!isGameOver && !isPaused) {
      const interval = setInterval(moveSnake, 200);
      setGameLoop(interval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isGameOver, isPaused, moveSnake]);

  // 初始化游戏
  useEffect(() => {
    generateFood();
    return () => {
      if (gameLoop) {
        clearInterval(gameLoop);
      }
    };
  }, []);

  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // 方向控制
  const handleDirection = useCallback((newDirection) => {
    setDirection(prevDirection => {
      // 防止反向移动
      const isOpposite = (
        (prevDirection === DIRECTIONS.UP && newDirection === DIRECTIONS.DOWN) ||
        (prevDirection === DIRECTIONS.DOWN && newDirection === DIRECTIONS.UP) ||
        (prevDirection === DIRECTIONS.LEFT && newDirection === DIRECTIONS.RIGHT) ||
        (prevDirection === DIRECTIONS.RIGHT && newDirection === DIRECTIONS.LEFT)
      );

      if (!isOpposite) {
        return newDirection;
      }
      return prevDirection;
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.score}>得分: {score}</Text>
        <TouchableOpacity 
          onPress={togglePause} 
          style={styles.pauseButton}
          activeOpacity={0.7}
        >
          <Icon
            name={isPaused ? 'play' : 'pause'}
            type="font-awesome"
            color="#ffffff"
            size={20}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.gameBoard}>
        {/* 渲染食物 */}
        <View
          style={[
            styles.food,
            {
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
            },
          ]}
        />

        {/* 渲染蛇 */}
        {snake.map((segment, index) => (
          <View
            key={`${segment.x}-${segment.y}`}
            style={[
              styles.snakeSegment,
              {
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                backgroundColor: index === 0 ? '#4CAF50' : '#81C784',
              },
            ]}
          />
        ))}
      </View>

      {/* 方向控制按钮 */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.upButton]}
          onPress={() => handleDirection(DIRECTIONS.UP)}
          activeOpacity={0.7}
        >
          <Icon name="arrow-up" type="font-awesome" color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.horizontalControls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.leftButton]}
            onPress={() => handleDirection(DIRECTIONS.LEFT)}
            activeOpacity={0.7}
          >
            <Icon name="arrow-left" type="font-awesome" color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.controlButton, styles.rightButton]}
            onPress={() => handleDirection(DIRECTIONS.RIGHT)}
            activeOpacity={0.7}
          >
            <Icon name="arrow-right" type="font-awesome" color="#ffffff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.controlButton, styles.downButton]}
          onPress={() => handleDirection(DIRECTIONS.DOWN)}
          activeOpacity={0.7}
        >
          <Icon name="arrow-down" type="font-awesome" color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* 游戏结束弹窗 */}
      {isGameOver && (
        <View style={styles.gameOver}>
          <Text style={styles.gameOverText}>游戏结束</Text>
          <Text style={styles.finalScore}>最终得分: {score}</Text>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={restartGame}
            activeOpacity={0.7}
          >
            <Text style={styles.restartText}>重新开始</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c1c1c',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  score: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pauseButton: {
    padding: 10,
  },
  gameBoard: {
    width: GRID_SIZE * CELL_SIZE,
    height: GRID_SIZE * CELL_SIZE,
    borderWidth: 2,
    borderColor: '#333333',
    position: 'relative',
    alignSelf: 'center',
    backgroundColor: '#262626',
  },
  snakeSegment: {
    width: CELL_SIZE - 2,
    height: CELL_SIZE - 2,
    position: 'absolute',
    borderRadius: 2,
  },
  food: {
    width: CELL_SIZE - 2,
    height: CELL_SIZE - 2,
    backgroundColor: '#FF5252',
    position: 'absolute',
    borderRadius: CELL_SIZE / 2,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  horizontalControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  controlButton: {
    width: 60,
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  gameOver: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverText: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  finalScore: {
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 30,
  },
  restartButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  restartText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SnakeGame;