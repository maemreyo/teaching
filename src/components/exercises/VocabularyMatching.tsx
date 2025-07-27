'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { WordMatchingPair } from '@/hooks/useExerciseGenerator';

interface VocabularyMatchingProps {
  pairs: WordMatchingPair[];
  onAnswer: (answerId: string, answer: any) => void;
  userAnswers: Record<string, any>;
}

export default function VocabularyMatching({ 
  pairs, 
  onAnswer, 
  userAnswers 
}: VocabularyMatchingProps) {
  const [selectedEnglish, setSelectedEnglish] = useState<string>('');
  const [selectedVietnamese, setSelectedVietnamese] = useState<string>('');
  const [matches, setMatches] = useState<Array<{english: string, vietnamese: string}>>([]);
  const [attempts, setAttempts] = useState(0);

  const handleEnglishSelect = (word: string) => {
    setSelectedEnglish(word);
    if (selectedVietnamese) {
      checkMatch(word, selectedVietnamese);
    }
  };

  const handleVietnameseSelect = (word: string) => {
    setSelectedVietnamese(word);
    if (selectedEnglish) {
      checkMatch(selectedEnglish, word);
    }
  };

  const checkMatch = (english: string, vietnamese: string) => {
    const pair = pairs.find((p: any) => p.english === english && p.vietnamese === vietnamese);
    
    if (pair) {
      setMatches([...matches, { english, vietnamese }]);
      setSelectedEnglish('');
      setSelectedVietnamese('');
    } else {
      // Wrong match - show feedback and reset
      setTimeout(() => {
        setSelectedEnglish('');
        setSelectedVietnamese('');
      }, 1000);
    }
    setAttempts(attempts + 1);
  };

  const isMatched = (word: string, type: 'english' | 'vietnamese') => {
    return matches.some(match => match[type] === word);
  };

  const isCompleted = matches.length === pairs.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Match English words with Vietnamese meanings
        </h3>
        <p className="text-gray-600">
          Click on an English word, then click on its Vietnamese meaning
        </p>
        <div className="text-sm text-gray-500 mt-2">
          Matches: {matches.length}/{pairs.length} | Attempts: {attempts}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* English words */}
        <div className="space-y-3">
          <h4 className="font-semibold text-blue-800 text-center">English</h4>
          {pairs.map((pair: any) => (
            <Button
              key={pair.english}
              variant={
                isMatched(pair.english, 'english') 
                  ? "secondary" 
                  : selectedEnglish === pair.english 
                    ? "default" 
                    : "outline"
              }
              className="w-full h-16 text-lg"
              onClick={() => handleEnglishSelect(pair.english)}
              disabled={isMatched(pair.english, 'english')}
            >
              <div className="flex items-center space-x-2">
                <span>{pair.english}</span>
                <Button variant="ghost" size="sm">🔊</Button>
              </div>
            </Button>
          ))}
        </div>

        {/* Vietnamese words */}
        <div className="space-y-3">
          <h4 className="font-semibold text-green-800 text-center">Vietnamese</h4>
          {pairs.map((pair: any) => (
            <Button
              key={pair.vietnamese}
              variant={
                isMatched(pair.vietnamese, 'vietnamese')
                  ? "secondary"
                  : selectedVietnamese === pair.vietnamese
                    ? "default"
                    : "outline"
              }
              className="w-full h-16 text-lg"
              onClick={() => handleVietnameseSelect(pair.vietnamese)}
              disabled={isMatched(pair.vietnamese, 'vietnamese')}
            >
              {pair.vietnamese}
            </Button>
          ))}
        </div>
      </div>

      {isCompleted && (
        <div className="bg-green-50 p-6 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-green-800 mb-2">
            🎉 Excellent! All words matched correctly!
          </h3>
          <p className="text-green-700">
            You completed this exercise in {attempts} attempts.
          </p>
          <Button className="mt-4">
            Continue to Next Exercise →
          </Button>
        </div>
      )}
    </div>
  );
}