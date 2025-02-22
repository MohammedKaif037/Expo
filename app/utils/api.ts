import { Question, Category, Difficulty } from '../types/quiz';

const API_KEY = '  ';
const API_BASE_URL = 'https://quizapi.io/api/v1';

export async function fetchQuestions(
  category: Category,
  difficulty: Difficulty = 'Medium', // Add default value
  limit: number = 10
): Promise<Question[]> {
  try {
    const cleanApiKey = API_KEY.trim();
    const url = `${API_BASE_URL}/questions?apiKey=${cleanApiKey}&category=${category}&difficulty=${difficulty.toLowerCase()}&limit=${limit}`;
    
    console.log('Fetching questions from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch questions. Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

// Add default export
export default {
  fetchQuestions,
};