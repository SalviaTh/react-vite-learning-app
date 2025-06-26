import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, RotateCcw, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withSequence,
  withTiming
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const MAZE_SIZE = 5;
const CELL_SIZE = (width - 60) / MAZE_SIZE;

const generateMaze = () => {
  const maze = [];
  for (let i = 0; i < MAZE_SIZE; i++) {
    maze[i] = [];
    for (let j = 0; j < MAZE_SIZE; j++) {
      if (i === 0 && j === 0) {
        maze[i][j] = { type: 'start', number: null, quantity: null };
      } else if (i === MAZE_SIZE - 1 && j === MAZE_SIZE - 1) {
        maze[i][j] = { type: 'end', number: null, quantity: null };
      } else if (Math.random() < 0.3) {
        maze[i][j] = { type: 'wall', number: null, quantity: null };
      } else {
        const number = Math.floor(Math.random() * 5) + 1;
        const quantity = Math.floor(Math.random() * 5) + 1;
        const isMatch = Math.random() < 0.4;
        maze[i][j] = { 
          type: 'path', 
          number: isMatch ? quantity : number, 
          quantity: quantity,
          isMatch: isMatch
        };
      }
    }
  }
  return maze;
};

export default function NumberMatchMazeGame() {
  const [maze, setMaze] = useState(generateMaze());
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [collectedMatches, setCollectedMatches] = useState(0);

  const playerScale = useSharedValue(1);
  const celebrationScale = useSharedValue(0);

  useEffect(() => {
    playerScale.value = withSequence(
      withTiming(1.2, { duration: 200 }),
      withSpring(1, { damping: 15, stiffness: 100 })
    );
  }, [playerPosition]);

  const playerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playerScale.value }],
  }));

  const celebrationAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: celebrationScale.value }],
    opacity: celebrationScale.value,
  }));

  const movePlayer = (direction) => {
    const { x, y } = playerPosition;
    let newX = x;
    let newY = y;

    switch (direction) {
      case 'up':
        newY = Math.max(0, y - 1);
        break;
      case 'down':
        newY = Math.min(MAZE_SIZE - 1, y + 1);
        break;
      case 'left':
        newX = Math.max(0, x - 1);
        break;
      case 'right':
        newX = Math.min(MAZE_SIZE - 1, x + 1);
        break;
    }

    if (newX !== x || newY !== y) {
      const cell = maze[newY][newX];
      
      if (cell.type === 'wall') {
        Alert.alert('Blocked!', 'You cannot move through walls!');
        return;
      }

      setPlayerPosition({ x: newX, y: newY });
      setMoves(prev => prev + 1);

      if (cell.type === 'path' && cell.isMatch) {
        setScore(prev => prev + 10);
        setCollectedMatches(prev => prev + 1);
        
        // Show celebration
        celebrationScale.value = withSequence(
          withSpring(1, { damping: 15, stiffness: 100 }),
          withTiming(0, { duration: 1000 })
        );

        // Mark as collected
        const newMaze = [...maze];
        newMaze[newY][newX] = { ...cell, collected: true };
        setMaze(newMaze);
      }

      if (newX === MAZE_SIZE - 1 && newY === MAZE_SIZE - 1) {
        setGameWon(true);
      }
    }
  };

  const restartGame = () => {
    setMaze(generateMaze());
    setPlayerPosition({ x: 0, y: 0 });
    setScore(0);
    setMoves(0);
    setGameWon(false);
    setCollectedMatches(0);
  };

  const renderCell = (cell, x, y) => {
    const isPlayer = playerPosition.x === x && playerPosition.y === y;
    
    let cellContent;
    let cellColors;

    switch (cell.type) {
      case 'start':
        cellContent = '🏁';
        cellColors = ['#2ECC71', '#27AE60'];
        break;
      case 'end':
        cellContent = '🎯';
        cellColors = ['#E74C3C', '#C0392B'];
        break;
      case 'wall':
        cellContent = '🧱';
        cellColors = ['#34495E', '#2C3E50'];
        break;
      case 'path':
        if (cell.collected) {
          cellContent = '✅';
          cellColors = ['#F39C12', '#E67E22'];
        } else if (cell.isMatch) {
          cellContent = `${cell.number}\n${'●'.repeat(cell.quantity)}`;
          cellColors = ['#3498DB', '#2980B9'];
        } else {
          cellContent = `${cell.number}\n${'○'.repeat(cell.quantity)}`;
          cellColors = ['#95A5A6', '#7F8C8D'];
        }
        break;
      default:
        cellContent = '';
        cellColors = ['#ECF0F1', '#BDC3C7'];
    }

    return (
      <View key={`${x}-${y}`} style={styles.cell}>
        <LinearGradient colors={cellColors} style={styles.cellGradient}>
          <Text style={styles.cellText}>{cellContent}</Text>
          {isPlayer && (
            <Animated.View style={[styles.player, playerAnimatedStyle]}>
              <Text style={styles.playerEmoji}>🧙‍♂️</Text>
            </Animated.View>
          )}
        </LinearGradient>
      </View>
    );
  };

  if (gameWon) {
    return (
      <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.winContainer}>
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
              style={styles.winCard}
            >
              <Text style={styles.winEmoji}>🎉</Text>
              <Text style={styles.winTitle}>Maze Completed!</Text>
              <Text style={styles.winText}>
                You escaped the maze and collected {collectedMatches} matches!
              </Text>
              <View style={styles.winStats}>
                <Text style={styles.statText}>Score: {score}</Text>
                <Text style={styles.statText}>Moves: {moves}</Text>
                <View style={styles.starsContainer}>
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      size={24}
                      color="#FFD700"
                      fill={star <= (collectedMatches >= 3 ? 3 : collectedMatches >= 1 ? 2 : 1) ? '#FFD700' : 'transparent'}
                    />
                  ))}
                </View>
              </View>
              
              <View style={styles.winButtons}>
                <Pressable style={styles.restartButton} onPress={restartGame}>
                  <LinearGradient colors={['#A8EDEA', '#FED6E3']} style={styles.buttonGradient}>
                    <RotateCcw size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Play Again</Text>
                  </LinearGradient>
                </Pressable>
                
                <Pressable style={styles.backButton} onPress={() => router.back()}>
                  <LinearGradient colors={['#FF9A9E', '#FECFEF']} style={styles.buttonGradient}>
                    <ArrowLeft size={20} color="#FFFFFF" />
                    <Text style={styles.buttonText}>Back to Games</Text>
                  </LinearGradient>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FFF8DC', '#FFE4E1', '#E6E6FA']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.headerBackButton} onPress={() => router.back()}>
            <ArrowLeft size={24} color="#2C3E50" />
          </Pressable>
          <View style={styles.headerContent}>
            <Text style={styles.title}>🧩 Number Match Maze</Text>
            <Text style={styles.subtitle}>Match numbers to quantities!</Text>
          </View>
          <View style={styles.statsContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.movesText}>Moves: {moves}</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
            style={styles.instructionsCard}
          >
            <Text style={styles.instructionsText}>
              🔵 Blue cells: Number matches quantity (collect these!)
            </Text>
            <Text style={styles.instructionsText}>
              ⚪ Gray cells: Number doesn't match quantity
            </Text>
          </LinearGradient>
        </View>

        {/* Maze */}
        <View style={styles.mazeContainer}>
          {maze.map((row, y) => (
            <View key={y} style={styles.row}>
              {row.map((cell, x) => renderCell(cell, x, y))}
            </View>
          ))}
        </View>

        {/* Controls */}
        <View style={styles.controls}>
          <View style={styles.controlRow}>
            <Pressable style={styles.controlButton} onPress={() => movePlayer('up')}>
              <LinearGradient colors={['#3498DB', '#2980B9']} style={styles.controlGradient}>
                <Text style={styles.controlText}>↑</Text>
              </LinearGradient>
            </Pressable>
          </View>
          <View style={styles.controlRow}>
            <Pressable style={styles.controlButton} onPress={() => movePlayer('left')}>
              <LinearGradient colors={['#3498DB', '#2980B9']} style={styles.controlGradient}>
                <Text style={styles.controlText}>←</Text>
              </LinearGradient>
            </Pressable>
            <View style={styles.controlSpacer} />
            <Pressable style={styles.controlButton} onPress={() => movePlayer('right')}>
              <LinearGradient colors={['#3498DB', '#2980B9']} style={styles.controlGradient}>
                <Text style={styles.controlText}>→</Text>
              </LinearGradient>
            </Pressable>
          </View>
          <View style={styles.controlRow}>
            <Pressable style={styles.controlButton} onPress={() => movePlayer('down')}>
              <LinearGradient colors={['#3498DB', '#2980B9']} style={styles.controlGradient}>
                <Text style={styles.controlText}>↓</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </View>

        {/* Celebration Animation */}
        <Animated.View style={[styles.celebration, celebrationAnimatedStyle]}>
          <Text style={styles.celebrationText}>Great Match! +10 🌟</Text>
        </Animated.View>
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
  headerBackButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  scoreText: {
    fontSize: 16,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
  },
  movesText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#5D6D7E',
  },
  instructionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  instructionsCard: {
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  instructionsText: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  mazeContainer: {
    alignSelf: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    position: 'relative',
  },
  cellGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cellText: {
    fontSize: 10,
    fontFamily: 'Nunito-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  player: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  },
  playerEmoji: {
    fontSize: 20,
  },
  controls: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  controlButton: {
    borderRadius: 25,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  controlGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  controlText: {
    fontSize: 20,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
  },
  controlSpacer: {
    width: 60,
  },
  celebration: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  celebrationText: {
    fontSize: 18,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
  },
  winContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  winCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    width: '100%',
    maxWidth: 350,
  },
  winEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  winTitle: {
    fontSize: 28,
    fontFamily: 'Fredoka-Bold',
    color: '#2C3E50',
    marginBottom: 15,
    textAlign: 'center',
  },
  winText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#5D6D7E',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  winStats: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statText: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 10,
  },
  winButtons: {
    width: '100%',
    gap: 15,
  },
  restartButton: {
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  backButton: {
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 20,
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Fredoka-Bold',
    color: '#FFFFFF',
  },
});