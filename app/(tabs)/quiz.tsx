import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
  Alert,
  useColorScheme,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question, Answer, Difficulty, Category } from '../types/quiz';
import { fetchQuestions } from '../utils/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function QuizScreen() {
  const { category } = useLocalSearchParams<{ category: Category }>();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    loadQuestions();
  }, [category]);

  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && questions.length > 0) {
      handleTimeUp();
    }
  }, [timeLeft, questions]);

  const loadQuestions = async () => {
    try {
      const cachedQuestions = await AsyncStorage.getItem(`quiz_${category}`);
      if (cachedQuestions) {
        setQuestions(JSON.parse(cachedQuestions));
        setIsLoading(false);
        return;
      }

      const fetchedQuestions = await fetchQuestions(category, 'Medium', 10);
      await AsyncStorage.setItem(`quiz_${category}`, JSON.stringify(fetchedQuestions));
      setQuestions(fetchedQuestions);
    } catch (err) {
      setError('Failed to load questions. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeUp = async () => {
    await saveProgress(false);
    Alert.alert('Time Up!', 'You ran out of time for this question.');
    nextQuestion();
  };

  const saveProgress = async (isCorrect: boolean) => {
    try {
      const progress = await AsyncStorage.getItem('userProgress');
      const currentProgress = progress ? JSON.parse(progress) : {
        totalQuizzes: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        streak: 0,
        lastQuizDate: new Date().toISOString(),
      };

      if (isCorrect) {
        currentProgress.correctAnswers += 1;
        currentProgress.streak += 1;
      } else {
        currentProgress.incorrectAnswers += 1;
        currentProgress.streak = 0;
      }

      await AsyncStorage.setItem('userProgress', JSON.stringify(currentProgress));
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  const handleAnswer = async (answerKey: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = currentQuestion.correct_answers[`${answerKey}_correct`] === 'true';
    
    await saveProgress(isCorrect);
    setSelectedAnswers([...selectedAnswers, answerKey]);
    
    setTimeout(() => {
      nextQuestion();
    }, 1000);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
    } else {
      Alert.alert('Quiz Complete', 'You have completed all questions!');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, isDark && styles.containerDark]}>
        <Text style={[styles.errorText, isDark && styles.textLight]}>{error}</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answers = Object.entries(currentQuestion?.answers || {})
    .filter(([_, value]) => value !== null)
    .map(([key, value]) => ({
      key,
      text: value as string,
    }));

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        style={styles.header}
      >
        <Text style={styles.category}>{category}</Text>
        <Text style={styles.timer}>Time Left: {timeLeft}s</Text>
      </LinearGradient>

      <View style={styles.questionContainer}>
        <Text style={[styles.questionText, isDark && styles.textLight]}>
          {currentQuestion?.question}
        </Text>
        
        <View style={styles.answersContainer}>
          {answers.map(({ key, text }) => (
            <Pressable
              key={key}
              style={[
                styles.answerButton,
                isDark && styles.answerButtonDark,
                selectedAnswers.includes(key) && styles.selectedAnswer,
              ]}
              onPress={() => handleAnswer(key)}
            >
              <Text style={[
                styles.answerText,
                isDark && styles.textLight,
                selectedAnswers.includes(key) && styles.selectedAnswerText,
              ]}>
                {text}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    padding: 32,
    paddingTop: 64,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  category: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  timer: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 8,
  },
  questionContainer: {
    padding: 20,
    flex: 1,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
    color: '#1a1a1a',
  },
  answersContainer: {
    gap: 12,
  },
  answerButton: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  answerButtonDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#404040',
  },
  selectedAnswer: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  answerText: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  textLight: {
    color: '#ffffff',
  },
  selectedAnswerText: {
    color: '#ffffff',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
});