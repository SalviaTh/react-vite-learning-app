import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameScore {
  gameId: string;
  gameName: string;
  score: number;
  maxScore: number;
  stars: number;
  completedAt: string;
  level: number;
  timeSpent: number; // in seconds
}

export interface UserStats {
  totalGamesPlayed: number;
  totalScore: number;
  totalStars: number;
  averageScore: number;
  totalTimeSpent: number;
  favoriteGame: string;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
  level: number;
  experience: number;
  gameScores: GameScore[];
  achievements: string[];
  preferences: {
    soundEnabled: boolean;
    animationsEnabled: boolean;
    difficulty: 'easy' | 'medium' | 'hard';
  };
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  createUser: (name: string, avatar: string) => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  addGameScore: (score: GameScore) => Promise<void>;
  getUserStats: () => UserStats;
  clearUserData: () => Promise<void>;
  hasUser: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const USER_STORAGE_KEY = '@ebuddy_user_profile';

const defaultPreferences = {
  soundEnabled: true,
  animationsEnabled: true,
  difficulty: 'easy' as const,
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData: UserProfile) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const createUser = async (name: string, avatar: string) => {
    const newUser: UserProfile = {
      id: Date.now().toString(),
      name,
      avatar,
      createdAt: new Date().toISOString(),
      level: 1,
      experience: 0,
      gameScores: [],
      achievements: ['first_steps'],
      preferences: defaultPreferences,
    };
    await saveUser(newUser);
  };

  const updateUser = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    await saveUser(updatedUser);
  };

  const addGameScore = async (score: GameScore) => {
    if (!user) return;

    const updatedScores = [...user.gameScores];
    const existingScoreIndex = updatedScores.findIndex(
      s => s.gameId === score.gameId
    );

    if (existingScoreIndex >= 0) {
      // Update if new score is better
      if (score.score > updatedScores[existingScoreIndex].score) {
        updatedScores[existingScoreIndex] = score;
      }
    } else {
      updatedScores.push(score);
    }

    // Calculate new experience and level
    const experienceGained = score.stars * 10 + Math.floor(score.score / 10);
    const newExperience = user.experience + experienceGained;
    const newLevel = Math.floor(newExperience / 100) + 1;

    // Check for new achievements
    const newAchievements = [...user.achievements];
    const stats = calculateStats(updatedScores);
    
    if (stats.totalGamesPlayed >= 5 && !newAchievements.includes('game_explorer')) {
      newAchievements.push('game_explorer');
    }
    if (stats.totalStars >= 15 && !newAchievements.includes('star_collector')) {
      newAchievements.push('star_collector');
    }
    if (stats.currentStreak >= 3 && !newAchievements.includes('streak_master')) {
      newAchievements.push('streak_master');
    }

    const updatedUser = {
      ...user,
      gameScores: updatedScores,
      experience: newExperience,
      level: newLevel,
      achievements: newAchievements,
    };

    await saveUser(updatedUser);
  };

  const calculateStats = (scores: GameScore[]): UserStats => {
    if (scores.length === 0) {
      return {
        totalGamesPlayed: 0,
        totalScore: 0,
        totalStars: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        favoriteGame: '',
        currentStreak: 0,
        bestStreak: 0,
        lastPlayedDate: '',
      };
    }

    const totalScore = scores.reduce((sum, score) => sum + score.score, 0);
    const totalStars = scores.reduce((sum, score) => sum + score.stars, 0);
    const totalTimeSpent = scores.reduce((sum, score) => sum + score.timeSpent, 0);
    
    // Find favorite game (most played)
    const gameFrequency: { [key: string]: number } = {};
    scores.forEach(score => {
      gameFrequency[score.gameName] = (gameFrequency[score.gameName] || 0) + 1;
    });
    const favoriteGame = Object.keys(gameFrequency).reduce((a, b) => 
      gameFrequency[a] > gameFrequency[b] ? a : b, ''
    );

    // Calculate streaks (simplified - consecutive days with games)
    const sortedDates = scores
      .map(s => s.completedAt.split('T')[0])
      .sort()
      .filter((date, index, arr) => arr.indexOf(date) === index);
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);

    // Check if last played was today or yesterday for current streak
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const lastPlayedDate = sortedDates[sortedDates.length - 1];
    
    if (lastPlayedDate === today || lastPlayedDate === yesterday) {
      currentStreak = tempStreak;
    }

    return {
      totalGamesPlayed: scores.length,
      totalScore,
      totalStars,
      averageScore: Math.round(totalScore / scores.length),
      totalTimeSpent,
      favoriteGame,
      currentStreak,
      bestStreak,
      lastPlayedDate: scores[scores.length - 1]?.completedAt || '',
    };
  };

  const getUserStats = (): UserStats => {
    if (!user) {
      return {
        totalGamesPlayed: 0,
        totalScore: 0,
        totalStars: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        favoriteGame: '',
        currentStreak: 0,
        bestStreak: 0,
        lastPlayedDate: '',
      };
    }
    return calculateStats(user.gameScores);
  };

  const clearUserData = async () => {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        createUser,
        updateUser,
        addGameScore,
        getUserStats,
        clearUserData,
        hasUser: !!user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}