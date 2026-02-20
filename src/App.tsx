import { useState } from 'react';
import CategorySelection from './components/CategorySelection';
import Quiz from './components/Quiz';
import type { CategoryName, Difficulty } from './services/triviaApi';

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [finalScore, setFinalScore] = useState({ score: 0, total: 0 });

  const handleStartQuiz = (category: CategoryName, difficulty: Difficulty) => {
    setSelectedCategory(category);
    setSelectedDifficulty(difficulty);
    setQuizStarted(true);
    setQuizFinished(false);
  };

  const handleFinishQuiz = (score: number, total: number) => {
    setFinalScore({ score, total });
    setQuizFinished(true);
  };

  const handleRestart = () => {
    setQuizStarted(false);
    setQuizFinished(false);
    setSelectedCategory(null);
    setSelectedDifficulty(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Quiz App
        </h1>
        
        {!quizStarted ? (
          <CategorySelection onStartQuiz={handleStartQuiz} />
        ) : quizFinished ? (
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Quiz Complete!</h2>
            <div className="bg-blue-50 p-8 rounded-lg">
              <p className="text-6xl font-bold text-blue-600 mb-2">
                {finalScore.score}/{finalScore.total}
              </p>
              <p className="text-xl text-gray-700">
                {finalScore.score / finalScore.total >= 0.8
                  ? '🎉 Excellent work!'
                  : finalScore.score / finalScore.total >= 0.6
                  ? '👍 Good job!'
                  : '💪 Keep practicing!'}
              </p>
            </div>
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Take Another Quiz
            </button>
          </div>
        ) : (
          selectedCategory && selectedDifficulty && (
            <Quiz
              category={selectedCategory}
              difficulty={selectedDifficulty}
              onFinish={handleFinishQuiz}
            />
          )
        )}
      </div>
    </div>
  );
}

export default App;
