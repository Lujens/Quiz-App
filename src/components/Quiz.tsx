import { useState, useEffect } from 'react';
import { fetchTriviaQuestions } from '../services/triviaApi';
import type { CategoryName, Difficulty, TriviaQuestion } from '../services/triviaApi';

interface QuizProps {
  category: CategoryName;
  difficulty: Difficulty;
  onFinish: (score: number, total: number) => void;
}

export default function Quiz({ category, difficulty, onFinish }: QuizProps) {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds per question
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  // Decode HTML entities (API returns encoded text)
  const decodeHTML = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  // Fetch questions on mount
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await fetchTriviaQuestions(category, difficulty, 10);
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
        setLoading(false);
      }
    };

    loadQuestions();
  }, [category, difficulty]);

  // Shuffle answers when question changes
  useEffect(() => {
    if (questions.length > 0 && questions[currentQuestionIndex]) {
      const currentQuestion = questions[currentQuestionIndex];
      const allAnswers = [
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer,
      ].sort(() => Math.random() - 0.5);
      setShuffledAnswers(allAnswers);
      setTimeLeft(15); // Reset timer for new question
    }
  }, [currentQuestionIndex, questions]);

  // Timer countdown
  useEffect(() => {
    if (showFeedback || loading || error) return; // Don't countdown when showing feedback

    if (timeLeft === 0) {
      // Time's up! Auto-select wrong answer
      setShowFeedback(true);
      setSelectedAnswer(null);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showFeedback, loading, error]);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => onFinish(0, 0)}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Back to Categories
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerClick = (answer: string) => {
    if (showFeedback) return; // Prevent clicking after answering

    setSelectedAnswer(answer);
    setShowFeedback(true);

    // Update score if correct
    if (answer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
  if (currentQuestionIndex < questions.length - 1) {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setTimeLeft(15); // Reset timer immediately
  } else {
    // Quiz finished
    onFinish(score + (selectedAnswer === currentQuestion.correct_answer ? 1 : 0), questions.length);
  }
};

  // Timer color based on time left
  const getTimerColor = () => {
    if (timeLeft > 10) return 'text-green-600';
    if (timeLeft > 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const timerPercentage = (timeLeft / 15) * 100;

  return (
    <div className="space-y-6">
      {/* Progress and Timer Bar */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </span>
        <div className="flex items-center gap-3">
          <span className={`text-2xl font-bold ${getTimerColor()}`}>
            {timeLeft}s
          </span>
          <span className="text-sm font-semibold text-blue-600">
            Score: {score}/{questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Timer Bar */}
      {!showFeedback && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>
      )}

      {/* Question */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <p className="text-sm text-blue-600 font-medium mb-2">
          {decodeHTML(currentQuestion.category)} • {currentQuestion.difficulty}
        </p>
        <h3 className="text-xl font-bold text-gray-800">
          {decodeHTML(currentQuestion.question)}
        </h3>
      </div>

      {/* Answers */}
      <div className="space-y-3">
        {shuffledAnswers.map((answer, index) => {
          const isSelected = selectedAnswer === answer;
          const isCorrect = answer === currentQuestion.correct_answer;
          const showCorrect = showFeedback && isCorrect;
          const showIncorrect = showFeedback && isSelected && !isCorrect;
          const showCorrectWhenTimeout = showFeedback && !selectedAnswer && isCorrect;

          return (
            <button
              key={index}
              onClick={() => handleAnswerClick(answer)}
              disabled={showFeedback}
              className={`w-full p-4 text-left rounded-lg font-medium transition-all ${
                showCorrect || showCorrectWhenTimeout
                  ? 'bg-green-500 text-white'
                  : showIncorrect
                  ? 'bg-red-500 text-white'
                  : isSelected
                  ? 'bg-blue-100 border-2 border-blue-500'
                  : 'bg-gray-100 hover:bg-gray-200 border-2 border-transparent'
              } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {decodeHTML(answer)}
            </button>
          );
        })}
      </div>

      {/* Feedback Message */}
      {showFeedback && !selectedAnswer && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <p className="text-red-700 font-medium">⏱️ Time's up! The correct answer is highlighted above.</p>
        </div>
      )}

      {/* Next Button */}
      {showFeedback && (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      )}
    </div>
  );
}
