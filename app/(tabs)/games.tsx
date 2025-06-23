import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Gamepad2, Zap, Target, Trophy, Clock, Star } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

const gameCategories = [
  {
    id: 1,
    title: 'Quick Math',
    subtitle: 'Speed challenges',
    emoji: '⚡',
    color: ['#FF9A9E', '#FECFEF'],
    icon: Zap,
    games: ['Number Race', 'Math Sprint', 'Speed Quiz']
  },
  {
    id: 2,
    title: 'Accuracy Games',
    subtitle: 'Precision practice',
    emoji: '🎯',
    color: ['#A8EDEA', '#FED6E3'],
    icon: Target,
    games: ['Bulls Eye', 'Perfect Shot', 'Precision Math']
  },
  {
    id: 3,
    title: 'Puzzle Masters',
    subtitle: 'Brain teasers',
    emoji: '🧩',
    color: ['#87CEEB', '#B0E0E6'],
    icon: Gamepad2,
    games: ['Math Puzzle', 'Number Mystery', 'Logic Quest']
  },
  {
    id: 4,
    title: 'Time Trials',
    subtitle: 'Beat the clock',
    emoji: '⏱️',
    color: ['#DDA0DD', '#E6E6FA'],
    icon: Clock,
    games: ['Time Attack', 'Rush Hour', 'Clock Master']
  }
];

const featuredGames = [
  {
    id: 1,
    title: 'Number Adventure',
    description: 'Explore the magical world of numbers!',
    emoji: '🌟',
    difficulty: 'Easy',
    players: '1.2K',
    color: ['#FFB6C1', '#FFC0CB']
  },
  {
    id: 2,
    title: 'Math Warrior',
    description: 'Battle monsters with math power!',
    emoji: '⚔️',
    difficulty: 'Medium',
    players: '856',
    color: ['#98FB98', '#90EE90']
  }
];

type GameCategoryCardProps = {
  category: typeof gameCategories[0];
  index: number;
  onPress: (category: typeof gameCategories[0]) => void;
};

const GameCategoryCard = ({ category, index, onPress }: GameCategoryCardProps) => {
  const scale = useSharedValue(0);
  
  useEffect(() => {
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    }, index * 150);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const IconComponent = category.icon;

  return (
    <Animated.View style={[styles.categoryCard, animatedStyle]}>
      <Pressable onPress={() => onPress(category)}>
        <LinearGradient colors={category.color as [string, string]} style={styles.categoryGradient}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <IconComponent size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categorySubtitle}>{category.subtitle}</Text>
          <View style={styles.gamesCount}>
            <Text style={styles.gamesCountText}>{category.games.length} Games</Text>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
};

type FeaturedGameCardProps = {
  game: typeof featuredGames[0];
  onPress: (game: typeof featuredGames[0]) => void;
};

const FeaturedGameCard = ({ game, onPress }: FeaturedGameCardProps) => (
  <Pressable style={styles.featuredCard} onPress={() => onPress(game)}>
    <LinearGradient colors={game.color as [string, string]} style={styles.featuredGradient}>
      <View style={styles.featuredHeader}>
        <Text style={styles.featuredEmoji}>{game.emoji}</Text>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{game.difficulty}</Text>
        </View>
      </View>
      <Text style={styles.featuredTitle}>{game.title}</Text>
      <Text style={styles.featuredDescription}>{game.description}</Text>
      <View style={styles.featuredFooter}>
        <View style={styles.playersInfo}>
          <Text style={styles.playersText}>👥 {game.players} playing</Text>
        </View>
        <Text style={styles.playButton}>PLAY →</Text>
      </View>
    </LinearGradient>
  </Pressable>
);

type GamesScreenProps = {
  category: typeof gameCategories[0];
  onPress: (category: typeof gameCategories[0]) => void;
};

export default function GamesScreen({ category, onPress }: GamesScreenProps) {
  const handleCategoryPress = (category: typeof gameCategories[0]) => {
    console.log('Selected category:', category.title);
    // Navigate to category games
  };
  
  const handleGamePress = (game: typeof featuredGames[0]) => {
    console.log('Selected game:', game.title);
    // Navigate to game
  };

  return (
    <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🎮 Math Games</Text>
            <Text style={styles.subtitle}>Learn while having fun!</Text>
          </View>

          {/* Featured Games */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Featured Games</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {featuredGames.map((game) => (
                <FeaturedGameCard
                  key={game.id}
                  game={game}
                  onPress={handleGamePress}
                />
              ))}
            </ScrollView>
          </View>

          {/* Daily Challenge */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 Daily Challenge</Text>
            <View style={styles.challengeCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                style={styles.challengeGradient}
              >
                <View style={styles.challengeContent}>
                  <Text style={styles.challengeEmoji}>🏆</Text>
                  <View style={styles.challengeText}>
                    <Text style={styles.challengeTitle}>Multiplication Madness</Text>
                    <Text style={styles.challengeDescription}>
                      Complete 20 multiplication problems in 60 seconds!
                    </Text>
                  </View>
                  <View style={styles.challengeReward}>
                    <Star size={16} color="#FFD700" fill="#FFD700" />
                    <Text style={styles.rewardText}>+50</Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Game Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Game Categories</Text>
            <View style={styles.categoriesGrid}>
              {gameCategories.map((category, index) => (
                <GameCategoryCard
                  key={category.id}
                  category={category}
                  index={index}
                  onPress={handleCategoryPress}
                />
              ))}
            </View>
          </View>

          {/* Leaderboard Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏅 Top Players This Week</Text>
            <View style={styles.leaderboardCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                style={styles.leaderboardGradient}
              >
                <View style={styles.leaderboardItem}>
                  <Text style={styles.rank}>🥇</Text>
                  <Text style={styles.playerName}>MathWiz2024</Text>
                  <Text style={styles.playerScore}>2,450 pts</Text>
                </View>
                <View style={styles.leaderboardItem}>
                  <Text style={styles.rank}>🥈</Text>
                  <Text style={styles.playerName}>NumberNinja</Text>
                  <Text style={styles.playerScore}>2,180 pts</Text>
                </View>
                <View style={styles.leaderboardItem}>
                  <Text style={styles.rank}>🥉</Text>
                  <Text style={styles.playerName}>CalcKing</Text>
                  <Text style={styles.playerScore}>1,920 pts</Text>
                </View>
                <Pressable style={styles.viewMoreButton}>
                  <Text style={styles.viewMoreText}>View Full Leaderboard →</Text>
                </Pressable>
              </LinearGradient>
            </View>
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  featuredCard: {
    width: width * 0.75,
    marginRight: 16,
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  featuredGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  featuredEmoji: {
    fontSize: 32,
  },
  difficultyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
  },
  featuredTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  featuredDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playersText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  playButton: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  challengeCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  challengeGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  challengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  challengeText: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
  },
  challengeReward: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#F39C12',
    marginLeft: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  categoryGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  categorySubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  gamesCount: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  gamesCountText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
  },
  leaderboardCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  leaderboardGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rank: {
    fontSize: 20,
    marginRight: 12,
  },
  playerName: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
  },
  playerScore: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#E74C3C',
  },
  viewMoreButton: {
    alignItems: 'center',
    marginTop: 8,
  },
  viewMoreText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#5D6D7E',
  },
});