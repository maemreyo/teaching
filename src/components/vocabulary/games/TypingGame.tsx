'use client';

import { useState, useCallback } from 'react';
import { BaseGameProps } from '../types';

interface TypingGameData {
  currentWordIndex: number;
  typedText: string;
  startTime: number;
  wordsCompleted: number;
  accuracy: number;
}

export default function TypingGame({ 
  words, 
  settings, 
  onScoreUpdate, 
  onGameEnd 
}: BaseGameProps) {
  const [gameData, setGameData] = useState<TypingGameData | null>(null);
  const [score, setScore] = useState(0);

  const gameWords = words.slice(0, settings.wordCount);

  const initializeGame = useCallback(() => {
    setGameData({
      currentWordIndex: 0,
      typedText: '',
      startTime: Date.now(),
      wordsCompleted: 0,
      accuracy: 100
    });
  }, []);

  const handleTyping = (input: string) => {
    if (!gameData) return;

    const currentWord = gameWords[gameData.currentWordIndex];
    const targetText = currentWord.meaning_vietnamese;
    
    setGameData({ ...gameData, typedText: input });
    
    if (input === targetText) {
      const timeSpent = Date.now() - gameData.startTime;
      const wpm = (targetText.length / 5) / (timeSpent / 60000);
      const bonusPoints = Math.floor(wpm * 2);
      const newScore = score + 15 + bonusPoints;
      
      setScore(newScore);
      onScoreUpdate(newScore);
      
      if (gameData.currentWordIndex < gameWords.length - 1) {
        setGameData({
          ...gameData,
          currentWordIndex: gameData.currentWordIndex + 1,
          typedText: '',
          startTime: Date.now(),
          wordsCompleted: gameData.wordsCompleted + 1
        });
      } else {
        onGameEnd(true);
      }
    }
  };

  // Initialize game when component mounts
  if (!gameData) {
    initializeGame();
    return null;
  }

  const currentWord = gameWords[gameData.currentWordIndex];

  return (
    <div className="space-y-6 text-center">
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {currentWord?.word}
        </h3>
        <p className="text-blue-600 font-mono">
          /{currentWord?.pronunciation_ipa}/
        </p>
      </div>
      
      <div>
        <input
          type="text"
          value={gameData.typedText}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type the Vietnamese meaning..."
          className="w-full max-w-md px-4 py-3 border rounded-lg text-center text-lg"
          autoFocus
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="font-medium">Words:</span> {gameData.wordsCompleted}/{gameWords.length}
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="font-medium">Target:</span> {currentWord?.meaning_vietnamese}
        </div>
        <div className="bg-gray-50 p-3 rounded-lg">
          <span className="font-medium">Progress:</span> {Math.round((gameData.currentWordIndex / gameWords.length) * 100)}%
        </div>
      </div>
    </div>
  );
}