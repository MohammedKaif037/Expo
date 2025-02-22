export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type Category = 'Linux' | 'Programming' | 'General Knowledge' | 'Science';

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  question: string;
  description: string | null;
  answers: {
    answer_a: string | null;
    answer_b: string | null;
    answer_c: string | null;
    answer_d: string | null;
    answer_e: string | null;
    answer_f: string | null;
  };
  multiple_correct_answers: string;
  correct_answers: {
    answer_a_correct: string;
    answer_b_correct: string;
    answer_c_correct: string;
    answer_d_correct: string;
    answer_e_correct: string;
    answer_f_correct: string;
  };
  explanation: string | null;
  tip: string | null;
  category: string;
  difficulty: Difficulty;
}

export interface QuizSettings {
  category: Category;
  difficulty: Difficulty;
  timeLimit: number; // in seconds
}

export interface UserProgress {
  totalQuizzes: number;
  correctAnswers: number;
  incorrectAnswers: number;
  streak: number;
  lastQuizDate: string;
}