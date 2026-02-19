import { useState } from 'react';
import CategorySelection from './components/CategorySelection';
import type { CategoryName, Difficulty } from './services/triviaApi';

function App() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryName | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  const handleStartQuiz = (category: CategoryName, difficulty: Difficulty) => {
    setSelectedCategory(category);
    setSelectedDifficulty(difficulty);
    setQuizStarted(true);
    console.log('🎮 Starting quiz:', category, difficulty);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Quiz App
        </h1>
        
        {!quizStarted ? (
          <CategorySelection onStartQuiz={handleStartQuiz} />
        ) : (
          <div className="text-center">
            <p className="text-xl text-gray-700">
              Starting {selectedCategory} quiz on {selectedDifficulty} difficulty...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
