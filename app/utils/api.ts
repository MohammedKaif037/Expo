import { Question, Category, Difficulty } from '../types/quiz';

const API_KEY = '  ';
const API_BASE_URL = 'https://quizapi.io/api/v1';

export async function fetchQuestions(
  category: Category,
  difficulty: Difficulty,
  limit: number = 10
): Promise<Question[]> {
  try {
    const url = `${API_BASE_URL}/questions?apiKey=${API_KEY}&category=${category}&difficulty=${difficulty.toLowerCase()}&limit=${limit}`;
    console.log('Fetching questions from:', url);

    const response = await fetch(url);
    console.log('Response status:', response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch questions. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data);

    // Validate the response data
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: Expected an array of questions');
    }

    // Check if the data has the expected structure
    if (data.length > 0 && !data[0].question) {
      throw new Error('Invalid response format: Missing required fields');
    }

    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}