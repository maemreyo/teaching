'use client';

import { VocabularyExercises } from '@/hooks/useExerciseGenerator';
import VocabularyMultipleChoice from './VocabularyMultipleChoice';
import VocabularyFillBlanks from './VocabularyFillBlanks';
import VocabularyMatching from './VocabularyMatching';
import VocabularyPronunciation from './VocabularyPronunciation';

interface ExerciseRendererProps {
  activeSection: string;
  activeExercise: string;
  exercises: VocabularyExercises | null;
  userAnswers: Record<string, any>;
  onAnswer: (questionId: string, answer: any) => void;
}

export default function ExerciseRenderer({
  activeSection,
  activeExercise,
  exercises,
  userAnswers,
  onAnswer
}: ExerciseRendererProps) {
  if (!exercises) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading exercises...</p>
      </div>
    );
  }

  if (activeSection === 'vocabulary') {
    switch (activeExercise) {
      case 'multiple_choice':
        return (
          <VocabularyMultipleChoice
            questions={exercises.multiple_choice.questions}
            onAnswer={onAnswer}
            userAnswers={userAnswers}
          />
        );

      case 'fill_blanks':
        return (
          <VocabularyFillBlanks
            questions={exercises.fill_blanks.questions}
            onAnswer={onAnswer}
            userAnswers={userAnswers}
          />
        );

      case 'word_matching':
        return (
          <VocabularyMatching
            pairs={exercises.word_matching.pairs}
            onAnswer={onAnswer}
            userAnswers={userAnswers}
          />
        );

      case 'pronunciation':
        return (
          <VocabularyPronunciation
            exercises={exercises.pronunciation.exercises}
            onAnswer={onAnswer}
            userAnswers={userAnswers}
          />
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Select an exercise type to begin</p>
          </div>
        );
    }
  }

  return (
    <div className="text-center py-8">
      <p className="text-gray-500">
        {activeSection} exercises are coming soon!
      </p>
    </div>
  );
}