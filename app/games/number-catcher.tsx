import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, RotateCcw } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const BASKET_WIDTH = 80;
const BASKET_HEIGHT = 60;
const NUMBER_SIZE = 50;

export default function NumberCatcherGame() {
  const [targetNumber, setTargetNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [fallingNumbers, setFallingNumbers] = useState([]);
  const [basketPosition, setBasketPosition] = useState(width / 2 - BASKET_WIDTH / 2);

  const basketX = useSharedValue(width / 2 - BASKET_WIDTH / 2);

  useEffect(() => {
    if (!gameOver && !gameWon) {
      const interval = setInterval(() => {
        spawnNumber();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [gameOver, gameWon, targetNumber]);

  const spawnNumber = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    const x = Math.random() * (width - NUMBER_SIZE);
    
    const newNumber = {
      id: Date.now(),
      value: randomNumber,
      x,
      y: useSharedValue(-NUMBER_SIZE),
      isCorrect: randomNumber === targetNumber
    };

    setFallingNumbers(prev => [...prev, newNumber]);

    // Animate falling
    newNumber.y.value = withTiming(height, { duration: 3000 }, (finished) => {
      if (finished) {
        runOnJS(removeNumber)(newNumber.id);
        if (newNumber.isCorrect) {
          runOnJS(loseLife)();
        }
      }
    });
  };

  const removeNumber = (id) => {
    setFallingNumbers(prev => prev.filter(num => num.id !== id));
  };

  const loseLife = () => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        setGameOver(true);
      }
      return newLives;
    });
  };

  const catchNumber = (number) => {
    if (number.isCorrect) {
      setScore(prev => prev + 10);
      setTargetNumber(prev => {
        const next = prev + 1;
        if (next > 10) {
          setGameWon(true);
          return prev;
        }
        return next;
      });
    } else {
      loseLife();
    }
    removeNumber(number.id);
  };

  const moveBasket = (direction) => {
    const newPosition = direction === 'left' 
      ? Math.max(0, basketPosition - 50)
      : Math.min(width - BASKET_WIDTH, basketPosition + 50);
    
    setBasketPosition(newPosition);
    basketX.value = withSpring(newPosition);
  };

  const checkCollision = (number) => {
    const numberBottom = number.y.value + NUMBER_SIZE;
    const basketTop = height - 150;
    const basketLeft = basketPosition;
    const basketRight = basketPosition + BASKET_WIDTH;
    const numberLeft = number.x;
    const numberRight = number.x + NUMBER_SIZE;

    if (numberBottom >= basketTop && 
        numberLeft < basketRight && 
        numberRight > basketLeft) {
      catchNumber(number);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fallingNumbers.forEach(checkCollision);
    }, 100);
    return () => clearInterval(interval);
  }, [fallingNumbers, basketPosition]);

  const restartGame = () => {
    setTargetNumber(1);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setGameWon(false);
    setFallingNumbers([]);
    setBasketPosition(width / 2 - BASKET_WIDTH / 2);
    basketX.value = width / 2 - BASKET_WIDTH / 2;
  };

  const basketAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: basketX.value }],
  }));

  if (gameOver || gameWon) {
    return (
      <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.gameOverContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
              style={styles.gameOverCard}
            >
              <Text style={styles.gameOverEmoji}>{gameWon ? '🎉' : '😢'}</Text>
              <Text style={styles.gameOverTitle}>
                {gameWon ? 'Congratulations!' : 'Game Over!'}
              </Text>
              <Text style={styles.gameOverText}>
                {gameWon 
                  ? 'You caught all the numbers!' 
                  : 'Better luck next time!'}
              </Text>
              <Text style={styles.finalScore}>Final Score: {score}</Text>
              
              <View style={styles.gameOverButtons}>
                <Pressable style={styles.restartButton} onPress={restartGame}>
                  <LinearGradient colors={['#A8EDEA', '#FED6E3']} style={styles.buttonGradient}>
                    <RotateCcw size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Play Again</Text>
                  </LinearGradient>
                </Pressable>
                
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                  <LinearGradient colors={['#FF9A9E', '#FECFEF']} style={styles.buttonGradient}>
                    <ArrowLeft size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Back to Games</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#87CEEB', '#B0E0E6', '#E0F6FF']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerBackButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#2C3E50" />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.title}>🧺 Number Catcher</Text>
            <Text style={styles.subtitle}>Catch number {targetNumber}!</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.livesText}>Lives: {'❤️'.repeat(lives)}</Text>
          </View>
        </View>

        {/* Game Area */}
        <View style={styles.gameArea}>
          {/* Falling Numbers */}
          {fallingNumbers.map((number) => (
            <FallingNumber key={number.id} number={number} />
          ))}

          {/* Basket */}
          <Animated.View style={[styles.basket, basketAnimatedStyle]}>
            <LinearGradient
              colors={['#8B4513', '#A0522D']}
              style={styles.basketGradient}
            >
              <Text style={styles.basketText}>🧺</Text>
            </LinearGradient>
          </Animated.View>

          {/* Controls */}
          <View style={styles.controls}>
            <Pressable 
              style={styles.controlButton} 
              onPress={() => moveBasket('left')}
            >
              <LinearGradient colors={['#FF9A9E', '#FECFEF']} style={styles.controlGradient}>
                <Text style={styles.controlText}>←</Text>
              </LinearGradient>
            </Pressable>
            
            <Pressable 
              style={styles.controlButton} 
              onPress={() => moveBasket('right')}
            >
              <LinearGradient colors={['#A8EDEA', '#FED6E3']} style={styles.controlGradient}>
                <Text style={styles.controlText}>→</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const FallingNumber = ({ number }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: number.x },
      { translateY: number.y.value }
    ],
  }));

  return (
    <Animated.View style={[styles.fallingNumber, animatedStyle]}>
      <LinearGradient
        colors={number.isCorrect ? ['#2ECC71', '#27AE60'] : ['#E74C3C', '#C0392B']}
        style={styles.numberGradient}
      >
        <Text style={styles.numberText}>{number.value}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerBackButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#5D6D7E',
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
  },
  livesText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#E74C3C',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  fallingNumber: {
    position: 'absolute',
    width: NUMBER_SIZE,
    height: NUMBER_SIZE,
    zIndex: 10,
  },
  numberGradient: {
    width: NUMBER_SIZE,
    height: NUMBER_SIZE,
    borderRadius: NUMBER_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  numberText: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  basket: {
    position: 'absolute',
    bottom: 100,
    width: BASKET_WIDTH,
    height: BASKET_HEIGHT,
    zIndex: 5,
  },
  basketGradient: {
    width: BASKET_WIDTH,
    height: BASKET_HEIGHT,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  basketText: {
    fontSize: 40,
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
  },
  controlButton: {
    borderRadius: 30,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  controlGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  controlText: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gameOverCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    width: '100%',
    maxWidth: 350,
  },
  gameOverEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  gameOverTitle: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  gameOverText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  finalScore: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#E74C3C',
    marginBottom: 30,
  },
  gameOverButtons: {
    width: '100%',
    gap: 15,
  },
  restartButton: {
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  backButton: {
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 20,
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
  },
});