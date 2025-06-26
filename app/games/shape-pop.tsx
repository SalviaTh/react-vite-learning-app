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

const shapes = [
  { name: 'circle', emoji: '🔴', color: ['#E74C3C', '#C0392B'] },
  { name: 'square', emoji: '🟦', color: ['#3498DB', '#2980B9'] },
  { name: 'triangle', emoji: '🔺', color: ['#F39C12', '#E67E22'] },
  { name: 'star', emoji: '⭐', color: ['#F1C40F', '#F39C12'] },
  { name: 'heart', emoji: '❤️', color: ['#E91E63', '#AD1457'] },
];

const BALLOON_SIZE = 80;

export default function ShapePopGame() {
  const [targetShape, setTargetShape] = useState(shapes[0]);
  const [balloons, setBalloons] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);

  const targetScale = useSharedValue(1);

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(() => {
        spawnBalloon();
      }, Math.max(1000 - (level * 100), 500));
      return () => clearInterval(interval);
    }
  }, [gameOver, level]);

  useEffect(() => {
    // Animate target shape
    targetScale.value = withSpring(1.2, { damping: 15, stiffness: 100 });
    setTimeout(() => {
      targetScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    }, 500);
  }, [targetShape]);

  const spawnBalloon = () => {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    const x = Math.random() * (width - BALLOON_SIZE);
    const y = height;

    const newBalloon = {
      id: Date.now(),
      shape: randomShape,
      x,
      y: useSharedValue(y),
      scale: useSharedValue(1),
      isCorrect: randomShape.name === targetShape.name
    };

    setBalloons(prev => [...prev, newBalloon]);

    // Animate balloon floating up
    newBalloon.y.value = withTiming(-BALLOON_SIZE, { duration: 4000 - (level * 200) }, (finished) => {
      if (finished) {
        runOnJS(removeBalloon)(newBalloon.id);
        if (newBalloon.isCorrect) {
          runOnJS(loseLife)();
        }
      }
    });
  };

  const removeBalloon = (id) => {
    setBalloons(prev => prev.filter(balloon => balloon.id !== id));
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

  const popBalloon = (balloon) => {
    // Animate balloon pop
    balloon.scale.value = withTiming(0, { duration: 200 });
    
    setTimeout(() => {
      if (balloon.isCorrect) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore % 50 === 0) {
            setLevel(prevLevel => prevLevel + 1);
            setTargetShape(shapes[Math.floor(Math.random() * shapes.length)]);
          }
          return newScore;
        });
      } else {
        loseLife();
      }
      removeBalloon(balloon.id);
    }, 200);
  };

  const restartGame = () => {
    setTargetShape(shapes[0]);
    setBalloons([]);
    setScore(0);
    setLives(3);
    setGameOver(false);
    setLevel(1);
  };

  const targetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: targetScale.value }],
  }));

  if (gameOver) {
    return (
      <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.gameOverContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
              style={styles.gameOverCard}
            >
              <Text style={styles.gameOverEmoji}>🎈</Text>
              <Text style={styles.gameOverTitle}>Game Over!</Text>
              <Text style={styles.gameOverText}>
                You popped {Math.floor(score / 10)} correct balloons!
              </Text>
              <Text style={styles.finalScore}>Final Score: {score}</Text>
              <Text style={styles.levelText}>Level Reached: {level}</Text>
              
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
            <Text style={styles.title}>🎈 Shape Pop</Text>
            <Text style={styles.subtitle}>Pop the correct shapes!</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.levelText}>Level: {level}</Text>
            <Text style={styles.livesText}>Lives: {'❤️'.repeat(lives)}</Text>
          </View>
        </View>

        {/* Target Shape */}
        <View style={styles.targetContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
            style={styles.targetCard}
          >
            <Text style={styles.targetLabel}>Pop this shape:</Text>
            <Animated.View style={[styles.targetShape, targetAnimatedStyle]}>
              <LinearGradient colors={targetShape.color} style={styles.targetShapeGradient}>
                <Text style={styles.targetEmoji}>{targetShape.emoji}</Text>
              </LinearGradient>
            </Animated.View>
            <Text style={styles.targetName}>{targetShape.name.toUpperCase()}</Text>
          </LinearGradient>
        </View>

        {/* Game Area */}
        <View style={styles.gameArea}>
          {balloons.map((balloon) => (
            <Balloon key={balloon.id} balloon={balloon} onPop={popBalloon} />
          ))}
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.8)', 'rgba(255, 255, 255, 0.6)']}
            style={styles.instructionsCard}
          >
            <Text style={styles.instructionsText}>
              🎯 Tap balloons with the target shape to score points!
            </Text>
            <Text style={styles.instructionsText}>
              ❌ Avoid wrong shapes or you'll lose a life!
            </Text>
          </LinearGradient>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const Balloon = ({ balloon, onPop }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: balloon.x },
      { translateY: balloon.y.value },
      { scale: balloon.scale.value }
    ],
  }));

  return (
    <Animated.View style={[styles.balloon, animatedStyle]}>
      <Pressable onPress={() => onPop(balloon)}>
        <LinearGradient colors={balloon.shape.color} style={styles.balloonGradient}>
          <Text style={styles.balloonEmoji}>{balloon.shape.emoji}</Text>
          <View style={styles.balloonString} />
        </LinearGradient>
      </Pressable>
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
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
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
  levelText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#5D6D7E',
  },
  livesText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#E74C3C',
  },
  targetContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  targetCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(52, 152, 219, 0.3)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  targetLabel: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  targetShape: {
    marginBottom: 10,
  },
  targetShapeGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  targetEmoji: {
    fontSize: 32,
  },
  targetName: {
    fontSize: 16,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
  },
  gameArea: {
    flex: 1,
    position: 'relative',
  },
  balloon: {
    position: 'absolute',
    width: BALLOON_SIZE,
    height: BALLOON_SIZE + 20,
    zIndex: 10,
  },
  balloonGradient: {
    width: BALLOON_SIZE,
    height: BALLOON_SIZE,
    borderRadius: BALLOON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  balloonEmoji: {
    fontSize: 40,
  },
  balloonString: {
    position: 'absolute',
    bottom: -20,
    left: '50%',
    marginLeft: -1,
    width: 2,
    height: 20,
    backgroundColor: '#8B4513',
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  instructionsCard: {
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  instructionsText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'center',
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
    marginBottom: 10,
  },
  gameOverButtons: {
    width: '100%',
    gap: 15,
    marginTop: 20,
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