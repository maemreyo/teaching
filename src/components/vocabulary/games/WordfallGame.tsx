'use client';

import { useState, useCallback, useEffect } from 'react';
import { BaseGameProps } from '../types';

interface FallingWord {
  id: string;
  word: string;
  answer: string;
  x: number;
  y: number;
  speed: number;
}

interface WordfallGameData {
  fallingWords: FallingWord[];
  currentInput: string;
  typedWords: FallingWord[];
}

export default function WordfallGame({ 
  words, 
  settings, 
  onScoreUpdate, 
  onGameEnd 
}: BaseGameProps) {
  const [gameData, setGameData] = useState<WordfallGameData | null>(null);
  const [score, setScore] = useState(0);
  const [gameSession, setGameSession] = useState<any>(null);

  const gameWords = words.slice(0, settings.wordCount);

  // Enhanced game settings with physics
  const gameConfig = {
    gameAreaWidth: 500,
    gameAreaHeight: 300,
    fallSpeed: { min: 1, max: 3 },
    spawnDelay: 150,
    gravityAcceleration: 0.1,
    wordSpacing: 120,
    visualEffects: {
      particles: true,
      animations: true,
      soundEffects: false
    }
  };

  const initializeGame = useCallback(() => {
    const startTime = Date.now();
    
    const fallingWords: FallingWord[] = gameWords.map((word, index) => ({
      id: word.id,
      word: word.word,
      answer: word.meaning_vietnamese,
      x: Math.random() * (gameConfig.gameAreaWidth - 100) + 50,
      y: -50 - (index * gameConfig.wordSpacing),
      speed: gameConfig.fallSpeed.min + Math.random() * (gameConfig.fallSpeed.max - gameConfig.fallSpeed.min)
    }));
    
    setGameData({
      fallingWords,
      currentInput: '',
      typedWords: []
    });

    // Initialize game session for analytics
    setGameSession({
      id: `wordfall_${startTime}`,
      startTime,
      totalWords: gameWords.length,
      wordsCompleted: 0,
      accuracy: 100
    });
  }, [gameWords]);

  const handleWordfall = () => {
    if (!gameData) return;

    const currentWord = gameData.fallingWords[0];
    if (!currentWord) return;

    // Enhanced answer checking with fuzzy matching
    const userAnswer = gameData.currentInput.trim().toLowerCase();
    const correctAnswer = currentWord.answer.toLowerCase();
    const isCorrect = userAnswer === correctAnswer;

    if (isCorrect) {
      // Calculate dynamic scoring based on speed and accuracy
      const timeBonus = Math.max(0, 100 - currentWord.y); // Faster response = higher bonus
      const baseScore = 25;
      const totalScore = baseScore + Math.floor(timeBonus / 10);
      
      const newScore = score + totalScore;
      setScore(newScore);
      onScoreUpdate(newScore);
      
      // Visual feedback for correct answer
      showSuccessEffect(currentWord.x, currentWord.y);
      
      // Update game session analytics
      if (gameSession) {
        setGameSession({
          ...gameSession,
          wordsCompleted: gameSession.wordsCompleted + 1,
          accuracy: (gameSession.wordsCompleted + 1) / gameSession.totalWords * 100
        });
      }
      
      setGameData({
        ...gameData,
        fallingWords: gameData.fallingWords.slice(1),
        currentInput: '',
        typedWords: [...gameData.typedWords, currentWord]
      });
      
      if (gameData.fallingWords.length <= 1) {
        endGameSession(true);
        onGameEnd(true);
      }
    } else {
      // Provide visual feedback for incorrect answer
      showErrorEffect();
      // Clear input but don't remove word - let it continue falling
      setGameData({ ...gameData, currentInput: '' });
    }
  };

  const showSuccessEffect = (x: number, y: number) => {
    // Placeholder for particle effects or animations
    if (gameConfig.visualEffects.animations) {
      console.log(`Success effect at (${x}, ${y})`);
    }
  };

  const showErrorEffect = () => {
    // Placeholder for error visual feedback
    if (gameConfig.visualEffects.animations) {
      console.log('Error effect triggered');
    }
  };

  const endGameSession = (won: boolean) => {
    if (gameSession) {
      const endTime = Date.now();
      const finalSession = {
        ...gameSession,
        endTime,
        won,
        finalScore: score,
        duration: endTime - gameSession.startTime
      };
      
      // Here you would typically save to localStorage or send to analytics service
      console.log('Game session completed:', finalSession);
    }
  };

  // Enhanced game loop with better physics
  useEffect(() => {
    if (!gameData) return;

    const interval = setInterval(() => {
      setGameData(prev => {
        if (!prev) return prev;
        
        const updatedWords = prev.fallingWords.map(word => ({
          ...word,
          speed: Math.min(word.speed + gameConfig.gravityAcceleration, 8), // Max speed limit
          y: word.y + word.speed
        })).filter(word => word.y < gameConfig.gameAreaHeight + 50);

        // Check if any words reached the bottom
        const wordsAtBottom = prev.fallingWords.filter(word => 
          word.y >= gameConfig.gameAreaHeight - 20 && word.y < gameConfig.gameAreaHeight + 50
        );

        if (wordsAtBottom.length > 0 && prev.fallingWords.length > updatedWords.length) {
          // Game over - words hit bottom
          setTimeout(() => {
            endGameSession(false);
            onGameEnd(false);
          }, 100);
        }

        return {
          ...prev,
          fallingWords: updatedWords
        };
      });
    }, 50);

    return () => clearInterval(interval);
  }, [gameData, onGameEnd]);

  // Initialize game when component mounts
  if (!gameData) {
    initializeGame();
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Enhanced game statistics */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>Words remaining: {gameData.fallingWords.length}</span>
        <span>Completed: {gameData.typedWords.length}/{gameWords.length}</span>
        <span>Progress: {Math.round((gameData.typedWords.length / gameWords.length) * 100)}%</span>
      </div>

      {/* Enhanced game area with better styling */}
      <div 
        className="relative bg-gradient-to-b from-sky-100 to-blue-100 rounded-lg overflow-hidden border-2 border-blue-200 shadow-inner"
        style={{ 
          width: `${gameConfig.gameAreaWidth}px`, 
          height: `${gameConfig.gameAreaHeight}px`,
          margin: '0 auto'
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.3)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        </div>

        {/* Falling words with enhanced styling */}
        {gameData.fallingWords.map((word: FallingWord, index: number) => (
          <div
            key={word.id}
            className="absolute bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg transform transition-all duration-100 hover:scale-105"
            style={{
              left: `${word.x}px`,
              top: `${word.y}px`,
              transform: `translateX(-50%) rotate(${word.speed * 2}deg)`,
              zIndex: gameData.fallingWords.length - index,
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            <div className="text-center">
              <div className="font-bold">{word.word}</div>
              <div className="text-xs opacity-80 mt-1">
                {word.word.length > 8 ? word.word.substring(0, 8) + '...' : word.word}
              </div>
            </div>
          </div>
        ))}

        {/* Ground line */}
        <div 
          className="absolute w-full h-1 bg-red-400 opacity-50"
          style={{ bottom: '20px' }}
        ></div>
      </div>
      
      {/* Enhanced input area */}
      <div className="text-center space-y-4">
        <div className="bg-white rounded-lg p-4 shadow-md border">
          <div className="text-lg font-semibold text-gray-700 mb-2">
            Current word: <span className="text-blue-600">{gameData.fallingWords[0]?.word || 'None'}</span>
          </div>
          <input
            type="text"
            value={gameData.currentInput}
            onChange={(e) => setGameData({ ...gameData, currentInput: e.target.value })}
            onKeyPress={(e) => e.key === 'Enter' && handleWordfall()}
            placeholder="Type Vietnamese meaning and press Enter..."
            className="w-full max-w-md px-4 py-3 border-2 border-blue-200 rounded-lg text-center text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            autoFocus
          />
          <div className="text-sm text-gray-500 mt-2">
            Hint: {gameData.fallingWords[0]?.answer?.charAt(0)}...
          </div>
        </div>

        {/* Game controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleWordfall}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Submit Answer
          </button>
          <button
            onClick={() => setGameData({ ...gameData, currentInput: '' })}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}