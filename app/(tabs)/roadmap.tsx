import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, Crown, Gift, Sparkles, Trophy, Heart, Zap } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withRepeat, withTiming, interpolate } from 'react-native-reanimated';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

const gradeData = [
  { 
    grade: 1, 
    title: 'Number Friends', 
    completed: true, 
    stars: 3, 
    color: ['#FF6B6B', '#FF8E8E'],
    emoji: '🔢',
    position: { x: 0.2, y: 0.9 },
    theme: 'Counting & Basic Numbers'
  },
  { 
    grade: 2, 
    title: 'Addition Adventure', 
    completed: true, 
    stars: 3, 
    color: ['#4ECDC4', '#44A08D'],
    emoji: '➕',
    position: { x: 0.4, y: 0.8 },
    theme: 'Adding Numbers Together'
  },
  { 
    grade: 3, 
    title: 'Subtraction Safari', 
    completed: true, 
    stars: 2, 
    color: ['#45B7D1', '#96CEB4'],
    emoji: '➖',
    position: { x: 0.7, y: 0.75 },
    theme: 'Taking Numbers Away'
  },
  { 
    grade: 4, 
    title: 'Multiplication Magic', 
    completed: true, 
    stars: 3, 
    color: ['#F7DC6F', '#BB8FCE'],
    emoji: '✖️',
    position: { x: 0.8, y: 0.6 },
    theme: 'Times Tables Fun'
  },
  { 
    grade: 5, 
    title: 'Division Quest', 
    completed: false, 
    current: true, 
    stars: 1, 
    color: ['#85C1E9', '#F8C471'],
    emoji: '➗',
    position: { x: 0.6, y: 0.5 },
    theme: 'Sharing Numbers Equally'
  },
  { 
    grade: 6, 
    title: 'Fraction Kingdom', 
    completed: false, 
    stars: 0, 
    color: ['#D7BDE2', '#A9DFBF'],
    emoji: '🍰',
    position: { x: 0.3, y: 0.45 },
    theme: 'Parts of a Whole'
  },
  { 
    grade: 7, 
    title: 'Algebra Island', 
    completed: false, 
    stars: 0, 
    color: ['#F1948A', '#85C1E9'],
    emoji: '🏝️',
    position: { x: 0.15, y: 0.35 },
    theme: 'Letters Meet Numbers'
  },
  { 
    grade: 8, 
    title: 'Geometry Galaxy', 
    completed: false, 
    stars: 0, 
    color: ['#82E0AA', '#F7DC6F'],
    emoji: '🌌',
    position: { x: 0.5, y: 0.3 },
    theme: 'Shapes & Space'
  },
  { 
    grade: 9, 
    title: 'Advanced Algebra', 
    completed: false, 
    stars: 0, 
    color: ['#AED6F1', '#F1C40F'],
    emoji: '🚀',
    position: { x: 0.75, y: 0.25 },
    theme: 'Complex Equations'
  },
  { 
    grade: 10, 
    title: 'Trigonometry Tower', 
    completed: false, 
    stars: 0, 
    color: ['#D5A6BD', '#A9CCE3'],
    emoji: '🗼',
    position: { x: 0.85, y: 0.15 },
    theme: 'Triangles & Angles'
  },
  { 
    grade: 11, 
    title: 'Calculus Castle', 
    completed: false, 
    stars: 0, 
    color: ['#FADBD8', '#D5DBDB'],
    emoji: '🏰',
    position: { x: 0.4, y: 0.1 },
    theme: 'Advanced Mathematics'
  },
  { 
    grade: 12, 
    title: 'Math Master Peak', 
    completed: false, 
    stars: 0, 
    color: ['#EBF5FB', '#EAEDED'],
    emoji: '⛰️',
    position: { x: 0.2, y: 0.05 },
    theme: 'Ultimate Challenge'
  },
];

const decorativeElements = [
  { emoji: '🌟', position: { x: 0.1, y: 0.7 }, size: 24 },
  { emoji: '🎈', position: { x: 0.9, y: 0.4 }, size: 28 },
  { emoji: '🦋', position: { x: 0.05, y: 0.6 }, size: 20 },
  { emoji: '🌸', position: { x: 0.95, y: 0.8 }, size: 22 },
  { emoji: '🍀', position: { x: 0.25, y: 0.65 }, size: 18 },
  { emoji: '🌈', position: { x: 0.65, y: 0.35 }, size: 26 },
  { emoji: '☁️', position: { x: 0.8, y: 0.05 }, size: 30 },
  { emoji: '🎯', position: { x: 0.1, y: 0.2 }, size: 24 },
];

type FloatingDecorationProps = {
  element: typeof decorativeElements[0];
  index: number;
}
const FloatingDecoration = ({ element, index }:FloatingDecorationProps) => {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const delay = index * 500;
    setTimeout(() => {
      translateY.value = withRepeat(
        withTiming(-15, { duration: 2000 + index * 200 }),
        -1,
        true
      );
      rotate.value = withRepeat(
        withTiming(10, { duration: 3000 + index * 300 }),
        -1,
        true
      );
      scale.value = withRepeat(
        withTiming(1.1, { duration: 2500 + index * 100 }),
        -1,
        true
      );
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value }
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.decorativeElement,
        {
          left: element.position.x * width,
          top: element.position.y * height * 0.7,
        },
        animatedStyle
      ]}
    >
      <Text style={{ fontSize: element.size }}>{element.emoji}</Text>
    </Animated.View>
  );
};
type PathSegmentProps = {
  from: typeof gradeData[0];
  to: typeof gradeData[0];
  index: number;
}
const PathSegment = ({ from, to, index }:PathSegmentProps) => {
  const opacity = useSharedValue(0);
  
  useEffect(() => {
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 800 });
    }, index * 200);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const fromX = from.position.x * width;
  const fromY = from.position.y * height * 0.7;
  const toX = to.position.x * width;
  const toY = to.position.y * height * 0.7;

  const distance = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
  const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI;

  return (
    <Animated.View
      style={[
        styles.pathSegment,
        {
          left: fromX,
          top: fromY,
          width: distance,
          transform: [{ rotate: `${angle}deg` }],
        },
        animatedStyle
      ]}
    >
      <LinearGradient
        colors={['#FF69B4', '#FFD700', '#FF69B4']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.pathGradient}
      />
    </Animated.View>
  );
};
type RoadmapNodeProps = {
  item: typeof gradeData[0];
  index: number;
  onPress: (item: typeof gradeData[0]) => void;
}
const RoadmapNode = ({ item, index, onPress }:RoadmapNodeProps) => {
  const scale = useSharedValue(0);
  const bounce = useSharedValue(1);
  const glow = useSharedValue(0);
  
  useEffect(() => {
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    }, index * 150);

    if (item.current) {
      bounce.value = withRepeat(
        withTiming(1.1, { duration: 1000 }),
        -1,
        true
      );
      glow.value = withRepeat(
        withTiming(1, { duration: 1500 }),
        -1,
        true
      );
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * bounce.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glow.value, [0, 1], [0.3, 0.8]),
  }));

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          color={i < item.stars ? '#FFD700' : 'rgba(255, 255, 255, 0.3)'}
          fill={i < item.stars ? '#FFD700' : 'transparent'}
        />
      );
    }
    return stars;
  };

  return (
    <Animated.View
      style={[
        styles.nodeContainer,
        {
          left: item.position.x * width - 40,
          top: item.position.y * height * 0.7 - 40,
        },
        animatedStyle
      ]}
    >
      {item.current && (
        <Animated.View style={[styles.nodeGlow, glowStyle]} />
      )}
      
      <Pressable
        style={[
          styles.node,
          item.current && styles.currentNode,
          !item.completed && !item.current && styles.lockedNode
        ]}
        onPress={() => onPress(item)}
        disabled={!item.completed && !item.current}
      >
        <LinearGradient
          colors={item.completed || item.current ? item.color as [string,string] : ['#D5DBDB', '#BDC3C7']}
          style={styles.nodeGradient}
        >
          <Text style={styles.nodeEmoji}>{item.emoji}</Text>
          <Text style={styles.gradeNumber}>{item.grade}</Text>
          
          {item.completed && (
            <View style={styles.completedBadge}>
              <Crown size={16} color="#FFD700" fill="#FFD700" />
            </View>
          )}
          
          {item.current && (
            <View style={styles.currentPulse}>
              <Sparkles size={14} color="#FFFFFF" />
            </View>
          )}
          
          {!item.completed && !item.current && (
            <View style={styles.lockedOverlay}>
              <Text style={styles.lockEmoji}>🔒</Text>
            </View>
          )}
        </LinearGradient>
      </Pressable>
      
      <View style={styles.nodeInfo}>
        <Text style={[
          styles.nodeTitle,
          !item.completed && !item.current && styles.lockedText
        ]}>
          {item.title}
        </Text>
        <View style={styles.starsContainer}>
          {renderStars()}
        </View>
      </View>
    </Animated.View>
  );
};
type RoadmapScreenProps = {
  item: typeof gradeData[0];
  onPress: (item: typeof gradeData[0]) => void;
}
export default function RoadmapScreen({ item, onPress }:RoadmapScreenProps) {
  const handleNodePress = (item: typeof gradeData[0]) => {
    if (item.completed || item.current) {
      console.log('Navigate to grade', item.grade);
    }
  };

  return (
    <LinearGradient colors={['#87CEEB', '#FFE4B5', '#F0E68C']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🗺️ Math Adventure Map</Text>
          <Text style={styles.subtitle}>Follow the magical path to become a Math Master!</Text>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressOverview}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
            style={styles.progressCard}
          >
            <View style={styles.progressHeader}>
              <Trophy size={24} color="#FFD700" fill="#FFD700" />
              <Text style={styles.progressTitle}>Your Journey</Text>
              <Heart size={24} color="#FF69B4" fill="#FF69B4" />
            </View>
            <View style={styles.progressStats}>
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>4</Text>
                <Text style={styles.progressLabel}>🏆 Completed</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>1</Text>
                <Text style={styles.progressLabel}>🎯 Current</Text>
              </View>
              <View style={styles.progressStat}>
                <Text style={styles.progressNumber}>12</Text>
                <Text style={styles.progressLabel}>⭐ Stars</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Roadmap */}
        <ScrollView 
          style={styles.roadmapContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.roadmapContent}
        >
          <View style={styles.mapArea}>
            {/* Background decorative elements */}
            {decorativeElements.map((element, index) => (
              <FloatingDecoration key={index} element={element} index={index} />
            ))}
            
            {/* Path segments */}
            {gradeData.slice(0, -1).map((item, index) => (
              <PathSegment
                key={`path-${index}`}
                from={item}
                to={gradeData[index + 1]}
                index={index}
              />
            ))}
            
            {/* Grade nodes */}
            {gradeData.map((item, index) => (
              <RoadmapNode
                key={item.grade}
                item={item}
                index={index}
                onPress={handleNodePress}
              />
            ))}
            
            {/* Final treasure chest */}
            <View style={[styles.treasureChest, {
              left: gradeData[gradeData.length - 1].position.x * width - 30,
              top: gradeData[gradeData.length - 1].position.y * height * 0.7 - 100,
            }]}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.treasureGradient}
              >
                <Text style={styles.treasureEmoji}>👑</Text>
                <Text style={styles.treasureText}>Math Master!</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#34495E',
    textAlign: 'center',
  },
  progressOverview: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  progressCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  progressTitle: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#E74C3C',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#34495E',
    textAlign: 'center',
  },
  roadmapContainer: {
    flex: 1,
  },
  roadmapContent: {
    minHeight: height * 0.8,
  },
  mapArea: {
    position: 'relative',
    height: height * 0.8,
    marginHorizontal: 20,
  },
  decorativeElement: {
    position: 'absolute',
    zIndex: 1,
  },
  pathSegment: {
    position: 'absolute',
    height: 8,
    zIndex: 2,
    transformOrigin: 'left center',
  },
  pathGradient: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  nodeContainer: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 3,
  },
  nodeGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFD700',
    top: -10,
    left: -10,
    zIndex: -1,
  },
  node: {
    width: 80,
    height: 80,
    borderRadius: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  currentNode: {
    elevation: 12,
    shadowOpacity: 0.4,
  },
  lockedNode: {
    elevation: 4,
    opacity: 0.6,
  },
  nodeGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    position: 'relative',
  },
  nodeEmoji: {
    fontSize: 24,
    marginBottom: 2,
  },
  gradeNumber: {
    fontSize: 14,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  completedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#2ECC71',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  currentPulse: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#E74C3C',
    borderRadius: 12,
    padding: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  lockedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockEmoji: {
    fontSize: 20,
  },
  nodeInfo: {
    marginTop: 8,
    alignItems: 'center',
    maxWidth: 120,
  },
  nodeTitle: {
    fontSize: 12,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  lockedText: {
    color: 'rgba(44, 62, 80, 0.5)',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  treasureChest: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 4,
  },
  treasureGradient: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
  },
  treasureEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  treasureText: {
    fontSize: 14,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});