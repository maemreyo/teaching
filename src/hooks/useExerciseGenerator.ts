import { useMemo } from 'react';
import { VocabularyWord } from '@/hooks/useVocabularyData';

export interface MultipleChoiceQuestion {
  id: string;
  word: string;
  pronunciation: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
  enriched_learning: {
    memory_aid: string;
    common_mistake: string;
    context_corner: string;
  };
}

export interface FillBlankQuestion {
  id: string;
  sentence: string;
  answer: string;
  options: string[];
  translation: string;
  hint: string;
  word_family: string[];
}

export interface WordMatchingPair {
  english: string;
  vietnamese: string;
  image_description: string;
  audio_url: string;
}

export interface PronunciationExercise {
  word: string;
  ipa: string;
  stress_pattern: string;
  audio_url: string;
  practice_type: string;
  feedback: string;
}

export interface VocabularyExercises {
  multiple_choice: {
    title: string;
    type: string;
    questions: MultipleChoiceQuestion[];
  };
  fill_blanks: {
    title: string;
    type: string;
    questions: FillBlankQuestion[];
  };
  word_matching: {
    title: string;
    type: string;
    pairs: WordMatchingPair[];
  };
  pronunciation: {
    title: string;
    type: string;
    exercises: PronunciationExercise[];
  };
}

export function useExerciseGenerator(vocabulary: VocabularyWord[]): VocabularyExercises | null {
  return useMemo(() => {
    if (!vocabulary || vocabulary.length === 0) return null;

    // Generate multiple choice questions from database vocabulary
    const multipleChoiceQuestions: MultipleChoiceQuestion[] = vocabulary.map((word, index) => {
      // Create distractors by randomly selecting other words' meanings
      const otherWords = vocabulary.filter(w => w.id !== word.id);
      const distractors = otherWords
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(w => w.meaning_vietnamese);
      
      const options = [word.meaning_vietnamese, ...distractors].sort(() => Math.random() - 0.5);

      // Handle enriched_learning data safely
      const enrichedLearning = word.enriched_learning || {};
      const memoryAid = typeof enrichedLearning.memory_aid === 'object' && enrichedLearning.memory_aid 
        ? enrichedLearning.memory_aid.idea || `Remember: ${word.word} = ${word.meaning_vietnamese}`
        : `Remember: ${word.word} = ${word.meaning_vietnamese}`;
      
      const commonMistake = typeof enrichedLearning.common_mistake === 'object' && enrichedLearning.common_mistake
        ? enrichedLearning.common_mistake.mistake || 'Practice pronunciation carefully'
        : 'Practice pronunciation carefully';

      const contextCorner = typeof enrichedLearning.context_corner === 'object' && enrichedLearning.context_corner
        ? enrichedLearning.context_corner.note || word.definition_english
        : word.definition_english;

      return {
        id: `vocab_mc_${index + 1}`,
        word: word.word,
        pronunciation: word.pronunciation_ipa || '',
        question: `What does '${word.word}' mean in Vietnamese?`,
        options,
        correct: word.meaning_vietnamese,
        explanation: `${word.word} means '${word.meaning_vietnamese}' - ${word.definition_english}`,
        enriched_learning: {
          memory_aid: memoryAid,
          common_mistake: commonMistake,
          context_corner: contextCorner
        }
      };
    });

    // Generate fill-in-blanks questions from database vocabulary and examples
    const fillBlankQuestions: FillBlankQuestion[] = vocabulary.flatMap((word, wordIndex) => {
      // Use examples from database if available
      const examples = word.vocabulary_examples || word.examples || [];
      
      if (examples.length > 0) {
        return examples.map((example: any, exampleIndex: number) => ({
          id: `vocab_fb_${wordIndex}_${exampleIndex}`,
          sentence: example.sentence.replace(new RegExp(word.word, 'gi'), '_______'),
          answer: word.word,
          options: [word.word, vocabulary[(wordIndex + 1) % vocabulary.length]?.word || 'option1', vocabulary[(wordIndex + 2) % vocabulary.length]?.word || 'option2'],
          translation: example.translation,
          hint: `This word means "${word.meaning_vietnamese}"`,
          word_family: [word.word]
        }));
      } else {
        // Create a generic sentence if no examples available
        return [{
          id: `vocab_fb_${wordIndex}`,
          sentence: `There is a _______ in my house.`,
          answer: word.word,
          options: [word.word, vocabulary[(wordIndex + 1) % vocabulary.length]?.word || 'option1', vocabulary[(wordIndex + 2) % vocabulary.length]?.word || 'option2'],
          translation: `Có một ${word.meaning_vietnamese} trong nhà tôi.`,
          hint: `This word means "${word.meaning_vietnamese}"`,
          word_family: [word.word]
        }];
      }
    });

    // Generate word matching pairs from database vocabulary
    const wordMatchingPairs: WordMatchingPair[] = vocabulary.map(word => ({
      english: word.word,
      vietnamese: word.meaning_vietnamese,
      image_description: word.definition_english,
      audio_url: word.audio_url || `/audio/${word.word}.mp3`
    }));

    // Generate pronunciation exercises from database vocabulary
    const pronunciationExercises: PronunciationExercise[] = vocabulary.map(word => ({
      word: word.word,
      ipa: word.pronunciation_ipa || '',
      stress_pattern: word.word,
      audio_url: word.audio_url || `/audio/${word.word}.mp3`,
      practice_type: 'stress_identification',
      feedback: `Practice the pronunciation of "${word.word}"`
    }));

    return {
      multiple_choice: {
        title: "Multiple Choice - Vocabulary Meaning",
        type: "multiple_choice",
        questions: multipleChoiceQuestions
      },
      fill_blanks: {
        title: "Fill in the Blanks - Context Usage",
        type: "fill_blanks",
        questions: fillBlankQuestions
      },
      word_matching: {
        title: "Word Matching - Visual Context",
        type: "word_matching",
        pairs: wordMatchingPairs
      },
      pronunciation: {
        title: "Pronunciation Practice",
        type: "pronunciation",
        exercises: pronunciationExercises
      }
    };
  }, [vocabulary]);
}