import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Award, Settings, Star, Trophy, Target, Clock, Book, RotateCcw } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

const achievements = [
  { id: 'first_steps', title: 'First Steps', description: 'Started your math journey', emoji: '👶' },
  { id: 'game_explorer', title: 'Game Explorer', description: 'Played 5 different games', emoji: '🎮' },
  { id: 'star_collector', title: 'Star Collector', description: 'Earned 15 stars', emoji: '⭐' },
  { id: 'streak_master', title: 'Streak Master', description: 'Played for 3 days in a row', emoji: '🔥' },
  { id: 'math_wizard', title: 'Math Wizard', description: 'Reached level 5', emoji: '🧙‍♂️' },
  { id: 'perfect_score', title: 'Perfect Score', description: 'Got 100% in any game', emoji: '💯' },
];

const StatCard = ({ stat, index }) => {
  const scale = useSharedValue(0);
  
  useEffect(() => {
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    }, index * 100);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const IconComponent = stat.icon;

  return (
    <Animated.View style={[styles.statCard, animatedStyle]}>
      <LinearGradient colors={stat.color} style={styles.statGradient}>
        <IconComponent size={28} color="#FFFFFF" />
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const AchievementCard = ({ achievement, isEarned }) => (
  <View style={[
    styles.achievementCard,
    !isEarned && styles.achievementLocked
  ]}>
    <LinearGradient
      colors={isEarned 
        ? ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']
        : ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.3)']
      }
      style={styles.achievementGradient}
    >
      <Text style={[
        styles.achievementEmoji,
        !isEarned && styles.lockedEmoji
      ]}>
        {isEarned ? achievement.emoji : '🔒'}
      </Text>
      <View style={styles.achievementText}>
        <Text style={[
          styles.achievementTitle,
          !isEarned && styles.lockedText
        ]}>
          {achievement.title}
        </Text>
        <Text style={[
          styles.achievementDescription,
          !isEarned && styles.lockedText
        ]}>
          {achievement.description}
        </Text>
      </View>
      {isEarned && (
        <View style={styles.earnedBadge}>
          <Text style={styles.earnedText}>✓</Text>
        </View>
      )}
    </LinearGradient>
  </View>
);

export default function ProfileScreen() {
  const { user, getUserStats, clearUserData } = useUser();

  if (!user) {
    return (
      <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.noUserContainer}>
            <Text style={styles.noUserText}>No user profile found</Text>
            <Pressable 
              style={styles.createButton}
              onPress={() => router.push('/onboarding')}
            >
              <LinearGradient colors={['#FF9A9E', '#FECFEF']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>Create Profile</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const stats = getUserStats();
  const earnedAchievements = user.achievements.length;
  const totalAchievements = achievements.length;

  const statsData = [
    { label: 'Games Played', value: stats.totalGamesPlayed.toString(), icon: Target, color: ['#FF9A9E', '#FECFEF'] },
    { label: 'Study Time', value: `${Math.floor(stats.totalTimeSpent / 60)}m`, icon: Clock, color: ['#A8EDEA', '#FED6E3'] },
    { label: 'Total Score', value: stats.totalScore.toString(), icon: Book, color: ['#87CEEB', '#B0E0E6'] },
    { label: 'Stars Earned', value: stats.totalStars.toString(), icon: Star, color: ['#DDA0DD', '#E6E6FA'] },
  ];

  const handleResetProfile = async () => {
    await clearUserData();
    router.replace('/onboarding');
  };

  return (
    <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#FF9A9E', '#FECFEF']}
                style={styles.avatar}
              >
                <Text style={styles.avatarEmoji}>{user.avatar}</Text>
              </LinearGradient>
            </View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.level}>Level {user.level} • Math Explorer</Text>
            <Text style={styles.experience}>{user.experience} XP</Text>
          </View>

          {/* Progress Overview */}
          <View style={styles.progressSection}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
              style={styles.progressCard}
            >
              <Text style={styles.progressTitle}>🏆 Your Journey</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${(user.experience % 100)}%` }]} />
              </View>
              <Text style={styles.progressText}>
                {100 - (user.experience % 100)} XP to next level
              </Text>
            </LinearGradient>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📊 Your Stats</Text>
            <View style={styles.statsGrid}>
              {statsData.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </View>
          </View>

          {/* Recent Games */}
          {user.gameScores.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>🎮 Recent Games</Text>
              <View style={styles.recentGames}>
                {user.gameScores.slice(-3).reverse().map((score, index) => (
                  <View key={`${score.gameId}-${index}`} style={styles.recentGameCard}>
                    <LinearGradient
                      colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                      style={styles.recentGameGradient}
                    >
                      <Text style={styles.recentGameName}>{score.gameName}</Text>
                      <View style={styles.recentGameStats}>
                        <Text style={styles.recentGameScore}>{score.score} pts</Text>
                        <View style={styles.recentGameStars}>
                          {[1, 2, 3].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              color="#FFD700"
                              fill={star <= score.stars ? '#FFD700' : 'transparent'}
                            />
                          ))}
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Achievements */}
          <View style={styles.achievementsSection}>
            <View style={styles.achievementsHeader}>
              <Text style={styles.sectionTitle}>🏅 Achievements</Text>
              <Text style={styles.achievementsCount}>
                {earnedAchievements}/{totalAchievements}
              </Text>
            </View>
            <View style={styles.achievementsList}>
              {achievements.map((achievement) => (
                <AchievementCard 
                  key={achievement.id} 
                  achievement={achievement} 
                  isEarned={user.achievements.includes(achievement.id)}
                />
              ))}
            </View>
          </View>

          {/* Settings */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>⚙️ Settings</Text>
            <View style={styles.settingsList}>
              <Pressable style={styles.settingItem}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                  style={styles.settingGradient}
                >
                  <Settings size={24} color="#5D6D7E" />
                  <Text style={styles.settingText}>Game Preferences</Text>
                  <Text style={styles.settingArrow}>→</Text>
                </LinearGradient>
              </Pressable>
              
              <Pressable style={styles.settingItem}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                  style={styles.settingGradient}
                >
                  <Trophy size={24} color="#5D6D7E" />
                  <Text style={styles.settingText}>Leaderboards</Text>
                  <Text style={styles.settingArrow}>→</Text>
                </LinearGradient>
              </Pressable>
              
              <Pressable style={styles.settingItem} onPress={handleResetProfile}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                  style={styles.settingGradient}
                >
                  <RotateCcw size={24} color="#E74C3C" />
                  <Text style={[styles.settingText, { color: '#E74C3C' }]}>Reset Profile</Text>
                  <Text style={styles.settingArrow}>→</Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          {/* Motivational Message */}
          <View style={styles.motivationSection}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
              style={styles.motivationCard}
            >
              <Text style={styles.motivationEmoji}>🌟</Text>
              <Text style={styles.motivationTitle}>Keep Learning!</Text>
              <Text style={styles.motivationText}>
                {stats.totalGamesPlayed === 0 
                  ? "Start playing games to track your amazing progress!"
                  : `You've played ${stats.totalGamesPlayed} games and earned ${stats.totalStars} stars! Keep up the great work!`
                }
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
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  noUserContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noUserText: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#5D6D7E',
    marginBottom: 20,
  },
  createButton: {
    borderRadius: 15,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  avatarEmoji: {
    fontSize: 40,
  },
  name: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  level: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#5D6D7E',
    marginBottom: 4,
  },
  experience: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#7F8C8D',
  },
  progressSection: {
    marginBottom: 30,
  },
  progressCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.3)',
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
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#5D6D7E',
    textAlign: 'center',
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  statGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  recentSection: {
    marginBottom: 30,
  },
  recentGames: {
    gap: 12,
  },
  recentGameCard: {
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  recentGameGradient: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  recentGameName: {
    fontSize: 16,
    fontFamily: 'Fredoka-SemiBold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  recentGameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recentGameScore: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#5D6D7E',
  },
  recentGameStars: {
    flexDirection: 'row',
    gap: 2,
  },
  achievementsSection: {
    marginBottom: 30,
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  achievementsCount: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#E74C3C',
  },
  achievementsList: {
    gap: 12,
  },
  achievementCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementGradient: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  achievementEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  lockedEmoji: {
    opacity: 0.5,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka-SemiBold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
  },
  lockedText: {
    color: 'rgba(93, 109, 126, 0.5)',
  },
  earnedBadge: {
    backgroundColor: '#2ECC71',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontFamily: 'Nunito-Bold',
  },
  settingsSection: {
    marginBottom: 30,
  },
  settingsList: {
    gap: 12,
  },
  settingItem: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  settingGradient: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.2)',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    marginLeft: 16,
  },
  settingArrow: {
    fontSize: 18,
    color: '#5D6D7E',
  },
  motivationSection: {
    marginBottom: 40,
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