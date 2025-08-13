import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, PanResponder, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { router } from "expo-router"; // For navigation

const { width } = Dimensions.get("window");

const CELL = 22;
const BOARD_MARGIN = 16;
const BOARD_SIZE = Math.min(width - BOARD_MARGIN * 2, 360);
const GRID_W = Math.floor(BOARD_SIZE / CELL);
const GRID_H = Math.floor((BOARD_SIZE / CELL) * 1.25);
const BOARD_W = GRID_W * CELL;
const BOARD_H = GRID_H * CELL;

const TICK_MS = 150;
const COLORS = ["red", "blue", "green", "yellow", "purple", "orange"];
const BALL_COUNT = 6;

export default function ColorSnakeGame() {
  const [snakeRender, setSnakeRender] = useState([{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }]);
  const [ballsRender, setBallsRender] = useState([]);
  const [score, setScore] = useState(0);
  const [targetColor, setTargetColor] = useState(randomColor());
  const [running, setRunning] = useState(true);
  const [popup, setPopup] = useState(null); // "win" | "lose" | null

  const snakeRef = useRef(snakeRender);
  const ballsRef = useRef([]);
  const dirRef = useRef({ x: 1, y: 0 });
  const nextDirRef = useRef({ x: 1, y: 0 });
  const tickRef = useRef(null);
  const scoreRef = useRef(0);
  const targetRef = useRef(targetColor);

  const dingSound = useRef(null);
  const wrongSound = useRef(null);

  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }
  function randomColor() {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  function randomEmptyCell(occupied) {
    let x, y, tries = 0;
    do {
      x = randomInt(GRID_W);
      y = randomInt(GRID_H);
      tries++;
      if (tries > 200) break;
    } while (occupied.some(p => p.x === x && p.y === y));
    return { x, y };
  }

  function ensureBalls(snake, target) {
    const occupied = snake;
    const balls = [];
    balls.push({ ...randomEmptyCell(occupied), color: target });
    while (balls.length < BALL_COUNT) {
      balls.push({ ...randomEmptyCell([...occupied, ...balls]), color: randomColor() });
    }
    return balls;
  }

  useEffect(() => {
    (async () => {
      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      dingSound.current = new Audio.Sound();
      wrongSound.current = new Audio.Sound();
      await dingSound.current.loadAsync(require("../../../assets/music/ding.mp3"));
      await wrongSound.current.loadAsync(require("../../../assets/music/wrong.mp3"));
    })();
    return () => {
      if (dingSound.current) dingSound.current.unloadAsync();
      if (wrongSound.current) wrongSound.current.unloadAsync();
    };
  }, []);

  useEffect(() => {
    const initialBalls = ensureBalls(snakeRef.current, targetRef.current);
    ballsRef.current = initialBalls;
    setBallsRender(initialBalls);

    speakTarget(targetRef.current);
    startLoop();
    return stopLoop;
  }, []);

  useEffect(() => { snakeRef.current = snakeRender; }, [snakeRender]);
  useEffect(() => { scoreRef.current = score; }, [score]);
  useEffect(() => { targetRef.current = targetColor; }, [targetColor]);

  const startLoop = () => {
    if (tickRef.current) return;
    tickRef.current = setInterval(tick, TICK_MS);
  };
  const stopLoop = () => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
  };

  const tick = () => {
    if (!running || popup) return;

    dirRef.current = nextDirRef.current;

    const snake = [...snakeRef.current];
    const head = { x: snake[0].x + dirRef.current.x, y: snake[0].y + dirRef.current.y };

    if (head.x < 0) head.x = GRID_W - 1;
    if (head.x >= GRID_W) head.x = 0;
    if (head.y < 0) head.y = GRID_H - 1;
    if (head.y >= GRID_H) head.y = 0;

    if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
      endGame("lose", "Oops! You bumped into yourself.");
      return;
    }

    snake.unshift(head);

    const balls = [...ballsRef.current];
    const hitIndex = balls.findIndex(b => b.x === head.x && b.y === head.y);
    if (hitIndex !== -1) {
      const hit = balls[hitIndex];
      if (hit.color === targetRef.current) {
        dingSound.current && dingSound.current.replayAsync();
        const newScore = scoreRef.current + 1;
        setScore(newScore);

        if (newScore >= 10) {
          endGame("win", "🎉 You win! Great job!");
          return;
        }

        const newTarget = randomColor();
        setTargetColor(newTarget);
        speakTarget(newTarget);

        balls.splice(hitIndex, 1);
        balls.push({ ...randomEmptyCell([...snake, ...balls]), color: randomColor() });
      } else {
        wrongSound.current && wrongSound.current.replayAsync();
        const newScore = Math.max(0, scoreRef.current - 1);
        setScore(newScore);

        snake.pop(); // shrink

        if (snake.length === 0) {
          endGame("lose", "Oh no! The snake is gone.");
          return;
        }

        balls.splice(hitIndex, 1);
        balls.push({ ...randomEmptyCell([...snake, ...balls]), color: randomColor() });
      }
    } else {
      snake.pop();
    }

    if (!balls.some(b => b.color === targetRef.current)) {
      balls[Math.floor(Math.random() * balls.length)].color = targetRef.current;
    }

    ballsRef.current = balls;
    setBallsRender(balls);
    setSnakeRender(snake);
  };

  function speakTarget(color) {
    Speech.stop();
    Speech.speak(`Eat the ${color} ball!`, { rate: 0.9, pitch: 1.2 });
  }

  function endGame(type, message) {
    setPopup(type); // "win" or "lose"
    setRunning(false);
    Speech.stop();
    Speech.speak(message, { rate: 0.95 });
    stopLoop();
  }

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 8 || Math.abs(g.dy) > 8,
      onPanResponderMove: (_, g) => {
        const { dx, dy } = g;
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);
        const cur = dirRef.current;
        if (absX > absY) {
          if (dx > 0 && !(cur.x === -1 && cur.y === 0)) nextDirRef.current = { x: 1, y: 0 };
          else if (dx < 0 && !(cur.x === 1 && cur.y === 0)) nextDirRef.current = { x: -1, y: 0 };
        } else {
          if (dy > 0 && !(cur.x === 0 && cur.y === -1)) nextDirRef.current = { x: 0, y: 1 };
          else if (dy < 0 && !(cur.x === 0 && cur.y === 1)) nextDirRef.current = { x: 0, y: -1 };
        }
      },
    })
  ).current;

  const onRestart = () => {
  stopLoop(); // stop any old loop

  const startSnake = [{ x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }];
  const startTarget = randomColor();

  // Reset refs
  snakeRef.current = startSnake;
  dirRef.current = { x: 1, y: 0 };
  nextDirRef.current = { x: 1, y: 0 };
  scoreRef.current = 0;
  targetRef.current = startTarget;

  // Reset state
  setSnakeRender(startSnake);
  setScore(0);
  setTargetColor(startTarget);
  setPopup(null);
  setRunning(true);
  setGameOver(false);

  // Reset balls
  const bs = ensureBalls(startSnake, startTarget);
  ballsRef.current = bs;
  setBallsRender(bs);

  // Speak and start fresh loop
  speakTarget(startTarget);

  // ✅ Restart loop immediately
  startLoop();
};



  const goToNextActivity = () => {
    router.push("/next-activity"); // change route to your next activity
  };

  return (
    <SafeAreaView style={styles.safe} {...panResponder.panHandlers}>
      <View style={styles.topBar}>
        <Text style={styles.score}>Score: {score}</Text>
        <View style={styles.targetWrap}>
          <Text style={styles.targetText}>🎯 Target:</Text>
          <View style={[styles.swatch, { backgroundColor: targetColor }]} />
          <Text style={styles.targetName}>{targetColor}</Text>
        </View>
      </View>

      <View style={styles.board}>
        {ballsRender.map((b, idx) => (
          <View
            key={`ball-${idx}`}
            style={{
              position: "absolute",
              width: CELL - 4,
              height: CELL - 4,
              left: b.x * CELL + 2,
              top: b.y * CELL + 2,
              borderRadius: (CELL - 4) / 2,
              backgroundColor: b.color,
            }}
          />
        ))}
        {snakeRender.map((seg, i) => (
          <View
            key={`s-${i}`}
            style={{
              position: "absolute",
              width: CELL - 2,
              height: CELL - 2,
              left: seg.x * CELL + 1,
              top: seg.y * CELL + 1,
              borderRadius: (CELL - 2) / 2,
              backgroundColor: i === 0 ? "#222" : "#32CD32",
              borderWidth: i === 0 ? 1 : 0,
              borderColor: i === 0 ? "#111" : "transparent",
            }}
          />
        ))}

        {popup && (
          <View style={styles.overlay}>
            <Text style={styles.overTitle}>
              {popup === "win" ? "🎉 You Win!" : "Game Over"}
            </Text>
            <Text style={styles.overSub}>Score: {score}</Text>
            {popup === "win" && (
              <Pressable style={styles.btn} onPress={goToNextActivity}>
                <Text style={styles.btnText}>Play Next ▶</Text>
              </Pressable>
            )}
            <Pressable style={styles.btn} onPress={onRestart}>
              <Text style={styles.btnText}>Restart 🔄</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF8DC", alignItems: "center", paddingTop: 8 },
  topBar: { width: "100%", paddingHorizontal: 16, marginBottom: 6 },
  score: { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },
  targetWrap: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  targetText: { fontSize: 16, color: "#2C3E50", marginRight: 6 },
  swatch: { width: 18, height: 18, borderRadius: 9, borderWidth: 1, borderColor: "#333", marginRight: 6 },
  targetName: { fontSize: 16, fontWeight: "600", color: "#2C3E50" },
  board: {
    width: BOARD_W,
    height: BOARD_H,
    backgroundColor: "#f2f2f2",
    borderWidth: 2,
    borderColor: "#333",
    borderRadius: 8,
    overflow: "hidden",
  },
  btn: {
    backgroundColor: "#FFE4E1",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#f0b7b7",
    marginTop: 6,
  },
  btnText: { fontWeight: "700", color: "#2C3E50" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  overTitle: { color: "white", fontSize: 28, fontWeight: "800", marginBottom: 6 },
  overSub: { color: "white", fontSize: 18, marginBottom: 12 },
});
