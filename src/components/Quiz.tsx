import React, { useState, useEffect } from 'react';
import { Timer, Trophy, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface QuizProps {
  onClose: () => void;
}

export function Quiz({ onClose }: QuizProps) {
  const [category, setCategory] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const categories = [
    { id: '9', name: 'General Knowledge' },
    { id: '21', name: 'Sports' },
    { id: '23', name: 'History' },
    { id: '24', name: 'Politics' },
    { id: '25', name: 'Art' }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (category && questions.length > 0 && timeLeft > 0 && !showResult) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAnswer('');
            return 30;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [category, timeLeft, questions, showResult]);

  const fetchQuestions = async (categoryId: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://opentdb.com/api.php?amount=5&category=${categoryId}&type=multiple`
      );
      const data = await response.json();
      if (data.results) {
        setQuestions(data.results);
        setTimeLeft(30);
        setCurrentQuestion(0);
        setScore(0);
        setShowResult(false);
      }
    } catch (error) {
      toast.error('Failed to fetch questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId);
    fetchQuestions(categoryId);
  };

  const shuffleAnswers = (question: Question) => {
    return [...question.incorrect_answers, question.correct_answer]
      .sort(() => Math.random() - 0.5);
  };

  const handleAnswer = async (answer: string) => {
    const correct = answer === questions[currentQuestion].correct_answer;
    if (correct) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setTimeLeft(30);
    } else {
      setShowResult(true);
      try {
        await supabase.from('quiz_results').insert({
          user_id: user?.id,
          category: questions[0].category,
          score: score + (correct ? 1 : 0),
          total_questions: questions.length
        });
      } catch (error) {
        console.error('Failed to save quiz result:', error);
      }
    }
  };

  if (!category) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Choose a Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className="p-4 text-lg font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (showResult) {
    const passed = score >= 3;
    return (
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto text-center">
        {passed ? (
          <Trophy className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
        ) : (
          <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
        )}
        <h2 className="text-2xl font-bold mb-4">
          {passed ? 'Congratulations!' : 'Better luck next time!'}
        </h2>
        <p className="text-lg mb-6">
          You scored {score} out of {questions.length} questions
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setCategory('')}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Another Category
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const answers = shuffleAnswers(currentQ);

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-medium">
          Question {currentQuestion + 1}/{questions.length}
        </span>
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-indigo-600" />
          <span className="text-lg font-medium">{timeLeft}s</span>
        </div>
      </div>
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-2" 
            dangerouslySetInnerHTML={{ __html: currentQ.question }}>
        </h3>
        <p className="text-sm text-gray-600">Category: {currentQ.category}</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {answers.map((answer, index) => (
          <button
            key={index}
            onClick={() => handleAnswer(answer)}
            className="p-4 text-left border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-colors"
            dangerouslySetInnerHTML={{ __html: answer }}
          />
        ))}
      </div>
    </div>
  );
}