'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VocabularyGames from '@/components/vocabulary/VocabularyGames';
import { VocabularyWord } from '@/hooks/useVocabularyData';

export default function GamePage({
  params,
}: {
  params: Promise<{ gameType: string }>;
}) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [difficulty, setDifficulty] = useState<string>('easy');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    hard: 'bg-yellow-100 text-yellow-800',
    expert: 'bg-orange-100 text-orange-800',
    nightmare: 'bg-red-100 text-red-800',
    hell: 'bg-purple-100 text-purple-800',
  };

  useEffect(() => {
    const difficultyParam = searchParams!.get('difficulty');

    // Try to get game data from sessionStorage first
    const gameDataString = sessionStorage.getItem('gameData');

    if (gameDataString) {
      try {
        const gameData = JSON.parse(gameDataString);

        // Validate game data structure
        if (
          !gameData.words ||
          !Array.isArray(gameData.words) ||
          gameData.words.length === 0
        ) {
          setError(
            'Invalid game data. Please launch the game from the vocabulary page.'
          );
          setLoading(false);
          return;
        }

        // Validate word objects have required properties
        const isValidWords = gameData.words.every(
          (word: any) =>
            word &&
            typeof word === 'object' &&
            word.id &&
            word.word &&
            word.meaning_vietnamese
        );

        if (!isValidWords) {
          setError(
            'Game data is corrupted. Please try launching the game again.'
          );
          setLoading(false);
          return;
        }

        setWords(gameData.words);
        setDifficulty(gameData.difficulty || difficultyParam || 'easy');

        // Clear sessionStorage after using it
        sessionStorage.removeItem('gameData');
      } catch (error) {
        console.error('Failed to parse game data from sessionStorage:', error);
        setError(
          'Failed to load game data. Please try launching the game again.'
        );
        setLoading(false);
        return;
      }
    } else {
      // Fallback: try URL params (for backward compatibility)
      const wordsParam = searchParams!.get('words');

      if (!wordsParam) {
        setError(
          'No game data found. Please launch the game from the vocabulary page.'
        );
        setLoading(false);
        return;
      }

      try {
        const parsedWords = JSON.parse(decodeURIComponent(wordsParam));

        if (!Array.isArray(parsedWords) || parsedWords.length === 0) {
          setError(
            'Invalid vocabulary data. Please try launching the game again.'
          );
          setLoading(false);
          return;
        }

        const isValidWords = parsedWords.every(
          (word) =>
            word &&
            typeof word === 'object' &&
            word.id &&
            word.word &&
            word.meaning_vietnamese
        );

        if (!isValidWords) {
          setError(
            'Vocabulary data is corrupted. Please try launching the game again.'
          );
          setLoading(false);
          return;
        }

        setWords(parsedWords);
      } catch (error) {
        console.error('Failed to parse words from URL:', error);
        setError(
          'Failed to load vocabulary data. Please try launching the game again.'
        );
        setLoading(false);
        return;
      }
    }

    if (difficultyParam) {
      setDifficulty(difficultyParam);
    }

    setLoading(false);
  }, [searchParams]);

  const gameType = resolvedParams.gameType as
    | 'flashcards'
    | 'matching'
    | 'quiz'
    | 'memory'
    | 'wordfall'
    | 'typing';

  const gameIcons = {
    flashcards: '📇',
    wordfall: '🌧️',
    matching: '🔗',
    quiz: '❓',
    memory: '🧠',
    typing: '⌨️',
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="mb-4 text-4xl">🎮</div>
          <h2 className="mb-2 text-xl font-semibold text-gray-800">
            Loading game...
          </h2>
          <p className="text-gray-600">Preparing your vocabulary challenge</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="mx-auto max-w-md p-6 text-center">
          <div className="mb-4 text-6xl">❌</div>
          <h2 className="mb-2 text-xl font-semibold text-red-800">
            Game Error
          </h2>
          <p className="mb-6 text-red-600">{error}</p>
          <div className="space-y-3">
            <Button
              onClick={() => window.close()}
              variant="outline"
              className="w-full"
            >
              Close Window
            </Button>
            <Button
              onClick={() => (window.location.href = '/unit2/vocabulary')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Return to Vocabulary Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.close()}>
                ← Close Game
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="flex items-center space-x-2 text-2xl font-bold text-gray-900">
                  <span>{gameIcons[gameType]}</span>
                  <span>
                    {gameType.charAt(0).toUpperCase() + gameType.slice(1)} Game
                  </span>
                </h1>
                <p className="text-gray-600">
                  Unit 2: My Home - Vocabulary Challenge
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge
                className={
                  difficultyColors[difficulty as keyof typeof difficultyColors]
                }
              >
                {difficulty.toUpperCase()}
              </Badge>
              <div className="text-sm">
                Score: <span className="font-bold text-green-600">{score}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="p-6">
            <VocabularyGames
              words={words}
              gameType={gameType}
              difficulty={difficulty as any}
              onScoreUpdate={(newScore) => setScore(newScore)}
            />
          </div>
        </div>

        {/* Game Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>🎯 Game Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold text-gray-800">
                  How to Play:
                </h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  {gameType === 'flashcards' && (
                    <>
                      <li>• Click the card to flip and see the answer</li>
                      <li>• Use Previous/Next buttons to navigate</li>
                      <li>• Listen to pronunciation with the audio button</li>
                    </>
                  )}
                  {gameType === 'quiz' && (
                    <>
                      <li>• Read the question carefully</li>
                      <li>• Click on the correct Vietnamese meaning</li>
                      <li>
                        • Use hints if available for your difficulty level
                      </li>
                    </>
                  )}
                  {gameType === 'wordfall' && (
                    <>
                      <li>• Words fall from the top of the screen</li>
                      <li>• Type the Vietnamese meaning quickly</li>
                      <li>• Press Enter to submit your answer</li>
                    </>
                  )}
                  {gameType === 'matching' && (
                    <>
                      <li>• Click on English words and Vietnamese meanings</li>
                      <li>• Match them correctly to score points</li>
                      <li>• Complete all pairs to win</li>
                    </>
                  )}
                  {gameType === 'memory' && (
                    <>
                      <li>• Click cards to reveal English or Vietnamese</li>
                      <li>• Find matching pairs</li>
                      <li>• Remember card positions to win faster</li>
                    </>
                  )}
                  {gameType === 'typing' && (
                    <>
                      <li>• Type the Vietnamese meaning as fast as possible</li>
                      <li>• Accuracy and speed both matter</li>
                      <li>• Complete all words before time runs out</li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h3 className="mb-2 font-semibold text-gray-800">
                  Difficulty: {difficulty.toUpperCase()}
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>• Words: {words.length}</p>
                  <p>• Focus on accuracy and speed</p>
                  <p>• Higher difficulty = fewer hints & less time</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
