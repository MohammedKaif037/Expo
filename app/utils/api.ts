import { Question, Category, Difficulty } from '../types/quiz';

const API_KEY = '123456-abcdef-7890';
const API_BASE_URL = 'https://quizapi.io/api/v1';

export async function fetchQuestions(
  category: Category,
  difficulty: Difficulty,
  limit: number = 10
): Promise<Question[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/questions?apiKey=${API_KEY}&category=${category}&difficulty=${difficulty.toLowerCase()}&limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}