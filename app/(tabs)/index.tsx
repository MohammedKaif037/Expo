import { View, Text, StyleSheet, useColorScheme, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <LinearGradient
        colors={['#2563eb', '#1d4ed8']}
        style={styles.header}
      >
        <Text style={styles.title}>QuizMaster Pro</Text>
        <Text style={styles.subtitle}>Test your knowledge</Text>
      </LinearGradient>

      <View style={styles.categories}>
        <Text style={[styles.sectionTitle, isDark && styles.textLight]}>
          Categories
        </Text>
        <View style={styles.grid}>
          {['Linux', 'Programming', 'General Knowledge', 'Science'].map((category) => (
            <Link
              key={category}
              href={{
                pathname: '/quiz',
                params: { category },
              }}
              asChild
            >
              <Pressable style={[styles.categoryCard, isDark && styles.cardDark]}>
                <Ionicons
                  name={getCategoryIcon(category)}
                  size={32}
                  color="#2563eb"
                />
                <Text style={[styles.categoryText, isDark && styles.textLight]}>
                  {category}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>
      </View>
    </View>
  );
}

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'Linux':
      return 'logo-tux';
    case 'Programming':
      return 'code-slash';
    case 'General Knowledge':
      return 'book';
    case 'Science':
      return 'flask';
    default:
      return 'help-circle';
  }
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 8,
  },
  categories: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1a1a1a',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#2a2a2a',
  },
  categoryText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  textLight: {
    color: '#ffffff',
  },
});