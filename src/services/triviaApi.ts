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

// Simple in-memory cache to avoid hitting rate limits during development
const cache: { [key: string]: TriviaQuestion[] } = {};
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 5000; // 5 seconds between requests

// Fetch questions from Open Trivia Database
export const fetchTriviaQuestions = async (
  category: CategoryName,
  difficulty: Difficulty,
  amount: number = 10
): Promise<TriviaQuestion[]> => {
  const cacheKey = `${category}-${difficulty}-${amount}`;
  
  // Check cache first
  if (cache[cacheKey]) {
    console.log('📦 Using cached questions');
    return cache[cacheKey];
  }

  // Enforce minimum time between requests
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
    console.log(`⏳ Waiting ${waitTime}ms to avoid rate limit...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }

  const categoryId = CATEGORIES[category];
  const url = `https://opentdb.com/api.php?amount=${amount}&category=${categoryId}&difficulty=${difficulty}&type=multiple`;

  try {
    lastRequestTime = Date.now();
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Too many requests. Please wait 5 seconds and try again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: TriviaApiResponse = await response.json();

    if (data.response_code !== 0) {
      const errorMessages: { [key: number]: string } = {
        1: 'Not enough questions available for this category/difficulty.',
        2: 'Invalid parameters provided.',
        3: 'Session token not found.',
        4: 'Session token has returned all questions.',
      };
      throw new Error(errorMessages[data.response_code] || `API Error Code: ${data.response_code}`);
    }

    // Cache the results
    cache[cacheKey] = data.results;
    
    return data.results;
  } catch (error) {
    console.error('❌ Error details:', error);
    throw error;
  }
};
