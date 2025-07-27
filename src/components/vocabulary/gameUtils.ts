import { Difficulty, GameSettings } from './types';

export const difficultySettings: Record<Difficulty, GameSettings> = {
  easy: { timeLimit: 30, lives: 5, wordCount: 3, hints: 3 },
  medium: { timeLimit: 25, lives: 4, wordCount: 4, hints: 2 },
  hard: { timeLimit: 20, lives: 3, wordCount: 5, hints: 1 },
  expert: { timeLimit: 15, lives: 2, wordCount: 6, hints: 1 },
  nightmare: { timeLimit: 10, lives: 1, wordCount: 6, hints: 0 },
  hell: { timeLimit: 5, lives: 1, wordCount: 6, hints: 0 }
};

export const getDifficultyColor = (difficulty: Difficulty): string => {
  const colors = {
    easy: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    hard: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    expert: 'bg-orange-100 text-orange-800 border-orange-200',
    nightmare: 'bg-red-100 text-red-800 border-red-200',
    hell: 'bg-purple-100 text-purple-800 border-purple-200'
  };
  return colors[difficulty] || colors.easy;
};

export const playAudio = (audioUrl: string): void => {
  if (typeof window !== 'undefined') {
    const audio = new Audio(audioUrl);
    audio.play().catch(() => console.log('Audio not available'));
  }
};

export const getGameIcon = (gameType: string): string => {
  const icons = {
    flashcards: '📇',
    matching: '🔗',
    quiz: '❓',
    memory: '🧠',
    wordfall: '🌧️',
    typing: '⌨️'
  };
  return icons[gameType as keyof typeof icons] || '🎮';
};

export const getScoreMessage = (score: number): string => {
  if (score >= 100) return 'Excellent! 🌟';
  if (score >= 70) return 'Great job! 👏';
  if (score >= 50) return 'Good effort! 👍';
  return 'Keep practicing! 💪';
};
// Reusable game configuration system for multi-unit/grade scalability
export const createGameConfig = (options?: Partial<any>) => ({
  // Configurable for different units/grades/subjects
  curriculum: {
    unit: options?.unit || 'unit2',
    grade: options?.grade || 6,
    subject: options?.subject || 'english',
    language: options?.language || 'vi'
  },
  
  // Wordfall-specific settings
  wordfall: {
    gameAreaWidth: options?.gameAreaWidth || 500,
    gameAreaHeight: options?.gameAreaHeight || 300,
    fallSpeed: options?.fallSpeed || { min: 1, max: 3 },
    gravityAcceleration: options?.gravityAcceleration || 0.1,
    wordSpacing: options?.wordSpacing || 120,
    visualEffects: {
      particles: options?.particles ?? true,
      animations: options?.animations ?? true,
      soundEffects: options?.soundEffects ?? false
    }
  },

  // Analytics and progress tracking
  analytics: {
    trackProgress: options?.trackProgress ?? true,
    saveToLocalStorage: options?.saveToLocalStorage ?? true,
    sendToServer: options?.sendToServer ?? false
  }
});

// Game analytics helper
export const saveGameSession = (session: any) => {
  if (typeof window !== 'undefined') {
    const existingSessions = JSON.parse(localStorage.getItem('gameAnalytics') || '[]');
    existingSessions.push(session);
    localStorage.setItem('gameAnalytics', JSON.stringify(existingSessions));
  }
};

export const getGameAnalytics = () => {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('gameAnalytics') || '[]');
  }
  return [];
};
