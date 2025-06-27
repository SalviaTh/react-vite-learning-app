import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  interpolate,
  Easing
} from 'react-native-reanimated';
import { Star, Sparkles, Trophy, Heart } from 'lucide-react-native';
import { useUser } from '@/contexts/UserContext';

const { width, height } = Dimensions.get('window');

type FloatingIconProp={
  children:React.ReactNode;
  delay?:number;
  duration?:number;
};
const FloatingIcon = ({ children, delay = 0, duration = 3000 }:FloatingIconProp) => {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0.7);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    translateY.value = withRepeat(
      withTiming(-20, { 
        duration, 
        easing: Easing.inOut(Easing.sin) 
      }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(1, { duration: duration / 2 }),
      -1,
      true
    );
    scale.value = withRepeat(
      withTiming(1.1, { duration: duration * 0.8, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, { position: 'absolute' }]}>
      {children}
    </Animated.View>
  );
};

export default function WelcomeScreen() {
  const { hasUser, isLoading } = useUser();
  const scaleValue = useSharedValue(1);
  const glowValue = useSharedValue(0);

  useEffect(() => {
    scaleValue.value = withRepeat(
      withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );
    glowValue.value = withRepeat(
      withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    if (!isLoading && hasUser) {
      // Auto-navigate to tabs if user exists
      router.replace('/(tabs)');
    }
  }, [hasUser, isLoading]);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleValue.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => {
    const glowOpacity = interpolate(glowValue.value, [0, 1], [0.2, 0.6]);
    return {
      opacity: glowOpacity,
    };
  });

  const handleGetStarted = () => {
    if (hasUser) {
      router.push('/(tabs)');
    } else {
      router.push('/onboarding');
    }
  };

  // Show loading state while checking user
  if (isLoading) {
    return (
      <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </LinearGradient>
    );
  }

  // Responsive sizing based on screen dimensions
  const isTablet = width > 768;
  const isSmallScreen = height < 700;
  
  const titleSize = isTablet ? 80 : isSmallScreen ? 48 : 64;
  const subtitleSize = isTablet ? 32 : isSmallScreen ? 20 : 28;
  const buttonTextSize = isTablet ? 28 : isSmallScreen ? 20 : 24;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/bg.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Lighter gradient overlay for better blending */}
        <LinearGradient
          colors={[
            'rgba(255, 248, 220, 0.3)',
            'rgba(255, 228, 225, 0.4)',
            'rgba(230, 230, 250, 0.3)',
            'rgba(255, 248, 220, 0.4)'
          ]}
          locations={[0, 0.3, 0.7, 1]}
          style={styles.gradientOverlay}
        />
        
        {/* Softer vignette effect */}
        <LinearGradient
          colors={[
            'transparent',
            'rgba(255, 255, 255, 0.1)',
            'rgba(255, 255, 255, 0.2)',
            'rgba(255, 255, 255, 0.1)',
            'transparent'
          ]}
          style={styles.vignetteOverlay}
        />
      </ImageBackground>
      
      {/* Floating Icons with responsive positioning */}
      <FloatingIcon delay={0}>
        <View style={[styles.floatingIcon, { 
          top: height * (isSmallScreen ? 0.12 : 0.15), 
          left: width * 0.08 
        }]}>
          <Star size={isTablet ? 40 : 32} color="#FFD700" fill="#FFD700" />
        </View>
      </FloatingIcon>
      
      <FloatingIcon delay={1000}>
        <View style={[styles.floatingIcon, { 
          top: height * (isSmallScreen ? 0.2 : 0.25), 
          right: width * 0.12 
        }]}>
          <Sparkles size={isTablet ? 36 : 28} color="#FF69B4" />
        </View>
      </FloatingIcon>
      
      <FloatingIcon delay={2000}>
        <View style={[styles.floatingIcon, { 
          top: height * (isSmallScreen ? 0.65 : 0.7), 
          left: width * 0.15 
        }]}>
          <Trophy size={isTablet ? 44 : 36} color="#FFA500" fill="#FFA500" />
        </View>
      </FloatingIcon>
      
      <FloatingIcon delay={1500}>
        <View style={[styles.floatingIcon, { 
          top: height * (isSmallScreen ? 0.55 : 0.6), 
          right: width * 0.08 
        }]}>
          <Heart size={isTablet ? 38 : 30} color="#FF1493" fill="#FF1493" />
        </View>
      </FloatingIcon>

      {/* Main Content */}
      <View style={styles.content}>
        <View style={[styles.titleContainer, { marginBottom: isSmallScreen ? 40 : 60 }]}>
          {/* Animated glow effect behind title */}
          <Animated.View style={[styles.titleGlow, glowAnimatedStyle]} />
          
          <Text style={[styles.title, { fontSize: titleSize }]}>E-Buddy</Text>
          <Text style={[styles.subtitle, { fontSize: subtitleSize }]}>Math Adventure</Text>
          <View style={styles.tagline}>
            <Text style={[styles.taglineText, { fontSize: isTablet ? 20 : 18 }]}>
              🎯 Learn • Play • Grow 🌟
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Animated.View style={buttonAnimatedStyle}>
            <Pressable
              style={({ pressed }) => [
                styles.startButton,
                pressed && styles.startButtonPressed,
                { paddingHorizontal: isTablet ? 50 : 40 }
              ]}
              onPress={handleGetStarted}
            >
              <LinearGradient
                colors={['#FF9A9E', '#FECFEF', '#FFB6C1']}
                style={styles.startButtonGradient}
              >
                <Text style={[styles.startButtonText, { fontSize: buttonTextSize }]}>
                  {hasUser ? '🎮 Continue Learning!' : '🚀 Start Learning!'}
                </Text>
                <View style={styles.buttonIcon}>
                  <Text style={[styles.buttonEmoji, { fontSize: buttonTextSize }]}>✨</Text>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  vignetteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingIcon: {
    position: 'absolute',
    zIndex: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 3,
  },
  titleContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  titleGlow: {
    position: 'absolute',
    top: -20,
    left: -40,
    right: -40,
    bottom: -20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 100,
    zIndex: -1,
  },
  title: {
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 8,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Nunito-SemiBold',
    color: '#34495E',
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    marginBottom: 20,
    textAlign: 'center',
  },
  tagline: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  taglineText: {
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  startButton: {
    borderRadius: 35,
    elevation: 12,
    shadowColor: '#FF9A9E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  startButtonPressed: {
    transform: [{ scale: 0.95 }],
    elevation: 8,
  },
  startButtonGradient: {
    paddingVertical: 22,
    borderRadius: 35,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    minWidth: width * 0.7,
  },
  startButtonText: {
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  buttonIcon: {
    marginLeft: 12,
  },
  buttonEmoji: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});