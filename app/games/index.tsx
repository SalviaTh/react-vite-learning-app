import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

const games = [
  {
    id: 1,
    title: 'Knowing the Numbers',
    description: 'Learn what numbers are and practice saying them!',
    emoji: '🔢',
    difficulty: 'Beginner',
    color: ['#FF9A9E', '#FECFEF'],
    route: '/games/knowing-numbers'
  },
  {
    id: 2,
    title: 'Number Adventure',
    description: 'Find and select the right numbers from the screen!',
    emoji: '🎯',
    difficulty: 'Beginner',
    color: ['#A8EDEA', '#FED6E3'],
    route: '/games/number-adventure'
  },
  {
    id: 3,
    title: 'Addition',
    description: 'Learn basic addition with fun exercises!',
    emoji: '➕',
    difficulty: 'Easy',
    color: ['#87CEEB', '#B0E0E6'],
    route: '/games/addition'
  },
  {
    id: 4,
    title: 'Addition Master',
    description: 'Challenge yourself with bigger addition problems!',
    emoji: '🧮',
    difficulty: 'Medium',
    color: ['#DDA0DD', '#E6E6FA'],
    route: '/games/addition-master'
  },
  {
    id: 5,
    title: 'Subtraction',
    description: 'Master the art of taking numbers away!',
    emoji: '➖',
    difficulty: 'Easy',
    color: ['#98FB98', '#90EE90'],
    route: '/games/subtraction'
  },
  {
    id: 6,
    title: 'Math Warrior',
    description: 'Complex addition and subtraction battles!',
    emoji: '⚔️',
    difficulty: 'Hard',
    color: ['#F0E68C', '#FFE4B5'],
    route: '/games/math-warrior'
  },
  {
    id: 7,
    title: 'Multiplication',
    description: 'Learn times tables in a fun way!',
    emoji: '✖️',
    difficulty: 'Medium',
    color: ['#FFB6C1', '#FFC0CB'],
    route: '/games/multiplication'
  },
  {
    id: 8,
    title: 'Division',
    description: 'Share and divide numbers equally!',
    emoji: '➗',
    difficulty: 'Medium',
    color: ['#F5DEB3', '#D2B48C'],
    route: '/games/division'
  }
];
type Game={
    id:number;
    title:string;
    description:string;
    emoji:string;
    difficulty:string;
    color:[string,string];
    route:`${string}`;
};
type GameCardProps={
    game:Game;
    index:number;
    onPress:(game:Game)=>void;
}
const GameCard = ({ game, index, onPress }:GameCardProps) => {
  const scale = useSharedValue(0);
  
  useEffect(() => {
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    }, index * 100);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getDifficultyColor = (difficulty:string) => {
    switch (difficulty) {
      case 'Beginner': return '#2ECC71';
      case 'Easy': return '#3498DB';
      case 'Medium': return '#F39C12';
      case 'Hard': return '#E74C3C';
      default: return '#95A5A6';
    }
  };

  return (
    <Animated.View style={[styles.gameCard, animatedStyle]}>
      <Pressable onPress={() => onPress(game)}>
        <LinearGradient colors={game.color as [string,string]} style={styles.gameGradient}>
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
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Star size={16} color="#FFD700" fill="#FFD700" />
            </View>
            <View style={styles.playButton}>
              <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
              <Text style={styles.playText}>PLAY</Text>
            </View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

export default function GamesScreen() {
  const handleGamePress = (game: Game) => {
    router.push(game.route as string);
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={handleBackPress}>
            <ArrowLeft size={24} color="#2C3E50" />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.title}>🎮 Fun Math Games</Text>
            <Text style={styles.subtitle}>Choose a game to start learning!</Text>
          </View>
        </View>

        {/* Games Grid */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.gamesGrid}>
            {games.map((game, index) => (
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
              <Text style={styles.motivationTitle}>Ready to Learn?</Text>
              <Text style={styles.motivationText}>
                Each game is designed to make learning math fun and easy. Start with the beginner games and work your way up!
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
    borderColor: 'rgba(255, 107, 107, 0.3)',
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