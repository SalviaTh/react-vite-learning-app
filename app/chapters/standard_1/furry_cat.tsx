import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  Pressable,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export default function FurryCat() {
  const poem = [
    "Looking, looking, looking!! ",
    "Looking for my furry cat!",
    "Are you sitting on the window shed?",
    "Are you sleeping under my bed?",
    "Where are you my furry cat?",
    "Looking, looking, looking ",
    "Looking for my furry cat!",
    "Are you inside the backpack?",
    "Are you outside the red rack?",
    "Where are you my furry cat?",
    "Saw you hiding below the mat, here comes my furry cat!",
    "Come, come, come, come to me my furry cat!",
    "Saw you hopping above the hat.",
    "Come, come, come, come to me my furry cat!",
    "Saw you scratching the bottom of my jar.",
    "Saw you playing at the top of my car.",
    "Come to me, my furry cat!",
  ];

  const [currentLine, setCurrentLine] = useState(-1);
  const [introline, setIntroline] = useState(false);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);

  const isReadingRef = useRef(false);
  const timerRef = useRef(null);
  const scrollRef = useRef(null);
  const linePositions = useRef({});

  const fadeAnim = useSharedValue(1);
  const fadeStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  const estimateDuration = (text, rate = 0.8) => {
    const words = text.split(/\s+/).length;
    return Math.max((words * 400) / rate, 1000);
  };

  const scrollToLine = (index) => {
    const y = linePositions.current[index];
    if (y !== undefined && scrollRef.current) {
      const screenCenter = 300;
      scrollRef.current.scrollTo({
        y: y - screenCenter,
        animated: true,
      });
    }
  };

  const startReading = () => {
    stopReadingCompletely();
    isReadingRef.current = true;
    setPaused(false);
    setFinished(false);
    fadeAnim.value = withTiming(1, { duration: 300 });

    let i = 0;
    const readNext = () => {
      if (!isReadingRef.current || i >= poem.length) {
        stopReadingCompletely();
        fadeAnim.value = withTiming(0, { duration: 800 });
        setFinished(true);
        return;
      }

      setCurrentLine(i);
      scrollToLine(i);
      Speech.stop();
      Speech.speak(poem[i], { rate: 0.4, pitch: 1.3 });

      const duration = estimateDuration(poem[i], 0.7) + 300;
      timerRef.current = setTimeout(() => {
        i++;
        readNext();
      }, duration);
    };

    readNext();
  };

  const pauseOrResumeReading = () => {
    if (!paused) {
      isReadingRef.current = false;
      Speech.stop();
      clearTimeout(timerRef.current);
      setPaused(true);
    } else {
      isReadingRef.current = true;
      setPaused(false);

      let i = currentLine;
      const readNext = () => {
        if (!isReadingRef.current || i >= poem.length) {
          stopReadingCompletely();
          fadeAnim.value = withTiming(0, { duration: 800 });
          setFinished(true);
          return;
        }

        setCurrentLine(i);
        scrollToLine(i);
        Speech.stop();
        Speech.speak(poem[i], { rate: 0.4, pitch: 1.3 });

        const duration = estimateDuration(poem[i], 0.7) + 300;
        timerRef.current = setTimeout(() => {
          i++;
          readNext();
        }, duration);
      };

      readNext();
    }
  };

  const stopReadingCompletely = () => {
    isReadingRef.current = false;
    Speech.stop();
    clearTimeout(timerRef.current);
    setCurrentLine(-1);
    setPaused(false);
  };

  useEffect(() => {
    if (!introline) {
      Speech.speak("Sing the Poem Along", {
        rate: 0.8,
        pitch: 2,
        onDone: () => {
          setIntroline(true);
          setTimeout(() => {
            startReading();
          }, 1000);
        },
      });
    }
    return stopReadingCompletely;
  }, []);
  useEffect(() => {
  if (finished) {
    const finishMessage = `Yayy Congratulation! You finished the poem! Press Restart to read it again  or Next for more exciting games!`;
    Speech.speak(finishMessage, { rate: 0.9, pitch: 2 });
  } else {
    Speech.stop(); // stop if finishing resets or restarts
  }
}, [finished]);


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            stopReadingCompletely();
            router.back();
          }}
        >
          <ArrowLeft size={24} color="#2C3E50" />
        </Pressable>
        <Text style={styles.headerTitle}>Finding the Furry Cat!</Text>
      </View>

      {/* Poem Area */}
      <ImageBackground
        source={require("../../../assets/images/furry_cat_bg.jpeg")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {!finished && (
          <AnimatedScrollView
            contentContainerStyle={styles.scrollContent}
            style={fadeStyle}
            ref={scrollRef}
          >
            <View style={styles.poemPanel}>
              {poem.map((line, i) => (
                <Text
                  key={i}
                  onLayout={(e) =>
                    (linePositions.current[i] = e.nativeEvent.layout.y)
                  }
                  style={[
                    styles.poemLine,
                    i === currentLine && styles.highlightedLine,
                  ]}
                >
                  {line}
                </Text>
              ))}
            </View>
          </AnimatedScrollView>
        )}

        {finished && (
          <View style={styles.finishContainer}>
            <Text style={styles.finishMessage}>
              🎉 Yay! You finished the poem!{"\n"}Press Restart to read it
              again{"\n"}or Next for more exciting games!
            </Text>
          </View>
        )}
      </ImageBackground>

      {/* Controls */}
      <View style={styles.controls}>
        <Button title="🔄 Restart" onPress={startReading} />
        {!finished && (
          <Button
            title={paused ? "▶️ Resume" : "⏹ Stop"}
            onPress={pauseOrResumeReading}
            color={paused ? "#28a745" : "#d9534f"}
          />
        )}
        <Button
          title="Next ➡️"
          onPress={() => {
            stopReadingCompletely();
            router.push("/chapters/standard_1/furry_cat_activity");
          }}
        />
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF8DC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFE4E1",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#2C3E50" },

  backgroundImage: { flex: 1, width: "100%" },
  scrollContent: { padding: 20, flexGrow: 1, justifyContent: "center" },
  poemPanel: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 12,
    padding: 20,
  },
  poemLine: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: "center",
    color: "#2C3E50",
    lineHeight: 32,
  },
  highlightedLine: {
    fontSize: 30,
    color: "#2C3E50",
    fontWeight: "bold",
    backgroundColor: "rgba(255, 215, 0, 0.3)",
    borderRadius: 6,
    paddingHorizontal: 6,
  },
  finishContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  finishMessage: {
    textAlign: "center",
    color: "#2C3E50",
    fontSize: 18,
    fontWeight: "bold",
    backgroundColor: "#FFF3CD",
    padding: 16,
    borderRadius: 12,
    lineHeight: 24,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#FFF8DC",
  },
});
