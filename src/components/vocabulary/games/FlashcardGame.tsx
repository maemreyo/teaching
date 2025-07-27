'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BaseGameProps, FlashcardData, VocabularyWord } from '../types';
import { playAudio } from '../gameUtils';

interface FlashcardGameData {
  currentCard: number;
  showAnswer: boolean;
  cards: FlashcardData[];
}

interface FlashcardGameProps extends BaseGameProps {
  // Add any flashcard-specific props here
}

export default function FlashcardGame({ 
  words, 
  settings, 
  onScoreUpdate, 
  onGameEnd 
}: FlashcardGameProps) {
  const [gameData, setGameData] = useState<FlashcardGameData | null>(null);
  const [showEnrichedContent, setShowEnrichedContent] = useState(false);
  const [score, setScore] = useState(0);

  const gameWords = words.slice(0, settings.wordCount);

  const initializeGame = useCallback(() => {
    const cards: FlashcardData[] = gameWords.map(word => ({
      question: word.word,
      answer: word.meaning_vietnamese,
      pronunciation: word.pronunciation_ipa,
      audio: word.audio_url || '',
      definition: word.definition_english,
      memoryAid: word.enriched_learning?.memory_aid || null,
      commonMistake: word.enriched_learning?.common_mistake || null,
      contextCorner: word.enriched_learning?.context_corner || null,
      examples: word.examples || word.vocabulary_examples?.map(ex => ({
        sentence: ex.sentence,
        translation: ex.translation,
        audio_url: ex.audio_url
      })) || [],
      wordType: word.word_type,
      tags: word.tags || []
    }));

    setGameData({
      currentCard: 0,
      showAnswer: false,
      cards
    });
  }, [gameWords]);

  const handleFlashcardAction = (action: 'flip' | 'next' | 'prev' | 'toggleEnriched') => {
    if (!gameData) return;
    
    switch (action) {
      case 'flip':
        setGameData({
          ...gameData,
          showAnswer: !gameData.showAnswer
        });
        break;
      case 'next':
        if (gameData.currentCard < gameData.cards.length - 1) {
          setGameData({
            ...gameData,
            currentCard: gameData.currentCard + 1,
            showAnswer: false
          });
          const newScore = score + 10;
          setScore(newScore);
          onScoreUpdate(newScore);
          setShowEnrichedContent(false);
        } else {
          onGameEnd(true);
        }
        break;
      case 'prev':
        if (gameData.currentCard > 0) {
          setGameData({
            ...gameData,
            currentCard: gameData.currentCard - 1,
            showAnswer: false
          });
          setShowEnrichedContent(false);
        }
        break;
      case 'toggleEnriched':
        setShowEnrichedContent(!showEnrichedContent);
        break;
    }
  };

  // Initialize game when component mounts
  if (!gameData) {
    initializeGame();
    return null;
  }

  const currentCard = gameData.cards[gameData.currentCard];

  return (
    <div className="text-center space-y-6">
      <div className="text-sm text-gray-600 flex items-center justify-between">
        <span>Card {gameData.currentCard + 1} of {gameData.cards.length}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFlashcardAction('toggleEnriched')}
          className="text-xs"
        >
          {showEnrichedContent ? 'Hide' : 'Show'} Learning Aids
        </Button>
      </div>
      
      <div 
        className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-8 cursor-pointer transform hover:scale-105 transition-transform min-h-[200px] flex flex-col justify-center"
        onClick={() => handleFlashcardAction('flip')}
      >
        {!gameData.showAnswer ? (
          <div>
            <h3 className="text-3xl font-bold text-gray-800 mb-2">
              {currentCard.question}
            </h3>
            <p className="text-blue-600 font-mono mb-2">
              /{currentCard.pronunciation}/
            </p>
            <p className="text-sm text-gray-500 mb-2">
              {currentCard.wordType}
            </p>
            {currentCard.tags.length > 0 && (
              <div className="flex justify-center space-x-1 mb-4">
                {currentCard.tags.map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-sm text-gray-500">Click to see answer</p>
          </div>
        ) : (
          <div>
            <h3 className="text-3xl font-bold text-green-600 mb-2">
              {currentCard.answer}
            </h3>
            <p className="text-gray-600 mb-4">
              {currentCard.definition}
            </p>
            <p className="text-sm text-gray-500">Click to see question</p>
          </div>
        )}
      </div>
      
      {/* Enriched Learning Content */}
      {showEnrichedContent && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          {currentCard.memoryAid && (
            <Card className="bg-yellow-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-yellow-800">
                  💡 {currentCard.memoryAid.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-yellow-700">
                  {currentCard.memoryAid.idea}
                </p>
              </CardContent>
            </Card>
          )}
          
          {currentCard.commonMistake && (
            <Card className="bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-red-800">
                  ⚠️ Common Mistake
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-red-600 mb-1">
                  ❌ {currentCard.commonMistake.mistake}
                </p>
                <p className="text-xs text-green-600">
                  ✅ {currentCard.commonMistake.correction}
                </p>
              </CardContent>
            </Card>
          )}
          
          {currentCard.contextCorner && (
            <Card className="bg-blue-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-blue-800">
                  📝 {currentCard.contextCorner.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-blue-700">
                  {currentCard.contextCorner.note}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Examples */}
      {currentCard.examples.length > 0 && gameData.showAnswer && (
        <Card className="bg-green-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-green-800">📚 Examples</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {currentCard.examples.slice(0, 2).map((example: any, index: number) => (
              <div key={index} className="mb-2 last:mb-0">
                <p className="text-sm font-medium text-gray-800">{example.sentence}</p>
                <p className="text-sm text-gray-600 italic">{example.translation}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => handleFlashcardAction('prev')}
          disabled={gameData.currentCard === 0}
        >
          ← Previous
        </Button>
        
        <Button
          variant="outline"
          onClick={() => playAudio(currentCard.audio)}
        >
          🔊 Audio
        </Button>
        
        <Button
          onClick={() => handleFlashcardAction('next')}
          className="bg-green-600 hover:bg-green-700"
        >
          Next →
        </Button>
      </div>
    </div>
  );
}