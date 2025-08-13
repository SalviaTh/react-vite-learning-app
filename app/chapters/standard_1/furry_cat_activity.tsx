import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Speech from "expo-speech";
import { Audio } from "expo-av"; // ✅ for playing sounds
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";

// Array of image-based questions
const QUESTIONS = [
  {
    image: require("../../../assets/images/cat_in_a_box.jpeg"),
    text: "Where is the cat?",
    answer: "in",
    options: ["on", "in", "under"],
    place: "the box",
    speak: "The cat is in the box",
  },
  {
    image: require("../../../assets/images/cat_on_a_table.png"),
    text: "Where is the cat?",
    answer: "on",
    options: ["on", "in", "under"],
    place: "the table",
    speak: "The cat is on the table",
  },
  {
    image: require("../../../assets/images/cat_under_a_table.jpeg"),
    text: "Where is the cat?",
    answer: "under",
    options: ["on", "in", "under"],
    place: "the table",
    speak: "The cat is under the table",
  },
  // ➕ Add more questions here...
];

export default function FurryCatActivity() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [dingSound, setDingSound] = useState();
  const [wrongSound, setWrongSound] = useState();

  useEffect(() => {
    loadSounds();
    speakQuestion();
    return () => {
      // unload sounds when leaving
      if (dingSound) dingSound.unloadAsync();
      if (wrongSound) wrongSound.unloadAsync();
    };
  }, [index]);

  const loadSounds = async () => {
    const ding = await Audio.Sound.createAsync(
      require("../../../assets/music/ding.mp3")
    );
    const wrong = await Audio.Sound.createAsync(
      require("../../../assets/music/wrong.mp3")
    );
    setDingSound(ding.sound);
    setWrongSound(wrong.sound);
  };

  const playSound = async (type) => {
    try {
      if (type === "correct" && dingSound) {
        await dingSound.replayAsync();
      } else if (type === "wrong" && wrongSound) {
        await wrongSound.replayAsync();
      }
    } catch (err) {
      console.log("Sound play error:", err);
    }
  };

  const speakQuestion = () => {
    Speech.stop();
    const q = QUESTIONS[index];
    const optionsText = q.options.join(", or ");
    Speech.speak(`${q.text} Is it ${optionsText} ${q.place}?`, {
      rate: 0.9,
      pitch: 1.2,
    });
  };

  const handleAnswer = (option) => {
    const currentQ = QUESTIONS[index];
    const isCorrect = option === currentQ.answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);
      playSound("correct");
      Speech.speak(
        `Correct! ${currentQ.speak || `The cat is ${currentQ.answer} ${currentQ.place}`}`,
        { rate: 0.9, pitch: 1.2 }
      );
    } else {
      playSound("wrong");
      Speech.speak(
        `Oops! ${currentQ.speak || `The cat is ${currentQ.answer} ${currentQ.place}`}`,
        { rate: 0.9, pitch: 1.2 }
      );
    }

    setTimeout(() => {
      if (index + 1 < QUESTIONS.length) {
        setIndex((prev) => prev + 1);
      } else {
        setFinished(true);
        Speech.speak(
          `Great job! Your score is ${score + (isCorrect ? 1 : 0)} out of ${QUESTIONS.length}`,
          { rate: 0.9, pitch: 1.2 }
        );
      }
    }, 4000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          onPress={() => {
            Speech.stop();
            router.back();
          }}
        >
          <ArrowLeft size={24} color="#2C3E50" />
        </Pressable>
        <Text style={styles.headerTitle}>Where is it?</Text>
        <Text style={styles.score}>Score: {score}</Text>
      </View>

      {/* Question Area */}
      {!finished ? (
        <>
          <View style={styles.imageContainer}>
            <Image source={QUESTIONS[index].image} style={styles.image} />
          </View>

          <View style={styles.controls}>
            <Text style={styles.questionText}>{QUESTIONS[index].text}</Text>
            {QUESTIONS[index].options.map((opt, idx) => (
              <Pressable
                key={idx}
                style={styles.button}
                onPress={() => handleAnswer(opt)}
              >
                <Text style={styles.buttonText}>{opt}</Text>
              </Pressable>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.finishContainer}>
          <Text style={styles.finishText}>
            🎉 All done! Your score: {score} / {QUESTIONS.length}
          </Text>
          <Pressable
            style={styles.button}
            onPress={() => {
              setScore(0);
              setIndex(0);
              setFinished(false);
            }}
          >
            <Text style={styles.buttonText}>Play Again 🔄</Text>
          </Pressable>
          <Pressable
            style={styles.buttonNext}
            onPress={() => {
                        router.push("/chapters/standard_1/furry_cat_activity_b");
                      }}
          >
            <Text style={styles.buttonText}>Play Next</Text>
          </Pressable>
        </View>
      )}
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
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#2C3E50" },
  score: { fontSize: 18, fontWeight: "bold", color: "#2C3E50" },

  imageContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: {
    width: "90%",
    height: "80%",
    resizeMode: "contain",
    borderRadius: 10,
  },

  controls: {
    padding: 20,
    backgroundColor: "#FFF8DC",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  questionText: { fontSize: 20, marginBottom: 15, fontWeight: "bold" },
  button: {
    backgroundColor: "#26cd4dff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    width: "80%",
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  buttonNext: { backgroundColor: "#ff9edbff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 5,
    width: "80%",},

  finishContainer: { alignItems: "center", padding: 20 },
  finishText: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
});
