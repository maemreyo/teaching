'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VocabularyGames from '@/components/vocabulary/VocabularyGames';
import { useVocabularyData, VocabularyWord } from '@/hooks/useVocabularyData';
import Link from 'next/link';

const difficultyLevels = ['easy', 'medium', 'hard', 'expert', 'nightmare', 'hell'];
const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-blue-100 text-blue-800',
  hard: 'bg-yellow-100 text-yellow-800',
  expert: 'bg-orange-100 text-orange-800',
  nightmare: 'bg-red-100 text-red-800',
  hell: 'bg-purple-100 text-purple-800'
};

const difficultySettings = {
  easy: { timeLimit: 30, lives: 5, wordCount: 3, hints: 3 },
  medium: { timeLimit: 25, lives: 4, wordCount: 4, hints: 2 },
  hard: { timeLimit: 20, lives: 3, wordCount: 5, hints: 1 },
  expert: { timeLimit: 15, lives: 2, wordCount: 6, hints: 1 },
  nightmare: { timeLimit: 10, lives: 1, wordCount: 6, hints: 0 },
  hell: { timeLimit: 5, lives: 1, wordCount: 6, hints: 0 }
};

interface VocabularyLessonProps {}

export default function VocabularyLesson({}: VocabularyLessonProps) {
  const [currentMode, setCurrentMode] = useState<'theory' | 'games' | 'exercises'>('theory');
  const [currentWord, setCurrentWord] = useState(0);
  const [gameLevel, setGameLevel] = useState<string>('easy');
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameType, setGameType] = useState<'flashcards' | 'matching' | 'quiz' | 'memory' | 'wordfall' | 'typing'>('flashcards');
  const [progress, setProgress] = useState(0);

  // Fetch vocabulary from database
  const { vocabulary: vocabularyData, loading, error } = useVocabularyData(2);

  const playAudio = (audioUrl: string) => {
    if (typeof window !== 'undefined') {
      const audio = new Audio(audioUrl);
      audio.play().catch(() => {
        // Fallback for audio not available
        console.log('Audio not available');
      });
    }
  };

  const nextWord = () => {
    if (currentWord < vocabularyData.length - 1) {
      setCurrentWord(currentWord + 1);
      setProgress(((currentWord + 1) / vocabularyData.length) * 100);
    }
  };

  const prevWord = () => {
    if (currentWord > 0) {
      setCurrentWord(currentWord - 1);
      setProgress(((currentWord - 1) / vocabularyData.length) * 100);
    }
  };

  // Handle loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading vocabulary...</h2>
          <p className="text-gray-600">Fetching Unit 2 data from database</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error loading vocabulary</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  if (!vocabularyData || vocabularyData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">No vocabulary found</h2>
          <p className="text-yellow-600">Please check if Unit 2 data has been imported to the database</p>
        </div>
      </div>
    );
  }

  const word = vocabularyData[currentWord];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/unit2" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <span>←</span>
                <span>Unit 2 Hub</span>
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Unit 2: My Home - Vocabulary</h1>
                <p className="text-gray-600">Interactive vocabulary lesson for Grade 6</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-blue-100 text-blue-800">Global Success</Badge>
              <Badge className="bg-green-100 text-green-800">Grade 6</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={currentMode} onValueChange={(value) => setCurrentMode(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="theory" className="text-lg">
              📚 Theory Presentation
            </TabsTrigger>
            <TabsTrigger value="games" className="text-lg">
              🎮 Vocabulary Games
            </TabsTrigger>
            <TabsTrigger value="exercises" className="text-lg">
              ✏️ Student Exercises
            </TabsTrigger>
          </TabsList>

          {/* Theory Presentation Tab */}
          <TabsContent value="theory" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">
                    Word {currentWord + 1} of {vocabularyData.length}
                  </CardTitle>
                  <Badge variant="secondary" className={difficultyColors[`difficulty_${word.difficulty_level}` as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800'}>
                    Level {word.difficulty_level}
                  </Badge>
                </div>
                <Progress value={progress} className="mt-2 bg-white/20" />
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Word Display */}
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-5xl font-bold text-gray-900 mb-2 animate-pulse">
                        {word.word}
                      </h2>
                      <div className="flex items-center justify-center space-x-4">
                        <p className="text-xl text-blue-600 font-mono">{word.pronunciation_ipa}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => playAudio(word.audio_url || '')}
                          className="hover:bg-blue-50"
                        >
                          🔊 Play
                        </Button>
                      </div>
                      <p className="text-2xl text-green-600 font-semibold mt-2">{word.meaning_vietnamese}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-gray-800 mb-2">Definition:</h3>
                      <p className="text-gray-700">{word.definition_english}</p>
                    </div>

                    {word.enriched_learning?.memory_aid && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-blue-800 mb-2">💡 {word.enriched_learning.memory_aid.title}:</h3>
                        <p className="text-blue-700">{word.enriched_learning.memory_aid.idea}</p>
                      </div>
                    )}

                    {word.enriched_learning?.common_mistake && (
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Common Mistake:</h3>
                        <p className="text-yellow-700">{word.enriched_learning.common_mistake.mistake}</p>
                        {word.enriched_learning.common_mistake.correction && (
                          <p className="text-yellow-600 text-sm mt-2"><strong>Correction:</strong> {word.enriched_learning.common_mistake.correction}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Example & Image */}
                  <div className="space-y-6">
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 text-center">
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <span className="text-6xl">{word.word === 'apartment' ? '🏢' : 
                                                   word.word === 'kitchen' ? '🍳' :
                                                   word.word === 'living room' ? '🛋️' :
                                                   word.word === 'bathroom' ? '🚿' :
                                                   word.word === 'fridge' ? '❄️' : '🪑'}</span>
                      </div>
                      <p className="text-lg font-medium text-gray-800">Visual placeholder for {word.word}</p>
                    </div>

                    {word.vocabulary_examples && word.vocabulary_examples.length > 0 && (
                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="font-semibold text-green-800 mb-3">📝 Example Sentence:</h3>
                        <div className="space-y-2">
                          <p className="text-gray-800 text-lg font-medium">"{word.vocabulary_examples[0].sentence}"</p>
                          <p className="text-green-700 italic">"{word.vocabulary_examples[0].translation}"</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => playAudio(word.vocabulary_examples[0].audio_url || `/audio/sentences/${word.word}_1.mp3`)}
                            className="mt-2"
                          >
                            🔊 Play Example
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={prevWord}
                    disabled={currentWord === 0}
                    className="flex items-center space-x-2"
                  >
                    <span>←</span>
                    <span>Previous Word</span>
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Perfect for Google Meet screen sharing
                    </p>
                  </div>

                  <Button
                    onClick={nextWord}
                    disabled={currentWord === vocabularyData.length - 1}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <span>Next Word</span>
                    <span>→</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Game Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>🎮 Game Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { id: 'flashcards', name: 'Flashcards', icon: '📇' },
                    { id: 'wordfall', name: 'Word Fall', icon: '🌧️' },
                    { id: 'matching', name: 'Word Matching', icon: '🔗' },
                    { id: 'quiz', name: 'Quick Quiz', icon: '❓' },
                    { id: 'memory', name: 'Memory Game', icon: '🧠' },
                    { id: 'typing', name: 'Speed Typing', icon: '⌨️' }
                  ].map((game) => (
                    <Button
                      key={game.id}
                      variant={gameType === game.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setGameType(game.id as any)}
                    >
                      <span className="mr-2">{game.icon}</span>
                      {game.name}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Difficulty Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>⚡ Difficulty Level</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {difficultyLevels.map((level) => (
                    <Button
                      key={level}
                      variant={gameLevel === level ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setGameLevel(level)}
                    >
                      <Badge className={`mr-2 ${difficultyColors[level as keyof typeof difficultyColors]}`}>
                        {level.toUpperCase()}
                      </Badge>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Game Launch Area */}
              <div className="lg:col-span-2">
                <Card className="w-full">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <span>🎮</span>
                        <span>Launch Game in New Tab</span>
                      </CardTitle>
                      <Badge className={difficultyColors[gameLevel as keyof typeof difficultyColors]}>
                        {gameLevel.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-6">
                      <div className="text-6xl mb-4">
                        {gameType === 'flashcards' ? '📇' :
                         gameType === 'wordfall' ? '🌧️' :
                         gameType === 'matching' ? '🔗' :
                         gameType === 'quiz' ? '❓' :
                         gameType === 'memory' ? '🧠' : '⌨️'}
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">
                          {gameType.charAt(0).toUpperCase() + gameType.slice(1)} Game
                        </h3>
                        <p className="text-gray-600">
                          Selected: <strong>{gameLevel.toUpperCase()}</strong> difficulty
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium">Words:</span> {difficultySettings[gameLevel as keyof typeof difficultySettings]?.wordCount || 6}
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium">Time:</span> {difficultySettings[gameLevel as keyof typeof difficultySettings]?.timeLimit || 30}s
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        size="lg"
                        onClick={() => {
                          // Store game data in sessionStorage to avoid URL length limits
                          const gameData = {
                            words: vocabularyData.slice(0, difficultySettings[gameLevel as keyof typeof difficultySettings]?.wordCount || 6),
                            difficulty: gameLevel,
                            gameType: gameType
                          };
                          sessionStorage.setItem('gameData', JSON.stringify(gameData));
                          
                          const gameUrl = `/unit2/games/${gameType}?difficulty=${gameLevel}`;
                          window.open(gameUrl, '_blank');
                        }}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      >
                        🚀 Launch Game in New Tab
                      </Button>
                      
                      <p className="text-xs text-gray-500">
                        Game will open in a separate tab for better focus and performance
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Student Exercises Tab */}
          <TabsContent value="exercises" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Student Interface Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>👨‍🎓 Student Exercise Interface</CardTitle>
                  <p className="text-sm text-gray-600">This is what students will see</p>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Student Exercise Area</h3>
                    <p className="text-gray-600 mb-4">
                      Interactive exercises based on Unit 2 vocabulary
                    </p>
                    <Button variant="outline" asChild>
                      <a href="/unit2/student-exercises" target="_blank">
                        🚀 Launch Student View
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Teacher Grading Dashboard Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>👩‍🏫 Teacher Grading Dashboard</CardTitle>
                  <p className="text-sm text-gray-600">Track student progress and assign scores</p>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Grading Interface</h3>
                    <p className="text-gray-600 mb-4">
                      Monitor student performance and provide feedback
                    </p>
                    <Button variant="outline" asChild>
                      <a href="/unit2/teacher-dashboard" target="_blank">
                        📈 Open Grading Dashboard
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Homework Assignment Preview */}
            <Card>
              <CardHeader>
                <CardTitle>📚 Homework Assignment Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-yellow-800 mb-4">Unit 2 Vocabulary Homework</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Exercise 1: Match Words</h4>
                      <p className="text-sm text-gray-600">Match vocabulary words with their Vietnamese meanings</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Exercise 2: Fill in Blanks</h4>
                      <p className="text-sm text-gray-600">Complete sentences using Unit 2 vocabulary</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Exercise 3: Pronunciation</h4>
                      <p className="text-sm text-gray-600">Record yourself saying each word correctly</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Exercise 4: Creative Writing</h4>
                      <p className="text-sm text-gray-600">Describe your home using new vocabulary</p>
                    </div>
                  </div>
                  <Button className="mt-4 bg-yellow-600 hover:bg-yellow-700">
                    📄 Generate PDF Homework
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}