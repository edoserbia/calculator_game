import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { submitScore } from '../api';

// Get screen dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const GRID_SIZE = 20;
const HEADER_HEIGHT = 80;
const GAME_PADDING = 20;
const CONTROL_HEIGHT = 150; // Height for control buttons

// Calculate the maximum possible cell size that will fit on the screen
const CELL_SIZE = Math.floor(
  Math.min(
    (windowWidth - GAME_PADDING * 2) / GRID_SIZE,
    (windowHeight - HEADER_HEIGHT - CONTROL_HEIGHT - GAME_PADDING * 2) / GRID_SIZE
  )
);

// Calculate game board dimensions
const BOARD_SIZE = CELL_SIZE * GRID_SIZE;

// Define directions
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

  // Generate new food position
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

  // Check collision
  const checkCollision = useCallback((head) => {
    if (
      head.x < 0 ||
      head.x >= GRID_SIZE ||
      head.y < 0 ||
      head.y >= GRID_SIZE
    ) {
      return true;
    }
    return snake.slice(1).some(
      segment => segment.x === head.x && segment.y === head.y
    );
  }, [snake]);

  // Move snake
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

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        generateFood();
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, checkCollision, generateFood]);

  // Handle game over
  const handleGameOver = useCallback(async () => {
    if (gameLoop) {
      clearInterval(gameLoop);
    }
    setIsGameOver(true);
    try {
      await submitScore(score, 'Player', 'snake');
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  }, [gameLoop, score]);

  // Restart game
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

  // Game loop
  useEffect(() => {
    if (!isGameOver && !isPaused) {
      const interval = setInterval(moveSnake, 200);
      setGameLoop(interval);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [isGameOver, isPaused, moveSnake]);

  // Initialize game
  useEffect(() => {
    generateFood();
    return () => {
      if (gameLoop) {
        clearInterval(gameLoop);
      }
    };
  }, []);

  // Toggle pause
  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  // Handle direction
  const handleDirection = useCallback((newDirection) => {
    setDirection(prevDirection => {
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
        <Text style={styles.score}>Score: {score}</Text>
        <TouchableOpacity 
          onPress={togglePause} 
          style={styles.pauseButton}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={isPaused ? "play-arrow" : "pause"}
            size={24}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.gameBoard}>
        <View
          style={[
            styles.food,
            {
              left: food.x * CELL_SIZE,
              top: food.y * CELL_SIZE,
            },
          ]}
        />

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

      <View style={styles.controls}>
        <TouchableOpacity 
          style={[styles.controlButton, styles.upButton]}
          onPress={() => handleDirection(DIRECTIONS.UP)}
        >
          <MaterialIcons name="keyboard-arrow-up" size={40} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.horizontalControls}>
          <TouchableOpacity 
            style={[styles.controlButton, styles.leftButton]}
            onPress={() => handleDirection(DIRECTIONS.LEFT)}
          >
            <MaterialIcons name="keyboard-arrow-left" size={40} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.controlButton, styles.rightButton]}
            onPress={() => handleDirection(DIRECTIONS.RIGHT)}
          >
            <MaterialIcons name="keyboard-arrow-right" size={40} color="#ffffff" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.controlButton, styles.downButton]}
          onPress={() => handleDirection(DIRECTIONS.DOWN)}
        >
          <MaterialIcons name="keyboard-arrow-down" size={40} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {isGameOver && (
        <View style={styles.gameOver}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Text style={styles.finalScore}>Final Score: {score}</Text>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={restartGame}
            activeOpacity={0.7}
          >
            <Text style={styles.restartText}>Restart</Text>
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
    height: HEADER_HEIGHT,
  },
  score: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  pauseButton: {
    width: 40,
    height: 40,
    backgroundColor: '#333333',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameBoard: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderWidth: 2,
    borderColor: '#333333',
    position: 'relative',
    alignSelf: 'center',
    backgroundColor: '#262626',
    marginTop: 20,
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
    height: CONTROL_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
    backgroundColor: '#333333',
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