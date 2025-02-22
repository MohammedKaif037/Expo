import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { UserProgress } from '../types/quiz';

export default function ProfileScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const isDark = useColorScheme() === 'dark';

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('userProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (err) {
      console.error('Error loading progress:', err);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProgress();
    setRefreshing(false);
  };

  const calculateAccuracy = () => {
    if (!progress) return 0;
    const total = progress.correctAnswers + progress.incorrectAnswers;
    return total > 0 ? Math.round((progress.correctAnswers / total) * 100) : 0;
  };

  const getLastActive = () => {
    if (!progress?.lastQuizDate) return 'Never';
    const lastDate = new Date(progress.lastQuizDate);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  return (
    <ScrollView 
      style={[styles.container, isDark && styles.containerDark]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        style={styles.header}
      >
        <View style={styles.profileIcon}>
          <Ionicons name="person-circle" size={80} color="#ffffff" />
        </View>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Keep learning and improving!</Text>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={[styles.statCard, isDark && styles.cardDark]}>
            <Ionicons name="checkmark-circle" size={24} color="#2563eb" />
            <Text style={[styles.statValue, isDark && styles.textLight]}>
              {progress?.correctAnswers || 0}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.textLightSecondary]}>
              Correct Answers
            </Text>
          </View>

          <View style={[styles.statCard, isDark && styles.cardDark]}>
            <Ionicons name="close-circle" size={24} color="#ef4444" />
            <Text style={[styles.statValue, isDark && styles.textLight]}>
              {progress?.incorrectAnswers || 0}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.textLightSecondary]}>
              Incorrect Answers
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, isDark && styles.cardDark]}>
            <Ionicons name="flame" size={24} color="#f59e0b" />
            <Text style={[styles.statValue, isDark && styles.textLight]}>
              {progress?.streak || 0}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.textLightSecondary]}>
              Current Streak
            </Text>
          </View>

          <View style={[styles.statCard, isDark && styles.cardDark]}>
            <Ionicons name="analytics" size={24} color="#10b981" />
            <Text style={[styles.statValue, isDark && styles.textLight]}>
              {calculateAccuracy()}%
            </Text>
            <Text style={[styles.statLabel, isDark && styles.textLightSecondary]}>
              Accuracy
            </Text>
          </View>
        </View>

        <View style={[styles.lastActiveCard, isDark && styles.cardDark]}>
          <View style={styles.lastActiveHeader}>
            <Ionicons name="time" size={24} color="#6366f1" />
            <Text style={[styles.lastActiveTitle, isDark && styles.textLight]}>
              Last Active
            </Text>
          </View>
          <Text style={[styles.lastActiveValue, isDark && styles.textLight]}>
            {getLastActive()}
          </Text>
        </View>
      </View>
    </ScrollView>
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
    alignItems: 'center',
  },
  profileIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 4,
  },
  statsContainer: {
    padding: 16,
    gap: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#2a2a2a',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
    textAlign: 'center',
  },
  textLight: {
    color: '#ffffff',
  },
  textLightSecondary: {
    color: '#94a3b8',
  },
  lastActiveCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lastActiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lastActiveTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  lastActiveValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 8,
  },
});