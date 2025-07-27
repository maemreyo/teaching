'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MultipleChoiceQuestion } from '@/hooks/useExerciseGenerator';

interface VocabularyMultipleChoiceProps {
  questions: MultipleChoiceQuestion[];
  onAnswer: (questionId: string, answer: string) => void;
  userAnswers: Record<string, any>;
}

export default function VocabularyMultipleChoice({ 
  questions, 
  onAnswer, 
  userAnswers 
}: VocabularyMultipleChoiceProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showExplanation, setShowExplanation] = useState(false);
  
  const question = questions[currentQuestion];
  const isAnswered = userAnswers[question.id];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    onAnswer(question.id, answer);
    setShowExplanation(true);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="flex items-center space-x-4 mb-4">
          <div className="text-3xl font-bold text-blue-600">{question.word}</div>
          <div className="text-blue-500 font-mono">{question.pronunciation}</div>
          <Button variant="outline" size="sm">
            🔊 Play Audio
          </Button>
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{question.question}</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {question.options.map((option: string, index: number) => (
          <Button
            key={index}
            variant={
              selectedAnswer === option 
                ? option === question.correct ? "default" : "destructive"
                : "outline"
            }
            className="h-16 text-lg"
            onClick={() => handleAnswerSelect(option)}
            disabled={showExplanation}
          >
            {option}
          </Button>
        ))}
      </div>

      {showExplanation && (
        <div className="bg-green-50 p-6 rounded-lg space-y-4">
          <div className="flex items-center space-x-2">
            <span className={selectedAnswer === question.correct ? "text-green-600" : "text-red-600"}>
              {selectedAnswer === question.correct ? "✅ Correct!" : "❌ Incorrect"}
            </span>
            <span className="text-gray-600">Correct answer: {question.correct}</span>
          </div>
          
          <p className="text-gray-700">{question.explanation}</p>
          
          {question.enriched_learning && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-yellow-50 p-3 rounded">
                <h4 className="font-semibold text-yellow-800">💡 Memory Aid</h4>
                <p className="text-sm text-yellow-700">{question.enriched_learning.memory_aid}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded">
                <h4 className="font-semibold text-orange-800">⚠️ Common Mistake</h4>
                <p className="text-sm text-orange-700">{question.enriched_learning.common_mistake}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <h4 className="font-semibold text-blue-800">📌 Context Corner</h4>
                <p className="text-sm text-blue-700">{question.enriched_learning.context_corner}</p>
              </div>
            </div>
          )}
          
          <Button
            onClick={() => {
              if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer('');
                setShowExplanation(false);
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