import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Target, Star, TrendingUp, Gamepad2 } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { Audio } from 'expo-av';
import { useState, useRef } from 'react';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, icon: Icon, color, delay = 0 }) => {
  const scale = useSharedValue(0);
  useEffect(() => {
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.statCard, animatedStyle]}>
      <LinearGradient colors={color} style={styles.statCardGradient}>
        <Icon size={32} color="#FFFFFF" />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

const QuickActionCard = ({ title, subtitle, emoji, onPress, colors }) => (
  <Pressable style={styles.actionCard} onPress={onPress}>
    <LinearGradient colors={colors} style={styles.actionCardGradient}>
      <Text style={styles.actionEmoji}>{emoji}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSubtitle}>{subtitle}</Text>
    </LinearGradient>
  </Pressable>
);

export default function HomeScreen() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const handlePlayMusic = async () => {
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/music/bg_music.mp3'),
          { isLooping: true, volume }
        );
        soundRef.current = sound;
      }
      await soundRef.current.playAsync();
      setIsMusicPlaying(true);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(value);
    }
  };
  const handleFunGamesPress = () => {
    router.push('/games');
  }
  const handleChapters =()=>{
    router.push('/chapters'); 
  }
  const handleTeacher=()=>{
    router.push('/ai_teacher');

  };

  return (
    <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello, Math Explorer! 👋</Text>
              <Text style={styles.subtitle}>Ready for math adventures?</Text>
            </View>
            <View style={styles.streakContainer}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakText}>Keep Going!</Text>
            </View>
            <View style={styles.streakContainer}>
            <Pressable onPress={handlePlayMusic}>
            <Text style={styles.streakEmoji}>🔊</Text>
    <Text style={styles.streakText}>Play Music</Text>
  </Pressable>

  {isMusicPlaying && (
    <Slider
      style={{ width: 120, marginTop: 8 }}
      minimumValue={0}
      maximumValue={1}
      value={volume}
      onValueChange={handleVolumeChange}
      minimumTrackTintColor="#FF6B6B"
      maximumTrackTintColor="#ddd"
    />
  )}
</View>

            
          </View>

          {/* Stats Row */}
          <View style={styles.statsContainer}>
            <StatCard
              title="Lessons"
              value="0"
              icon={BookOpen}
              color={['#FF9A9E', '#FECFEF']}
              delay={100}
            />
            <StatCard
              title="Accuracy"
              value="0%"
              icon={Target}
              color={['#A8EDEA', '#FED6E3']}
              delay={200}
            />
            <StatCard
              title="Stars"
              value="0"
              icon={Star}
              color={['#FFD93D', '#FECA57']}
              delay={300}
            />
            <StatCard
              title="Level"
              value="1"
              icon={TrendingUp}
              color={['#A8E6CF', '#88D8C0']}
              delay={400}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🚀 Quick Start</Text>
            <View style={styles.actionsGrid}>
              <QuickActionCard
                title="Start Learning"
                subtitle="Start with basics"
                emoji="🔢"
                colors={['#FFB6C1', '#FFC0CB']}
                onPress={handleChapters}
              />
              <QuickActionCard
                title="AI Teacher"
                subtitle="Test your skills"
                emoji="🧠"
                colors={['#DDA0DD', '#E6E6FA']}
                onPress={handleTeacher}
              />
              <QuickActionCard
                title="Fun Games"
                subtitle="Math challenges"
                emoji="🎮"
                colors={['#87CEEB', '#B0E0E6']}
                onPress={handleFunGamesPress}
              />
              <QuickActionCard
                title="Progress Map"
                subtitle="See your journey"
                emoji="🗺️"
                colors={['#98FB98', '#90EE90']}
                onPress={() => router.push('/(tabs)/roadmap')}
              />
            </View>
          </View>

          {/* Today's Goal */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🎯 Today's Goal</Text>
            <View style={styles.goalCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                style={styles.goalCardGradient}
              >
                <View style={styles.goalContent}>
                  <Text style={styles.goalEmoji}>⭐</Text>
                  <View style={styles.goalText}>
                    <Text style={styles.goalTitle}>Play Your First Game</Text>
                    <Text style={styles.goalSubtitle}>Let's start your math journey!</Text>
                  </View>
                  <View style={styles.goalProgress}>
                    <Text style={styles.goalProgressText}>0/1</Text>
                  </View>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: '0%' }]} />
                </View>
              </LinearGradient>
            </View>
          </View>

          {/* Fun Learning Tips */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>💡 Learning Tips</Text>
            <View style={styles.achievementsContainer}>
              <View style={styles.achievement}>
                <Text style={styles.achievementEmoji}>🎯</Text>
                <Text style={styles.achievementText}>Practice Daily</Text>
              </View>
              <View style={styles.achievement}>
                <Text style={styles.achievementEmoji}>🌟</Text>
                <Text style={styles.achievementText}>Have Fun</Text>
              </View>
              <View style={styles.achievement}>
                <Text style={styles.achievementEmoji}>🚀</Text>
                <Text style={styles.achievementText}>Keep Learning</Text>
              </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
     alignItems: 'center',
    paddingVertical: 20,
  },
  greeting: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
    marginTop: 4,
  },
  streakContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakText: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#E74C3C',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: (width - 60) / 4,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  statCardGradient: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: 'rgba(255, 255, 255, 0.95)',
    marginTop: 4,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  sectionContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
    borderRadius: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  actionCardGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  actionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Fredoka-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  goalCard: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  goalCardGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  goalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  goalText: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: 'Fredoka-SemiBold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  goalSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
  },
  goalProgress: {
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  goalProgressText: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#E74C3C',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 107, 107, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 3,
  },
  achievementsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievement: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.2)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    textAlign: 'center',
  },
});