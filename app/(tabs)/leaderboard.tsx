// app/(tabs)/leaderboard.tsx
import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LeaderboardScreen() {
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        style={styles.header}
      >
        <Text style={styles.title}>Leaderboard</Text>
      </LinearGradient>
      <View style={styles.content}>
        <Text style={[styles.text, isDark && styles.textLight]}>
          Leaderboard coming soon!
        </Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  textLight: {
    color: '#ffffff',
  },
});