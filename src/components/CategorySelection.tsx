import { CATEGORIES } from '../services/triviaApi';
import type { CategoryName, Difficulty } from '../services/triviaApi';

interface CategorySelectionProps {
  onStartQuiz: (category: CategoryName, difficulty: Difficulty) => void;
}

export default function CategorySelection({ onStartQuiz }: CategorySelectionProps) {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  
  const handleSelection = (category: CategoryName, difficulty: Difficulty) => {
    onStartQuiz(category, difficulty);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Choose Your Quiz</h2>
      
      {Object.keys(CATEGORIES).map((category) => (
        <div key={category} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg text-gray-700 mb-3">{category}</h3>
          <div className="flex gap-2 flex-wrap">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => handleSelection(category as CategoryName, difficulty)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  difficulty === 'easy'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : difficulty === 'medium'
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
