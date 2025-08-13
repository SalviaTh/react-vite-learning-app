import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

const easyGames = [
  {
    id: 1,
    title: 'Finding the Fury Cat',
    description: 'Lets Go and find the Fury Little Cat!',
    emoji: '🐱',
    difficulty: 'Easy',
    color: ['#FF9A9E', '#FECFEF'],
    route: '/chapters/standard_1/furry_cat',
    completed: false,
    stars: 0
  },
  {
    id: 2,
    title: 'Number Catcher',
    description: 'Catch the correct number in the basket!',
    emoji: '🧺',
    difficulty: 'EAsy',
    color: ['#A8EDEA', '#FED6E3'],
    route: '/games/number-catcher',
    completed: false,
    stars: 0
  },
  {
    id: 3,
    title: 'Number Match Maze',
    description: 'Match numbers to quantities to escape the maze!',
    emoji: '🧩',
    difficulty: 'Easy',
    color: ['#87CEEB', '#B0E0E6'],
    route: '/games/number-match-maze',
    completed: false,
    stars: 0
  },
  {
    id: 4,
    title: 'Comparison',
    description: 'Learn big/small, tall/short, empty/full concepts!',
    emoji: '📏',
    difficulty: 'Easy',
    color: ['#DDA0DD', '#E6E6FA'],
    route: '/games/comparison',
    completed: false,
    stars: 0
  },
  {
    id: 5,
    title: 'Shape Pop',
    description: 'Pop balloons with the same shape as specified!',
    emoji: '🎈',
    difficulty: 'Easy',
    color: ['#98FB98', '#90EE90'],
    route: '/games/shape-pop',
    completed: false,
    stars: 0
  },
  {
    id: 6,
    title: 'Addition',
    description: 'Simple addition of two numbers without carry!',
    emoji: '➕',
    difficulty: 'Easy',
    color: ['#F0E68C', '#FFE4B5'],
    route: '/games/addition',
    completed: false,
    stars: 0
  },
  {
    id: 7,
    title: 'Subtraction',
    description: 'Simple subtraction without borrowing!',
    emoji: '➖',
    difficulty: 'Easy',
    color: ['#FFB6C1', '#FFC0CB'],
    route: '/games/subtraction',
    completed: false,
    stars: 0
  }
];

const GameCard = ({ game, index, onPress }) => {
  const scale = useSharedValue(0);
  
  useEffect(() => {
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    }, index * 100);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#2ECC71';
      case 'Easy': return '#3498DB';
      default: return '#95A5A6';
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          color={i < game.stars ? '#FFD700' : 'rgba(255, 255, 255, 0.3)'}
          fill={i < game.stars ? '#FFD700' : 'transparent'}
        />
      );
    }
    return stars;
  };

  return (
    <Animated.View style={[styles.gameCard, animatedStyle]}>
      <Pressable onPress={() => onPress(game)}>
        <LinearGradient colors={game.color} style={styles.gameGradient}>
          <View style={styles.gameHeader}>
            <Text style={styles.gameEmoji}>{game.emoji}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(game.difficulty) }]}>
              <Text style={styles.difficultyText}>{game.difficulty}</Text>
            </View>
          </View>
          
          <Text style={styles.gameTitle}>{game.title}</Text>
          <Text style={styles.gameDescription}>{game.description}</Text>
          
          <View style={styles.gameFooter}>
            <View style={styles.starsContainer}>
              {renderStars()}
            </View>
            <View style={styles.playButton}>
              <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.playText}>Let'sGo</Text>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

export default function EasyChapterScreen() {
  const handleGamePress = (game) => {
    router.push(game.route);
  };

  const handleBackPress = () => {
    router.back();
  };

  const completedGames = easyGames.filter(game => game.completed).length;
  const totalStars = easyGames.reduce((sum, game) => sum + game.stars, 0);

  return (
    <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color="#2C3E50" />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Standard 1</Text>
          </View>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressSection}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
            style={styles.progressCard}
          >
            <Text style={styles.progressTitle}>🎯 Chapter Progress</Text>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>{completedGames}</Text>
                <Text style={styles.progressLabel}>Completed</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>{easyGames.length}</Text>
                <Text style={styles.progressLabel}>Total Games</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>{totalStars}</Text>
                <Text style={styles.progressLabel}>Stars Earned</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(completedGames / easyGames.length) * 100}%` }
                ]} 
              />
            </View>
          </LinearGradient>
        </View>

        {/* Games Grid */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.gamesGrid}>
            {easyGames.map((game, index) => (
              <GameCard
                key={game.id}
                game={game}
                index={index}
                onPress={handleGamePress}
              />
            ))}
          </View>

          {/* Motivational Message */}
          <View style={styles.motivationSection}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
              style={styles.motivationCard}
            >
              <Text style={styles.motivationEmoji}>🌟</Text>
              <Text style={styles.motivationTitle}>Great Start!</Text>
              <Text style={styles.motivationText}>
                These games will help you build a strong foundation in math. Take your time and have fun learning!
              </Text>
            </LinearGradient>
          </View>
        </ScrollView>
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
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
  },
  progressSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(46, 204, 113, 0.3)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  progressTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka-SemiBold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  progressStat: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#2ECC71',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#5D6D7E',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(46, 204, 113, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2ECC71',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gamesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  gameCard: {
    width: (width - 50) / 2,
    marginBottom: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  gameGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    minHeight: 200,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  gameEmoji: {
    fontSize: 36,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 10,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  gameTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gameDescription: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
    lineHeight: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  playText: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
  },
  motivationSection: {
    marginVertical: 20,
  },
  motivationCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(46, 204, 113, 0.3)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  motivationEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  motivationTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  motivationText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
    textAlign: 'center',
    lineHeight: 20,
  },
});