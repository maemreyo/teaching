'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FillBlankQuestion } from '@/hooks/useExerciseGenerator';

interface VocabularyFillBlanksProps {
  questions: FillBlankQuestion[];
  onAnswer: (questionId: string, answer: string) => void;
  userAnswers: Record<string, any>;
}

export default function VocabularyFillBlanks({ 
  questions, 
  onAnswer, 
  userAnswers 
}: VocabularyFillBlanksProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [showResult, setShowResult] = useState(false);
  
  const question = questions[currentQuestion];

  const handleSubmit = () => {
    onAnswer(question.id, userInput);
    setShowResult(true);
  };

  const isCorrect = userInput.toLowerCase().trim() === question.answer.toLowerCase();

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Complete the sentence:
        </h3>
        <p className="text-lg text-gray-700 mb-2">
          {question.sentence.replace('_______', '_______ ')}
        </p>
        <p className="text-sm text-blue-600">
          Translation: {question.translation}
        </p>
        {question.hint && (
          <p className="text-sm text-gray-500 mt-2">
            💡 Hint: {question.hint}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your answer here..."
            className="text-lg p-4"
            disabled={showResult}
          />
        </div>
        
        {!showResult && (
          <Button onClick={handleSubmit} disabled={!userInput.trim()}>
            Submit Answer
          </Button>
        )}
      </div>

      {showResult && (
        <div className={`p-6 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center space-x-2 mb-4">
            <span className={isCorrect ? "text-green-600" : "text-red-600"}>
              {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
            </span>
            {!isCorrect && (
              <span className="text-gray-600">Correct answer: {question.answer}</span>
            )}
          </div>
          
          {question.word_family && (
            <div className="bg-white p-3 rounded">
              <h4 className="font-semibold text-gray-800">🏠 Word Family</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {question.word_family.map((word: string, index: number) => (
                  <Badge key={index} variant="secondary">{word}</Badge>
                ))}
              </div>
            </div>
          )}
          
          <Button
            className="mt-4"
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setUserInput('');
                setShowResult(false);
              }
            }}
            disabled={currentQuestion >= questions.length - 1}
          >
            Next Question →
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-gray-500">
        Question {currentQuestion + 1} of {questions.length}
      </div>
    </div>
  );
}