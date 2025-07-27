'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { BaseGameProps } from '../types';

interface MemoryCard {
  id: number;
  type: 'word' | 'translation';
  content: string;
  matched: boolean;
  wordId?: number;
}

interface MemoryGameData {
  cards: MemoryCard[];
  flipped: number[];
  matches: number[];
  canFlip: boolean;
}

export default function MemoryGame({ 
  words, 
  settings, 
  onScoreUpdate, 
  onGameEnd 
}: BaseGameProps) {
  const [gameData, setGameData] = useState<MemoryGameData | null>(null);
  const [score, setScore] = useState(0);

  const gameWords = words.slice(0, settings.wordCount);

  const initializeGame = useCallback(() => {
    const memoryCards: MemoryCard[] = [];
    gameWords.forEach(word => {
      const wordId = parseInt(word.id) || Math.random() * 1000;
      memoryCards.push({ id: wordId * 2, type: 'word', content: word.word, matched: false });
      memoryCards.push({ id: wordId * 2 + 1, type: 'translation', content: word.meaning_vietnamese, matched: false, wordId: wordId });
    });
    
    setGameData({
      cards: memoryCards.sort(() => Math.random() - 0.5),
      flipped: [],
      matches: [],
      canFlip: true
    });
  }, [gameWords]);

  const handleMemoryCardClick = (cardId: number) => {
    if (!gameData || !gameData.canFlip || gameData.flipped.includes(cardId)) return;

    const newFlipped = [...gameData.flipped, cardId];
    setGameData({ ...gameData, flipped: newFlipped, canFlip: newFlipped.length < 2 });

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped.map(id => gameData.cards.find(card => card.id === id));
      
      setTimeout(() => {
        if (first && second && 
            ((first.type === 'word' && second.type === 'translation' && second.wordId === Math.floor(first.id / 2)) ||
             (first.type === 'translation' && second.type === 'word' && first.wordId === Math.floor(second.id / 2)))) {
          // Match found
          const newMatches = [...gameData.matches, first.id, second.id];
          const newScore = score + 20;
          setScore(newScore);
          onScoreUpdate(newScore);
          
          setGameData({
            ...gameData,
            flipped: [],
            matches: newMatches,
            canFlip: true,
            cards: gameData.cards.map(card => 
              newMatches.includes(card.id) ? { ...card, matched: true } : card
            )
          });
          
          if (newMatches.length === gameWords.length * 2) {
            onGameEnd(true);
          }
        } else {
          setGameData({ ...gameData, flipped: [], canFlip: true });
        }
      }, 1000);
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
          Matches: {gameData.matches.length / 2} / {gameWords.length}
        </p>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {gameData.cards.map((card: MemoryCard) => (
          <Button
            key={card.id}
            variant={card.matched ? "default" : 
                    gameData.flipped.includes(card.id) ? "destructive" : "outline"}
            className="h-20 text-sm"
            onClick={() => handleMemoryCardClick(card.id)}
            disabled={card.matched || gameData.flipped.includes(card.id)}
          >
            {card.matched || gameData.flipped.includes(card.id) ? 
              card.content : '?'}
          </Button>
        ))}
      </div>
    </div>
  );
}