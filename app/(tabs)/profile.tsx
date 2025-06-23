import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Award, Settings, Star, Trophy, Target, Clock, Book } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';

const { width } = Dimensions.get('window');

const achievements = [
  { id: 1, title: 'First Steps', description: 'Started your math journey', emoji: '👶', earned: true },
  { id: 2, title: 'Number Friend', description: 'Learned about numbers', emoji: '🔢', earned: false },
  { id: 3, title: 'Addition Star', description: 'Mastered basic addition', emoji: '➕', earned: false },
  { id: 4, title: 'Game Master', description: 'Played 5 different games', emoji: '🎮', earned: false },
  { id: 5, title: 'Math Explorer', description: 'Completed 10 lessons', emoji: '🎓', earned: false },
  { id: 6, title: 'Quiz Champion', description: 'Perfect score on quiz', emoji: '🏆', earned: false },
];

const stats = [
  { label: 'Games Played', value: '0', icon: Target, color: ['#FF9A9E', '#FECFEF'] },
  { label: 'Study Time', value: '0m', icon: Clock, color: ['#A8EDEA', '#FED6E3'] },
  { label: 'Lessons Complete', value: '0', icon: Book, color: ['#87CEEB', '#B0E0E6'] },
  { label: 'Stars Earned', value: '0', icon: Star, color: ['#DDA0DD', '#E6E6FA'] },
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

const AchievementCard = ({ achievement }) => (
  <View style={[
    styles.achievementCard,
    !achievement.earned && styles.achievementLocked
  ]}>
    <LinearGradient
      colors={achievement.earned 
        ? ['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']
        : ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.3)']
      }
      style={styles.achievementGradient}
    >
      <Text style={[
        styles.achievementEmoji,
        !achievement.earned && styles.lockedEmoji
      ]}>
        {achievement.earned ? achievement.emoji : '🔒'}
      </Text>
      <View style={styles.achievementText}>
        <Text style={[
          styles.achievementTitle,
          !achievement.earned && styles.lockedText
        ]}>
          {achievement.title}
        </Text>
        <Text style={[
          styles.achievementDescription,
          !achievement.earned && styles.lockedText
        ]}>
          {achievement.description}
        </Text>
      </View>
      {achievement.earned && (
        <View style={styles.earnedBadge}>
          <Text style={styles.earnedText}>✓</Text>
        </View>
      )}
    </LinearGradient>
  </View>
);

export default function ProfileScreen() {
  const earnedAchievements = achievements.filter(a => a.earned).length;
  const totalAchievements = achievements.length;

  // Default user info since no authentication
  const displayName = 'Math Explorer';

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
                <User size={40} color="#FFFFFF" />
              </LinearGradient>
            </View>
            <Text style={styles.name}>{displayName}</Text>
            <Text style={styles.level}>Level 1 • Beginner</Text>
            <Text style={styles.email}>Ready to learn math!</Text>
          </View>

          {/* Progress Overview */}
          <View style={styles.progressSection}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
              style={styles.progressCard}
            >
              <Text style={styles.progressTitle}>🏆 Your Journey</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: '5%' }]} />
              </View>
              <Text style={styles.progressText}>Just getting started!</Text>
            </LinearGradient>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>📊 Your Stats</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <StatCard key={stat.label} stat={stat} index={index} />
              ))}
            </View>
          </View>

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
                <AchievementCard key={achievement.id} achievement={achievement} />
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
                  <Text style={styles.settingText}>App Settings</Text>
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
              
              <Pressable style={styles.settingItem}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                  style={styles.settingGradient}
                >
                  <Award size={24} color="#5D6D7E" />
                  <Text style={styles.settingText}>Parent Dashboard</Text>
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
              <Text style={styles.motivationTitle}>Welcome to Math Adventure!</Text>
              <Text style={styles.motivationText}>
                Start playing games to unlock achievements and track your progress. Every step counts!
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
  email: {
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