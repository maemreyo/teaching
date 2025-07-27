'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVocabularyData } from '@/hooks/useVocabularyData';
import { useExerciseGenerator } from '@/hooks/useExerciseGenerator';
import { exerciseSections } from '@/config/exerciseSections';
import ExerciseSectionNav from '@/components/exercises/ExerciseSectionNav';
import ExerciseRenderer from '@/components/exercises/ExerciseRenderer';

export default function StudentExercisesPage() {
  const [currentSection, setCurrentSection] = useState<string>('vocabulary');
  const [currentExercise, setCurrentExercise] = useState<string>('multiple_choice');
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [sectionProgress, setSectionProgress] = useState<Record<string, number>>({});

  // Fetch vocabulary data from database
  const { vocabulary, loading, error } = useVocabularyData(2);
  
  // Generate exercises from database data
  const exercises = useExerciseGenerator(vocabulary || []);

  const handleSectionChange = (sectionId: string) => {
    setCurrentSection(sectionId);
    const section = exerciseSections.find(s => s.id === sectionId);
    if (section && section.exercises.length > 0) {
      setCurrentExercise(section.exercises[0]);
    }
  };

  const handleExerciseChange = (exerciseType: string) => {
    setCurrentExercise(exerciseType);
  };

  const handleAnswer = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const calculateProgress = (sectionId: string) => {
    const section = exerciseSections.find(s => s.id === sectionId);
    if (!section) return 0;
    
    const answeredQuestions = Object.keys(userAnswers).filter(key => 
      key.startsWith(sectionId)
    ).length;
    
    const totalQuestions = section.exercises.length * 10; // Estimate
    return Math.min((answeredQuestions / totalQuestions) * 100, 100);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Loading Unit 2 exercises...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-red-500">Error loading exercises: {error}</p>
        </div>
      </div>
    );
  }

  const currentSectionData = exerciseSections.find(s => s.id === currentSection);

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800">
          📚 Unit 2 Student Exercises
        </h1>
        <p className="text-lg text-gray-600">
          Practice and master "My Home" vocabulary, grammar, and communication skills
        </p>
        <div className="flex justify-center space-x-4">
          <Badge variant="secondary" className="text-sm">
            📖 {vocabulary?.length || 0} vocabulary words
          </Badge>
          <Badge variant="secondary" className="text-sm">
            ⭐ {Object.keys(userAnswers).length} answers completed
          </Badge>
        </div>
      </div>

      {/* Section Navigation */}
      <ExerciseSectionNav
        sections={exerciseSections}
        activeSection={currentSection}
        onSectionChange={handleSectionChange}
      />

      {/* Exercise Content */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>{currentSectionData?.icon}</span>
                <span>{currentSectionData?.title}</span>
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {currentSectionData?.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Progress</div>
              <Progress 
                value={calculateProgress(currentSection)} 
                className="w-32" 
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {currentSectionData && (
            <Tabs value={currentExercise} onValueChange={handleExerciseChange}>
              <TabsList className="grid w-full grid-cols-4">
                {currentSectionData.exercises.map((exercise) => (
                  <TabsTrigger 
                    key={exercise} 
                    value={exercise}
                    className="text-sm"
                  >
                    {exercise.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </TabsTrigger>
                ))}
              </TabsList>

              {currentSectionData.exercises.map((exercise) => (
                <TabsContent key={exercise} value={exercise} className="mt-6">
                  <ExerciseRenderer
                    activeSection={currentSection}
                    activeExercise={exercise}
                    exercises={exercises}
                    userAnswers={userAnswers}
                    onAnswer={handleAnswer}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle>📊 Learning Progress Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {exerciseSections.map((section) => (
              <div key={section.id} className="text-center p-4 border rounded-lg">
                <div className="text-2xl mb-2">{section.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {section.title.replace(/^📝\s*/, '').replace(/^📖\s*/, '').replace(/^🗣️\s*/, '').replace(/^💬\s*/, '').replace(/^📝\s*/, '').replace(/^🎨\s*/, '')}
                </h3>
                <Progress value={calculateProgress(section.id)} className="mb-2" />
                <p className="text-sm text-gray-600">
                  {Math.round(calculateProgress(section.id))}% Complete
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}