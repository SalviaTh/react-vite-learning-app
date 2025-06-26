import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, RotateCcw, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withSequence,
  withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const comparisonTypes = [
  {
    type: 'size',
    question: 'Which tree is BIGGER?',
    options: [
      { emoji: '🌳', size: 'big', correct: true },
      { emoji: '🌲', size: 'small', correct: false }
    ]
  },
  {
    type: 'height',
    question: 'Which building is TALLER?',
    options: [
      { emoji: '🏢', size: 'short', correct: false },
      { emoji: '🏗️', size: 'tall', correct: true }
    ]
  },
  {
    type: 'fullness',
    question: 'Which glass is FULL?',
    options: [
      { emoji: '🥛', size: 'full', correct: true },
      { emoji: '🥃', size: 'empty', correct: false }
    ]
  },
  {
    type: 'length',
    question: 'Which snake is LONGER?',
    options: [
      { emoji: '🐍', size: 'short', correct: false },
      { emoji: '🐍🐍', size: 'long', correct: true }
    ]
  },
  {
    type: 'weight',
    question: 'Which animal is HEAVIER?',
    options: [
      { emoji: '🐘', size: 'heavy', correct: true },
      { emoji: '🐭', size: 'light', correct: false }
    ]
  }
];

export default function ComparisonGame() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const questionScale = useSharedValue(1);
  const celebrationScale = useSharedValue(0);
  const option1Scale = useSharedValue(1);
  const option2Scale = useSharedValue(1);

  useEffect(() => {
    // Animate question appearance
    questionScale.value = withSequence(
      withTiming(0, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 100 })
    );
  }, [currentQuestion]);

  const questionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: questionScale.value }],
  }));

  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
    opacity: celebrationScale.value,
  }));

  const option1AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: option1Scale.value }],
  }));

  const option2AnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: option2Scale.value }],
  }));

  const handleAnswer = (optionIndex) => {
    if (showResult) return;

    setSelectedAnswer(optionIndex);
    setShowResult(true);

    const isCorrect = comparisonTypes[currentQuestion].options[optionIndex].correct;
    
    // Animate selected option
    if (optionIndex === 0) {
      option1Scale.value = withSequence(
        withSpring(1.2, { damping: 15, stiffness: 100 }),
        withSpring(1, { damping: 15, stiffness: 100 })
      );
    } else {
      option2Scale.value = withSequence(
        withSpring(1.2, { damping: 15, stiffness: 100 }),
        withSpring(1, { damping: 15, stiffness: 100 })
      );
    }

    if (isCorrect) {
      setScore(prev => prev + 10);
      
      // Show celebration animation
      celebrationScale.value = withSequence(
        withSpring(1, { damping: 15, stiffness: 100 }),
        withTiming(0, { duration: 1500 })
      );
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion < comparisonTypes.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        setGameComplete(true);
      }
    }, 2000);
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setScore(0);
    setGameComplete(false);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const getStarCount = () => {
    const percentage = (score / (comparisonTypes.length * 10)) * 100;
    if (percentage >= 80) return 3;
    if (percentage >= 60) return 2;
    if (percentage >= 40) return 1;
    return 0;
  };

  if (gameComplete) {
    return (
      <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.completionContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
              style={styles.completionCard}
            >
              <Text style={styles.completionEmoji}>🎉</Text>
              <Text style={styles.completionTitle}>Great Job!</Text>
              <Text style={styles.completionText}>
                You completed all the comparison challenges!
              </Text>
              <Text style={styles.scoreText}>Score: {score}/{comparisonTypes.length * 10}</Text>
              
              <View style={styles.starsContainer}>
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    size={32}
                    color="#FFD700"
                    fill={star <= getStarCount() ? '#FFD700' : 'transparent'}
                  />
                ))}
              </View>
              
              <View style={styles.completionButtons}>
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

  const current = comparisonTypes[currentQuestion];

  return (
    <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerBackButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#2C3E50" />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.title}>📏 Comparison Game</Text>
            <Text style={styles.subtitle}>Choose the correct answer!</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.progressText}>
              {currentQuestion + 1}/{comparisonTypes.length}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentQuestion + 1) / comparisonTypes.length) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Question */}
        <Animated.View style={[styles.questionContainer, questionAnimatedStyle]}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
            style={styles.questionCard}
          >
            <Text style={styles.questionText}>{current.question}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          <Animated.View style={[styles.optionCard, option1AnimatedStyle]}>
            <Pressable 
              style={[
                styles.option,
                selectedAnswer === 0 && (current.options[0].correct ? styles.correctOption : styles.wrongOption)
              ]}
              onPress={() => handleAnswer(0)}
              disabled={showResult}
            >
              <LinearGradient
                colors={
                  selectedAnswer === 0 
                    ? (current.options[0].correct ? ['#2ECC71', '#27AE60'] : ['#E74C3C', '#C0392B'])
                    : ['#3498DB', '#2980B9']
                }
                style={styles.optionGradient}
              >
                <Text style={styles.optionEmoji}>{current.options[0].emoji}</Text>
                <Text style={styles.optionLabel}>Option A</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Text style={styles.vsText}>VS</Text>

          <Animated.View style={[styles.optionCard, option2AnimatedStyle]}>
            <Pressable 
              style={[
                styles.option,
                selectedAnswer === 1 && (current.options[1].correct ? styles.correctOption : styles.wrongOption)
              ]}
              onPress={() => handleAnswer(1)}
              disabled={showResult}
            >
              <LinearGradient
                colors={
                  selectedAnswer === 1 
                    ? (current.options[1].correct ? ['#2ECC71', '#27AE60'] : ['#E74C3C', '#C0392B'])
                    : ['#9B59B6', '#8E44AD']
                }
                style={styles.optionGradient}
              >
                <Text style={styles.optionEmoji}>{current.options[1].emoji}</Text>
                <Text style={styles.optionLabel}>Option B</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>

        {/* Result Message */}
        {showResult && (
          <View style={styles.resultContainer}>
            <LinearGradient
              colors={
                current.options[selectedAnswer].correct 
                  ? ['rgba(46, 204, 113, 0.9)', 'rgba(39, 174, 96, 0.9)']
                  : ['rgba(231, 76, 60, 0.9)', 'rgba(192, 57, 43, 0.9)']
              }
              style={styles.resultCard}
            >
              <Text style={styles.resultText}>
                {current.options[selectedAnswer].correct ? '🎉 Correct!' : '❌ Try Again!'}
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Celebration Animation */}
        <Animated.View style={[styles.celebration, celebrationAnimatedStyle]}>
          <Text style={styles.celebrationText}>Excellent! +10 🌟</Text>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

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
  progressText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#5D6D7E',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ECC71',
    borderRadius: 4,
  },
  questionContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  questionCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(52, 152, 219, 0.3)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  questionText: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  optionCard: {
    flex: 1,
    maxWidth: 120,
  },
  option: {
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  correctOption: {
    elevation: 12,
  },
  wrongOption: {
    elevation: 12,
  },
  optionGradient: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    minHeight: 120,
    justifyContent: 'center',
  },
  optionEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  vsText: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginHorizontal: 20,
  },
  resultContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  resultCard: {
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  celebration: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  celebrationText: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
  },
  completionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  completionCard: {
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
  completionEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  completionTitle: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  completionText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  completionButtons: {
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