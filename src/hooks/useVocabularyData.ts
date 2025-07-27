'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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

export interface UseVocabularyDataReturn {
  vocabulary: VocabularyWord[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVocabularyData(unitNumber: number = 2): UseVocabularyDataReturn {
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVocabulary = async () => {
    try {
      setLoading(true);
      setError(null);

      // First, get the unit
      const { data: units, error: unitError } = await supabase
        .from('units')
        .select('id, title, curricula(name, grade_level)')
        .eq('unit_number', unitNumber)
        .limit(1);

      if (unitError) {
        throw new Error(`Failed to fetch unit: ${unitError.message}`);
      }

      if (!units || units.length === 0) {
        throw new Error(`Unit ${unitNumber} not found`);
      }

      const unit = units[0];

      // Then fetch vocabulary for this unit with examples from separate table
      const { data: vocabData, error: vocabError } = await supabase
        .from('vocabulary')
        .select(`
          id,
          word,
          pronunciation_ipa,
          meaning_vietnamese,
          definition_english,
          word_type,
          difficulty_level,
          frequency_rank,
          lesson_introduced,
          tags,
          enriched_learning,
          audio_url,
          unit_id,
          vocabulary_examples (
            id,
            sentence,
            translation,
            audio_url,
            order_index
          )
        `)
        .eq('unit_id', unit.id)
        .order('lesson_introduced', { ascending: true })
        .order('word', { ascending: true });

      if (vocabError) {
        throw new Error(`Failed to fetch vocabulary: ${vocabError.message}`);
      }

      // Transform data to ensure consistency with expected interface
      const transformedData = (vocabData || []).map(word => ({
        ...word,
        // Ensure vocabulary_examples is always an array
        vocabulary_examples: word.vocabulary_examples || [],
        // Add backward compatibility for components expecting 'examples'
        examples: (word.vocabulary_examples || []).map(ex => ({
          sentence: ex.sentence,
          translation: ex.translation,
          audio_url: ex.audio_url
        }))
      }));

      console.log(`📚 Loaded ${transformedData.length} vocabulary words from Unit ${unitNumber}`);
      setVocabulary(transformedData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error fetching vocabulary data:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabulary();
  }, [unitNumber]);

  return {
    vocabulary,
    loading,
    error,
    refetch: fetchVocabulary
  };
}

// Helper function to get vocabulary by difficulty level
export function filterVocabularyByDifficulty(
  vocabulary: VocabularyWord[], 
  maxDifficulty: number = 3
): VocabularyWord[] {
  return vocabulary.filter(word => word.difficulty_level <= maxDifficulty);
}

// Helper function to get vocabulary by lesson
export function filterVocabularyByLesson(
  vocabulary: VocabularyWord[], 
  lessonNumber: number
): VocabularyWord[] {
  return vocabulary.filter(word => word.lesson_introduced === lessonNumber);
}

// Helper function to get vocabulary by tags
export function filterVocabularyByTags(
  vocabulary: VocabularyWord[], 
  tags: string[]
): VocabularyWord[] {
  return vocabulary.filter(word => 
    word.tags && word.tags.some(tag => tags.includes(tag))
  );
}

// Helper function to prepare vocabulary for games
export function prepareVocabularyForGame(
  vocabulary: VocabularyWord[],
  gameSettings: {
    wordCount?: number;
    difficulty?: 'easy' | 'medium' | 'hard' | 'expert' | 'nightmare' | 'hell';
    randomize?: boolean;
  } = {}
): VocabularyWord[] {
  const { wordCount = 6, difficulty = 'easy', randomize = true } = gameSettings;
  
  // Map difficulty to numeric levels
  const difficultyMap = {
    easy: 1,
    medium: 2,
    hard: 3,
    expert: 3,
    nightmare: 3,
    hell: 3
  };
  
  let filteredWords = filterVocabularyByDifficulty(vocabulary, difficultyMap[difficulty]);
  
  // If we don't have enough words, include all vocabulary
  if (filteredWords.length < wordCount) {
    filteredWords = vocabulary;
  }
  
  // Randomize if requested
  if (randomize) {
    filteredWords = [...filteredWords].sort(() => Math.random() - 0.5);
  }
  
  // Return requested number of words
  return filteredWords.slice(0, wordCount);
}