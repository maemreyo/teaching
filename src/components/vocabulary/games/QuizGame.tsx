'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BaseGameProps, VocabularyWord } from '../types';
import { playAudio } from '../gameUtils';

interface QuizQuestion {
  question: string;
  word: string;
  pronunciation: string;
  audio: string;
  answers: string[];
  correct: string;
  definition: string;
  memoryAid: any;
  commonMistake: any;
  contextCorner: any;
}

interface QuizGameData {
  questions: QuizQuestion[];
  currentQuestion: number;
  selectedAnswer: string | null;
  showResult: boolean;
}

interface QuizGameProps extends BaseGameProps {
  allWords: VocabularyWord[]; // Need all words for wrong answers
}

export default function QuizGame({ 
  words, 
  allWords,
  settings, 
  onScoreUpdate, 
  onGameEnd 
}: QuizGameProps) {
  const [gameData, setGameData] = useState<QuizGameData | null>(null);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const gameWords = words.slice(0, settings.wordCount);

  const initializeGame = useCallback(() => {
    const questions: QuizQuestion[] = gameWords.map(word => {
      const wrongAnswers = allWords
        .filter(w => w.id !== word.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaning_vietnamese);
      
      const allAnswers = [word.meaning_vietnamese, ...wrongAnswers]
        .sort(() => Math.random() - 0.5);
      
      return {
        question: `What does "${word.word}" mean?`,
        word: word.word,
        pronunciation: word.pronunciation_ipa,
        audio: word.audio_url || '',
        answers: allAnswers,
        correct: word.meaning_vietnamese,
        definition: word.definition_english,
        memoryAid: word.enriched_learning?.memory_aid || null,
        commonMistake: word.enriched_learning?.common_mistake || null,
        contextCorner: word.enriched_learning?.context_corner || null
      };
    });

    setGameData({
      questions,
      currentQuestion: 0,
      selectedAnswer: null,
      showResult: false
    });
  }, [gameWords, allWords]);

  const handleQuizAnswer = (answer: string) => {
    if (!gameData || gameData.selectedAnswer) return;
    
    const question = gameData.questions[gameData.currentQuestion];
    const isCorrect = answer === question.correct;
    
    setGameData({
      ...gameData,
      selectedAnswer: answer,
      showResult: true
    });
    
    if (isCorrect) {
      const newScore = score + 20;
      setScore(newScore);
      onScoreUpdate(newScore);
    }
    
    setTimeout(() => {
      if (gameData.currentQuestion < gameData.questions.length - 1) {
        setGameData({
          ...gameData,
          currentQuestion: gameData.currentQuestion + 1,
          selectedAnswer: null,
          showResult: false
        });
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        onGameEnd(true);
      }
    }, 1500);
  };

  // Initialize game when component mounts
  if (!gameData) {
    initializeGame();
    return null;
  }

  const currentQuestion = gameData.questions[gameData.currentQuestion];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-4">
          Question {gameData.currentQuestion + 1} of {gameData.questions.length}
        </div>
        
        <div className="bg-blue-50 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {currentQuestion.question}
          </h3>
          <div className="flex items-center justify-center space-x-4">
            <p className="text-lg font-mono text-blue-600">
              /{currentQuestion.pronunciation}/
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => playAudio(currentQuestion.audio)}
            >
              🔊
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {currentQuestion.answers.map((answer: string, index: number) => {
            let buttonClass = "p-4 text-left hover:bg-gray-50";
            
            if (gameData.showResult && gameData.selectedAnswer === answer) {
              buttonClass += answer === currentQuestion.correct
                ? " bg-green-100 border-green-500 text-green-800"
                : " bg-red-100 border-red-500 text-red-800";
            } else if (gameData.showResult && answer === currentQuestion.correct) {
              buttonClass += " bg-green-100 border-green-500 text-green-800";
            }
            
            return (
              <Button
                key={index}
                variant="outline"
                className={buttonClass}
                onClick={() => handleQuizAnswer(answer)}
                disabled={gameData.selectedAnswer !== null}
              >
                {answer}
              </Button>
            );
          })}
        </div>
        
        {/* Show enriched content after answer */}
        {gameData.showResult && currentQuestion.memoryAid && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <Card className="bg-yellow-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-yellow-800">
                  💡 {currentQuestion.memoryAid.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-yellow-700">
                  {currentQuestion.memoryAid.idea}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}