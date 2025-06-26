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

const generateProblem = (level) => {
  const maxNum = Math.min(5 + level, 10);
  const num1 = Math.floor(Math.random() * maxNum) + 2; // Start from 2 to avoid negative results
  const num2 = Math.floor(Math.random() * (num1 - 1)) + 1; // Ensure num2 < num1
  const correctAnswer = num1 - num2;
  
  // Generate wrong answers
  const wrongAnswers = [];
  while (wrongAnswers.length < 3) {
    const wrong = correctAnswer + Math.floor(Math.random() * 6) - 3;
    if (wrong !== correctAnswer && wrong >= 0 && !wrongAnswers.includes(wrong)) {
      wrongAnswers.push(wrong);
    }
  }
  
  // Mix correct answer with wrong answers
  const allAnswers = [correctAnswer, ...wrongAnswers];
  const shuffled = allAnswers.sort(() => Math.random() - 0.5);
  
  return {
    num1,
    num2,
    correctAnswer,
    options: shuffled
  };
};

export default function SubtractionGame() {
  const [currentProblem, setCurrentProblem] = useState(generateProblem(1));
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  const problemScale = useSharedValue(1);
  const celebrationScale = useSharedValue(0);
  const optionScales = [
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1),
    useSharedValue(1)
  ];

  useEffect(() => {
    // Animate problem appearance
    problemScale.value = withSequence(
      withTiming(0, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 100 })
    );
  }, [currentProblem]);

  const problemAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: problemScale.value }],
  }));

  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
    opacity: celebrationScale.value,
  }));

  const handleAnswer = (answer, optionIndex) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    // Animate selected option
    optionScales[optionIndex].value = withSequence(
      withSpring(1.2, { damping: 15, stiffness: 100 }),
      withSpring(1, { damping: 15, stiffness: 100 })
    );

    const isCorrect = answer === currentProblem.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 10);
      
      // Show celebration animation
      celebrationScale.value = withSequence(
        withSpring(1, { damping: 15, stiffness: 100 }),
        withTiming(0, { duration: 1500 })
      );
    }

    setQuestionsAnswered(prev => prev + 1);

    // Move to next question after delay
    setTimeout(() => {
      if (questionsAnswered + 1 >= 10) {
        setGameComplete(true);
      } else {
        // Level up every 3 correct answers
        if (isCorrect && (score + 10) % 30 === 0) {
          setLevel(prev => prev + 1);
        }
        
        setCurrentProblem(generateProblem(level));
        setSelectedAnswer(null);
        setShowResult(false);
      }
    }, 2000);
  };

  const restartGame = () => {
    setCurrentProblem(generateProblem(1));
    setScore(0);
    setLevel(1);
    setQuestionsAnswered(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameComplete(false);
  };

  const getStarCount = () => {
    const percentage = (score / 100) * 100;
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
              <Text style={styles.completionTitle}>Subtraction Master!</Text>
              <Text style={styles.completionText}>
                You completed 10 subtraction problems!
              </Text>
              <Text style={styles.scoreText}>Score: {score}/100</Text>
              <Text style={styles.levelText}>Level Reached: {level}</Text>
              
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

  return (
    <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerBackButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#2C3E50" />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.title}>➖ Subtraction Game</Text>
            <Text style={styles.subtitle}>Take away and solve!</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.levelText}>Level: {level}</Text>
            <Text style={styles.progressText}>
              {questionsAnswered}/10
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${(questionsAnswered / 10) * 100}%` }
              ]} 
            />
          </View>
        </View>

        {/* Problem */}
        <Animated.View style={[styles.problemContainer, problemAnimatedStyle]}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
            style={styles.problemCard}
          >
            <View style={styles.problemRow}>
              <View style={styles.numberContainer}>
                <Text style={styles.numberText}>{currentProblem.num1}</Text>
                <View style={styles.dotsContainer}>
                  {Array.from({ length: currentProblem.num1 }, (_, i) => (
                    <Text 
                      key={i} 
                      style={[
                        styles.dot, 
                        i >= currentProblem.correctAnswer ? styles.crossedDot : {}
                      ]}
                    >
                      {i >= currentProblem.correctAnswer ? '✗' : '●'}
                    </Text>
                  ))}
                </View>
              </View>
              
              <Text style={styles.operatorText}>-</Text>
              
              <View style={styles.numberContainer}>
                <Text style={styles.numberText}>{currentProblem.num2}</Text>
                <View style={styles.dotsContainer}>
                  {Array.from({ length: currentProblem.num2 }, (_, i) => (
                    <Text key={i} style={styles.removedDot}>✗</Text>
                  ))}
                </View>
              </View>
              
              <Text style={styles.equalsText}>=</Text>
              <Text style={styles.questionText}>?</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Answer Options */}
        <View style={styles.optionsContainer}>
          {currentProblem.options.map((option, index) => {
            const optionAnimatedStyle = useAnimatedStyle(() => ({
              transform: [{ scale: optionScales[index].value }],
            }));

            return (
              <Animated.View key={index} style={[styles.optionCard, optionAnimatedStyle]}>
                <Pressable 
                  style={[
                    styles.option,
                    selectedAnswer === option && (
                      option === currentProblem.correctAnswer 
                        ? styles.correctOption 
                        : styles.wrongOption
                    )
                  ]}
                  onPress={() => handleAnswer(option, index)}
                  disabled={showResult}
                >
                  <LinearGradient
                    colors={
                      selectedAnswer === option 
                        ? (option === currentProblem.correctAnswer 
                            ? ['#2ECC71', '#27AE60'] 
                            : ['#E74C3C', '#C0392B'])
                        : ['#E74C3C', '#C0392B']
                    }
                    style={styles.optionGradient}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>

        {/* Result Message */}
        {showResult && (
          <View style={styles.resultContainer}>
            <LinearGradient
              colors={
                selectedAnswer === currentProblem.correctAnswer 
                  ? ['rgba(46, 204, 113, 0.9)', 'rgba(39, 174, 96, 0.9)']
                  : ['rgba(231, 76, 60, 0.9)', 'rgba(192, 57, 43, 0.9)']
              }
              style={styles.resultCard}
            >
              <Text style={styles.resultText}>
                {selectedAnswer === currentProblem.correctAnswer 
                  ? '🎉 Correct!' 
                  : `❌ Wrong! The answer is ${currentProblem.correctAnswer}`}
              </Text>
            </LinearGradient>
          </View>
        )}

        {/* Celebration Animation */}
        <Animated.View style={[styles.celebration, celebrationAnimatedStyle]}>
          <Text style={styles.celebrationText}>Great job! +10 🌟</Text>
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
  levelText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#5D6D7E',
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
    backgroundColor: '#E74C3C',
    borderRadius: 4,
  },
  problemContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  problemCard: {
    borderRadius: 16,
    padding: 25,
    borderWidth: 2,
    borderColor: 'rgba(231, 76, 60, 0.3)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  problemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  numberContainer: {
    alignItems: 'center',
    marginHorizontal: 10,
  },
  numberText: {
    fontSize: 36,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: 60,
  },
  dot: {
    fontSize: 16,
    color: '#3498DB',
    marginHorizontal: 2,
  },
  crossedDot: {
    color: '#95A5A6',
  },
  removedDot: {
    fontSize: 16,
    color: '#E74C3C',
    marginHorizontal: 2,
  },
  operatorText: {
    fontSize: 32,
    fontFamily: 'Fredoka-Bold',
    color: '#E74C3C',
    marginHorizontal: 15,
  },
  equalsText: {
    fontSize: 32,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginHorizontal: 15,
  },
  questionText: {
    fontSize: 36,
    fontFamily: 'Fredoka-Bold',
    color: '#F39C12',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  optionCard: {
    width: (width - 60) / 2,
    marginBottom: 15,
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
    minHeight: 80,
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
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
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
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