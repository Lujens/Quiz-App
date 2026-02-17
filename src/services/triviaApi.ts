// TypeScript interfaces for API responses
export interface TriviaQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface TriviaApiResponse {
  response_code: number;
  results: TriviaQuestion[];
}

// Categories available in Open Trivia Database
export const CATEGORIES = {
  'General Knowledge': 9,
  'Science & Nature': 17,
  'Computers': 18,
  'Mathematics': 19,
  'Sports': 21,
  'Geography': 22,
  'History': 23,
  'Animals': 27,
};

export type CategoryName = keyof typeof CATEGORIES;

// Difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// Fetch questions from Open Trivia Database
export const fetchTriviaQuestions = async (
  category: CategoryName,
  difficulty: Difficulty,
  amount: number = 10
): Promise<TriviaQuestion[]> => {
  const categoryId = CATEGORIES[category];
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`;

  console.log('🔍 Fetching from:', url);

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: TriviaApiResponse = await response.json();
    console.log('📦 API Response:', data);

    if (data.response_code !== 0) {
      throw new Error(`API Error Code: ${data.response_code}`);
    }

    return data.results;
  } catch (error) {
    console.error('❌ Error details:', error);
    throw error;
  }
};
