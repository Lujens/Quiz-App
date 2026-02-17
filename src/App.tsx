import { useEffect } from 'react';
import { fetchTriviaQuestions } from './services/triviaApi';

function App() {
  useEffect(() => {
    // Test API call
    fetchTriviaQuestions('Science & Nature', 'easy', 5)
      .then(questions => {
        console.log('✅ API Test Success:', questions);
      })
      .catch(error => {
        console.error('❌ API Test Failed:', error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Quiz App
        </h1>
        <p className="text-center text-gray-600">
          Test your knowledge with trivia questions!
        </p>
        <p className="text-center text-sm text-gray-500 mt-4">
          (Check browser console for API test)
        </p>
      </div>
    </div>
  );
}

export default App;
