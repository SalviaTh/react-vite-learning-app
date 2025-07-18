import React from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function LevelSelectionScreen() {
  const handleLevelSelect = (level) => {
    router.push(`/chapters/${level.toLowerCase()}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color="#2C3E50" />
        </Pressable>

        <Text style={styles.title}>🚀 Select your standard Buddy</Text>

        <View style={styles.grid}>
          <Pressable onPress={() => handleLevelSelect('easy')}>
            <LinearGradient colors={['#A8EDEA', '#FED6E3']} style={styles.levelCard}>
              <Text style={styles.emoji}>🌱</Text>
              <Text style={styles.levelName}>Standard 1</Text>
              <Text style={styles.levelDesc}>Start with the basics</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => handleLevelSelect('beginner')}>
            <LinearGradient colors={['#DDA0DD', '#E6E6FA']} style={styles.levelCard}>
              <Text style={styles.emoji}>🧠</Text>
              <Text style={styles.levelName}>Standard 2</Text>
              <Text style={styles.levelDesc}>Simple problem solving</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => handleLevelSelect('medium')}>
            <LinearGradient colors={['#98FB98', '#90EE90']} style={styles.levelCard}>
              <Text style={styles.emoji}>📘</Text>
              <Text style={styles.levelName}>Standard 3</Text>
              <Text style={styles.levelDesc}>Get a little challenge</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => handleLevelSelect('hard')}>
            <LinearGradient colors={['#F0E68C', '#FFE4B5']} style={styles.levelCard}>
              <Text style={styles.emoji}>🚀</Text>
              <Text style={styles.levelName}>Standard 4</Text>
              <Text style={styles.levelDesc}>Tough but rewarding</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => handleLevelSelect('hard')}>
            <LinearGradient colors={['#FF9A9E', '#FECFEF']} style={styles.levelCard}>
              <Text style={styles.emoji}>🚀</Text>
              <Text style={styles.levelName}>Standard 5</Text>
              <Text style={styles.levelDesc}>Tough but rewarding</Text>
            </LinearGradient>
          </Pressable>


          {/* <Pressable onPress={() => handleLevelSelect('difficult')}>
            <LinearGradient colors={['#B2EBF2', '#80DEEA']} style={styles.levelCard}>
              <Text style={styles.emoji}>🔥</Text>
              <Text style={styles.levelName}>Difficult</Text>
              <Text style={styles.levelDesc}>Push your limits</Text>
            </LinearGradient>
          </Pressable>

          <Pressable onPress={() => handleLevelSelect('master')}>
            <LinearGradient colors={['#FFE082', '#FFD54F']} style={styles.levelCard}>
              <Text style={styles.emoji}>👑</Text>
              <Text style={styles.levelName}>Master</Text>
              <Text style={styles.levelDesc}>Only for the brave!</Text>
            </LinearGradient>
          </Pressable> */}
        </View>
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
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    padding: 8,
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#2C3E50',
    fontFamily: 'Fredoka-Bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 20,
  },
  levelCard: {
    width: (width - 60) / 2,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    borderWidth:2,
    borderColor: 'rgba(255, 255, 255, 0.8)', 
  },
  emoji: {
    fontSize: 32,
    marginBottom: 10,
  },
  levelName: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  levelDesc: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
    textAlign: 'center',
  },
});
