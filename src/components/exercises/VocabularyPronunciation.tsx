'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PronunciationExercise } from '@/hooks/useExerciseGenerator';

interface VocabularyPronunciationProps {
  exercises: PronunciationExercise[];
  onAnswer: (exerciseId: string, answer: any) => void;
  userAnswers: Record<string, any>;
}

export default function VocabularyPronunciation({ 
  exercises, 
  onAnswer, 
  userAnswers 
}: VocabularyPronunciationProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [playbackUrl, setPlaybackUrl] = useState<string>('');
  
  const exercise = exercises[currentExercise];

  const startRecording = () => {
    setIsRecording(true);
    // Implement recording logic
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Implement stop recording and analysis
  };

  const playAudio = (url: string) => {
    // Implement audio playback
    console.log('Playing audio:', url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Pronunciation Practice
        </h3>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {exercise.word}
        </div>
        <div className="text-blue-500 font-mono text-xl mb-2">
          {exercise.ipa}
        </div>
        <div className="text-lg text-blue-700 mb-4">
          Stress pattern: {exercise.stress_pattern}
        </div>
        <Button
          variant="outline"
          onClick={() => playAudio(exercise.audio_url)}
          className="mb-4"
        >
          🔊 Listen to pronunciation
        </Button>
      </div>

      <div className="bg-white p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
        <h4 className="font-semibold text-gray-800 mb-4">
          🎤 Record your pronunciation
        </h4>
        
        <div className="space-y-4">
          <Button
            variant={isRecording ? "destructive" : "default"}
            size="lg"
            onClick={isRecording ? stopRecording : startRecording}
            className="w-32 h-32 rounded-full text-2xl"
          >
            {isRecording ? "🛑" : "🎤"}
          </Button>
          
          <p className="text-gray-600">
            {isRecording ? "Recording... Click to stop" : "Click to start recording"}
          </p>
          
          {playbackUrl && (
            <div className="space-y-2">
              <Button variant="outline" onClick={() => playAudio(playbackUrl)}>
                🔊 Play your recording
              </Button>
              <div className="bg-green-50 p-3 rounded">
                <p className="text-green-800 font-semibold">Analysis Result</p>
                <p className="text-green-700 text-sm">{exercise.feedback}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={() => {
            if (currentExercise < exercises.length - 1) {
              setCurrentExercise(currentExercise + 1);
              setPlaybackUrl('');
            }
          }}
          disabled={currentExercise >= exercises.length - 1}
        >
          Next Word →
        </Button>
      </div>

      <div className="text-center text-sm text-gray-500">
        Word {currentExercise + 1} of {exercises.length}
      </div>
    </div>
  );
}