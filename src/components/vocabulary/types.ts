// Generic game configuration for multi-unit/grade scalability
export interface GameConfig {
  unit: string;
  grade: number;
  subject: string;
  language: 'en' | 'vi' | 'fr' | 'es' | 'de';
  curriculum: string;
}

export interface GameSession {
  id: string;
  gameConfig: GameConfig;
  startTime: number;
  endTime?: number;
  scores: number[];
  difficulty: Difficulty;
  gameType: GameType;
  wordsCompleted: number;
  totalWords: number;
  accuracy: number;
}

export interface GameAnalytics {
  totalGamesPlayed: number;
  averageScore: number;
  preferredDifficulty: Difficulty;
  strongWords: string[];
  weakWords: string[];
  improvementTrends: {
    date: string;
    score: number;
    accuracy: number;
  }[];
}

export interface VocabularyWord {
  id: string;
  word: string;
  pronunciation_ipa: string;
  meaning_vietnamese: string;
  definition_english: string;
  word_type: string;
  difficulty_level: number;
  frequency_rank: string;
  lesson_introduced: number;
  tags: string[];
  vocabulary_examples: Array<{
    id: string;
    sentence: string;
    translation: string;
    audio_url?: string;
    order_index: number;
  }>;
  // Backward compatibility field
  examples: Array<{
    sentence: string;
    translation: string;
    audio_url?: string;
  }>;
  enriched_learning: {
    common_mistake?: {
      mistake: string;
      correction: string;
      example_mistake?: string;
      example_correction?: string;
    };
    context_corner?: {
      title: string;
      note: string;
    };
    memory_aid?: {
      title: string;
      idea: string;
    };
  };
  audio_url?: string;
  unit_id: string;
}

export type GameType = 'flashcards' | 'matching' | 'quiz' | 'memory' | 'wordfall' | 'typing';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert' | 'nightmare' | 'hell';

export interface VocabularyGameProps {
  words: VocabularyWord[];
  gameType: GameType;
  difficulty: Difficulty;
  onScoreUpdate: (score: number) => void;
}

export interface GameSettings {
  timeLimit: number;
  lives: number;
  wordCount: number;
  hints: number;
}

// Enhanced game settings for WordfallGame
export interface WordfallSettings extends GameSettings {
  gameAreaWidth: number;
  gameAreaHeight: number;
  fallSpeed: {
    min: number;
    max: number;
  };
  spawnDelay: number;
  gravityAcceleration: number;
  wordSpacing: number;
  visualEffects: {
    particles: boolean;
    animations: boolean;
    soundEffects: boolean;
  };
}

// Physics configuration for falling words
export interface WordPhysics {
  acceleration: number;
  maxSpeed: number;
  bounceEffect: boolean;
  rotationSpeed: number;
}

// Visual customization
export interface WordfallTheme {
  backgroundColor: string;
  wordColors: string[];
  effectColors: {
    correct: string;
    incorrect: string;
    bonus: string;
  };
  fonts: {
    wordFont: string;
    uiFont: string;
  };
}

export interface BaseGameProps {
  words: VocabularyWord[];
  difficulty: Difficulty;
  settings: GameSettings;
  onScoreUpdate: (score: number) => void;
  onGameEnd: (won: boolean) => void;
}

export interface GameState {
  score: number;
  lives: number;
  timeLeft: number;
  isPlaying: boolean;
  hintsUsed: number;
}

// Card data for flashcard game
export interface FlashcardData {
  question: string;
  answer: string;
  pronunciation: string;
  audio: string;
  definition: string;
  memoryAid: any;
  commonMistake: any;
  contextCorner: any;
  examples: Array<{
    sentence: string;
    translation: string;
    audio_url?: string;
  }>;
  wordType: string;
  tags: string[];
}