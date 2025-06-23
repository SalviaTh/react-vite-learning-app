import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Volume2, CircleCheck as CheckCircle, RotateCcw } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withSequence,
  withTiming
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function KnowingNumbersGame() {
  const [currentNumber, setCurrentNumber] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [score, setScore] = useState(0);

  const numberScale = useSharedValue(1);
  const celebrationScale = useSharedValue(0);

  useEffect(() => {
    // Animate number appearance
    numberScale.value = withSequence(
      withTiming(0, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 100 })
    );
  }, [currentNumber]);

  const numberAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: numberScale.value }],
  }));

  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
    opacity: celebrationScale.value,
  }));

  const speakNumber = () => {
    // In a real app, you would use text-to-speech here
    // For now, we'll simulate it
    setIsListening(true);
    
    // Simulate speech recognition
    setTimeout(() => {
      setIsListening(false);
      setHasSpoken(true);
      
      // Show celebration animation
      celebrationScale.value = withSequence(
        withSpring(1, { damping: 15, stiffness: 100 }),
        withTiming(0, { duration: 1000 })
      );
      
      setScore(score + 10);
    }, 2000);
  };

  const nextNumber = () => {
    if (currentNumber < numbers.length - 1) {
      setCurrentNumber(currentNumber + 1);
      setHasSpoken(false);
    } else {
      setGameComplete(true);
    }
  };

  const restartGame = () => {
    setCurrentNumber(0);
    setHasSpoken(false);
    setGameComplete(false);
    setScore(0);
  };

  const handleBackPress = () => {
    router.back();
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
              <Text style={styles.completionTitle}>Congratulations!</Text>
              <Text style={styles.completionText}>
                You've learned all the numbers from 1 to 10!
              </Text>
              <Text style={styles.scoreText}>Score: {score} points</Text>
              
              <View style={styles.completionButtons}>
                <Pressable style={styles.restartButton} onPress={restartGame}>
                  <LinearGradient colors={['#A8EDEA', '#FED6E3']} style={styles.buttonGradient}>
                    <RotateCcw size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Play Again</Text>
                  </LinearGradient>
                </Pressable>
                
                <Pressable style={styles.backButton} onPress={handleBackPress}>
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
          <Pressable style={styles.headerBackButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color="#2C3E50" />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.title}>🔢 Knowing Numbers</Text>
            <Text style={styles.subtitle}>Say the number out loud!</Text>
          </View>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>Score</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentNumber + 1) / numbers.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentNumber + 1} of {numbers.length}
          </Text>
        </View>

        {/* Main Game Area */}
        <View style={styles.gameArea}>
          <Text style={styles.instruction}>
            Look at this number and say it out loud:
          </Text>
          
          <Animated.View style={[styles.numberContainer, numberAnimatedStyle]}>
            <LinearGradient
              colors={['#FF9A9E', '#FECFEF']}
              style={styles.numberCard}
            >
              <Text style={styles.numberText}>{numbers[currentNumber]}</Text>
            </LinearGradient>
          </Animated.View>

          <Text style={styles.numberWord}>
            "{getNumberWord(numbers[currentNumber])}"
          </Text>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {!hasSpoken ? (
              <Pressable 
                style={[styles.speakButton, isListening && styles.listeningButton]} 
                onPress={speakNumber}
                disabled={isListening}
              >
                <LinearGradient 
                  colors={isListening ? ['#E74C3C', '#C0392B'] : ['#2ECC71', '#27AE60']} 
                  style={styles.speakButtonGradient}
                >
                  <Volume2 size={24} color="#FFFFFF" />
                  <Text style={styles.speakButtonText}>
                    {isListening ? 'Listening...' : 'Tap & Speak'}
                  </Text>
                </LinearGradient>
              </Pressable>
            ) : (
              <Pressable style={styles.nextButton} onPress={nextNumber}>
                <LinearGradient colors={['#3498DB', '#2980B9']} style={styles.nextButtonGradient}>
                  <CheckCircle size={24} color="#FFFFFF" />
                  <Text style={styles.nextButtonText}>
                    {currentNumber < numbers.length - 1 ? 'Next Number' : 'Finish'}
                  </Text>
                </LinearGradient>
              </Pressable>
            )}
          </View>

          {/* Celebration Animation */}
          <Animated.View style={[styles.celebration, celebrationAnimatedStyle]}>
            <Text style={styles.celebrationText}>Great job! 🌟</Text>
          </Animated.View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function getNumberWord(num) {
  const words = {
    1: 'One', 2: 'Two', 3: 'Three', 4: 'Four', 5: 'Five',
    6: 'Six', 7: 'Seven', 8: 'Eight', 9: 'Nine', 10: 'Ten'
  };
  return words[num] || '';
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
  scoreContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#5D6D7E',
  },
  scoreValue: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#E74C3C',
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
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ECC71',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#5D6D7E',
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  instruction: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 30,
  },
  numberContainer: {
    marginBottom: 20,
  },
  numberCard: {
    width: 150,
    height: 150,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  numberText: {
    fontSize: 80,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  numberWord: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
    marginBottom: 40,
  },
  actionButtons: {
    width: '100%',
    alignItems: 'center',
  },
  speakButton: {
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  listeningButton: {
    opacity: 0.8,
  },
  speakButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 10,
  },
  speakButtonText: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
  },
  nextButton: {
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    gap: 10,
  },
  nextButtonText: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
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
  scoreText: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#E74C3C',
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