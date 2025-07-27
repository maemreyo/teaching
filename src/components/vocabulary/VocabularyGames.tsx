'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { VocabularyGameProps } from './types';
import { difficultySettings, getDifficultyColor, getGameIcon, getScoreMessage } from './gameUtils';
import { 
  FlashcardGame, 
  QuizGame, 
  MatchingGame, 
  MemoryGame, 
  WordfallGame, 
  TypingGame 
} from './games';

export default function VocabularyGames({ words, gameType, difficulty, onScoreUpdate }: VocabularyGameProps) {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(difficultySettings[difficulty].lives);
  const [timeLeft, setTimeLeft] = useState(difficultySettings[difficulty].timeLimit);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);

  const settings = difficultySettings[difficulty];
  const gameWords = words.slice(0, settings.wordCount);

  // Start game
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLives(settings.lives);
    setTimeLeft(settings.timeLimit);
    setHintsUsed(0);
  };

  // End game
  const endGame = (won: boolean) => {
    setIsPlaying(false);
    const finalScore = won ? score + (lives * 10) + (timeLeft * 2) : score;
    setScore(finalScore);
    onScoreUpdate(finalScore);
  };

  // Handle score updates from individual games
  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    onScoreUpdate(newScore);
  };

  // Timer effect
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isPlaying && timeLeft === 0) {
      endGame(false);
    }
  }, [isPlaying, timeLeft]);

  const useHint = () => {
    if (hintsUsed < settings.hints && gameType === 'quiz') {
      setHintsUsed(hintsUsed + 1);
      setScore(Math.max(0, score - 5));
    }
  };

  const renderGame = () => {
    const baseProps = {
      words: gameWords,
      difficulty,
      settings,
      onScoreUpdate: handleScoreUpdate,
      onGameEnd: endGame
    };

    switch (gameType) {
      case 'flashcards':
        return <FlashcardGame {...baseProps} />;
      case 'quiz':
        return <QuizGame {...baseProps} allWords={words} />;
      case 'matching':
        return <MatchingGame {...baseProps} />;
      case 'memory':
        return <MemoryGame {...baseProps} />;
      case 'wordfall':
        return <WordfallGame {...baseProps} />;
      case 'typing':
        return <TypingGame {...baseProps} />;
      default:
        return <div>Game type not supported</div>;
    }
  };

  if (!isPlaying) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <span>🎮</span>
              <span>{gameType.charAt(0).toUpperCase() + gameType.slice(1)} Game</span>
            </CardTitle>
            <Badge className={getDifficultyColor(difficulty)}>
              {difficulty.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">
              {getGameIcon(gameType)}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Game Settings</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium">Time Limit:</span> {settings.timeLimit}s
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium">Lives:</span> {settings.lives}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium">Words:</span> {settings.wordCount}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <span className="font-medium">Hints:</span> {settings.hints}
                </div>
              </div>
            </div>
            
            {score > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">Final Score: {score}</h4>
                <p className="text-sm text-green-600">
                  {getScoreMessage(score)}
                </p>
              </div>
            )}
            
            <Button
              size="lg"
              onClick={startGame}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {score > 0 ? '🔄 Play Again' : '▶️ Start Game'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>🎮</span>
            <span>{gameType.charAt(0).toUpperCase() + gameType.slice(1)}</span>
          </CardTitle>
          <div className="flex items-center space-x-4">
            <Badge className={getDifficultyColor(difficulty)}>
              {difficulty.toUpperCase()}
            </Badge>
            <div className="text-sm">
              Score: <span className="font-bold text-green-600">{score}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <span>❤️</span>
              <span className="text-sm font-medium">{lives}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>⏰</span>
              <span className="text-sm font-medium">{timeLeft}s</span>
            </div>
            {settings.hints > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={useHint}
                disabled={hintsUsed >= settings.hints || gameType !== 'quiz'}
              >
                💡 Hint ({settings.hints - hintsUsed})
              </Button>
            )}
          </div>
          <Progress value={(timeLeft / settings.timeLimit) * 100} className="w-32" />
        </div>
      </CardHeader>
      
      <CardContent>
        {renderGame()}
      </CardContent>
    </Card>
  );
}