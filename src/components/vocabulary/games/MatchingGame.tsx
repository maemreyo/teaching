'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { BaseGameProps, VocabularyWord } from '../types';

interface MatchingGameData {
  words: VocabularyWord[];
  translations: VocabularyWord[];
  matches: string[];
  selectedWord: VocabularyWord | null;
  selectedTranslation: VocabularyWord | null;
}

export default function MatchingGame({ 
  words, 
  settings, 
  onScoreUpdate, 
  onGameEnd 
}: BaseGameProps) {
  const [gameData, setGameData] = useState<MatchingGameData | null>(null);
  const [score, setScore] = useState(0);

  const gameWords = words.slice(0, settings.wordCount);

  const initializeGame = useCallback(() => {
    const shuffledWords = [...gameWords].sort(() => Math.random() - 0.5);
    const shuffledTranslations = [...gameWords].sort(() => Math.random() - 0.5);
    
    setGameData({
      words: shuffledWords,
      translations: shuffledTranslations,
      matches: [],
      selectedWord: null,
      selectedTranslation: null
    });
  }, [gameWords]);

  const handleMatchingClick = (item: VocabularyWord, type: 'word' | 'translation') => {
    if (!gameData) return;

    if (type === 'word') {
      if (gameData.selectedWord?.id === item.id) {
        setGameData({ ...gameData, selectedWord: null });
      } else {
        setGameData({ ...gameData, selectedWord: item });
        
        if (gameData.selectedTranslation && gameData.selectedTranslation.id === item.id) {
          // Match found
          const newMatches = [...gameData.matches, item.id];
          const newScore = score + 15;
          setScore(newScore);
          onScoreUpdate(newScore);
          
          setGameData({
            ...gameData,
            matches: newMatches,
            selectedWord: null,
            selectedTranslation: null
          });
          
          if (newMatches.length === gameWords.length) {
            onGameEnd(true);
          }
        }
      }
    } else {
      if (gameData.selectedTranslation?.id === item.id) {
        setGameData({ ...gameData, selectedTranslation: null });
      } else {
        setGameData({ ...gameData, selectedTranslation: item });
        
        if (gameData.selectedWord && gameData.selectedWord.id === item.id) {
          // Match found
          const newMatches = [...gameData.matches, item.id];
          const newScore = score + 15;
          setScore(newScore);
          onScoreUpdate(newScore);
          
          setGameData({
            ...gameData,
            matches: newMatches,
            selectedWord: null,
            selectedTranslation: null
          });
          
          if (newMatches.length === gameWords.length) {
            onGameEnd(true);
          }
        }
      }
    }
  };

  // Initialize game when component mounts
  if (!gameData) {
    initializeGame();
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          Matches: {gameData.matches.length} / {gameWords.length}
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-center">English Words</h3>
          {gameData.words.map((word: VocabularyWord) => (
            <Button
              key={word.id}
              variant={gameData.matches.includes(word.id) ? "default" : 
                      gameData.selectedWord?.id === word.id ? "destructive" : "outline"}
              className="w-full p-4"
              onClick={() => handleMatchingClick(word, 'word')}
              disabled={gameData.matches.includes(word.id)}
            >
              {word.word}
            </Button>
          ))}
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-center">Vietnamese Meanings</h3>
          {gameData.translations.map((word: VocabularyWord) => (
            <Button
              key={word.id}
              variant={gameData.matches.includes(word.id) ? "default" : 
                      gameData.selectedTranslation?.id === word.id ? "destructive" : "outline"}
              className="w-full p-4"
              onClick={() => handleMatchingClick(word, 'translation')}
              disabled={gameData.matches.includes(word.id)}
            >
              {word.meaning_vietnamese}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}