'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

// Mock student data for demonstration
const studentData = {
  id: 'student_001',
  name: 'Nguyễn Văn A',
  grade: 6,
  exercises: {
    matching: {
      completed: true,
      score: 85,
      timeSpent: 420, // in seconds
      attempts: 1,
      correctAnswers: 5,
      totalQuestions: 6,
      submittedAt: new Date('2025-01-25T14:30:00'),
      details: [
        { word: 'apartment', vietnamese: 'căn hộ', correct: true },
        { word: 'kitchen', vietnamese: 'nhà bếp', correct: true },
        { word: 'living room', vietnamese: 'phòng khách', correct: true },
        { word: 'bathroom', vietnamese: 'phòng tắm', correct: true },
        { word: 'fridge', vietnamese: 'tủ lạnh', correct: true },
        { word: 'sofa', vietnamese: 'ghế sô pha', correct: false, studentAnswer: 'giường' }
      ]
    },
    fillBlanks: {
      completed: true,
      score: 100,
      timeSpent: 180,
      attempts: 1,
      correctAnswers: 3,
      totalQuestions: 3,
      submittedAt: new Date('2025-01-25T14:35:00'),
      details: [
        { 
          question: 'There is a new _______ in the kitchen.',
          correctAnswer: 'fridge',
          studentAnswer: 'fridge',
          correct: true
        },
        {
          question: 'My family watches TV in the _______.',
          correctAnswer: 'living room',
          studentAnswer: 'living room',
          correct: true
        },
        {
          question: 'We moved to a new _______ last month.',
          correctAnswer: 'apartment',
          studentAnswer: 'apartment',
          correct: true
        }
      ]
    },
    pronunciation: {
      completed: true,
      score: 78,
      timeSpent: 300,
      attempts: 2,
      recordings: [
        { word: 'apartment', submitted: true, teacherScore: 8, maxScore: 10, feedback: 'Good pronunciation, slight accent on first syllable' },
        { word: 'kitchen', submitted: true, teacherScore: 9, maxScore: 10, feedback: 'Excellent!' },
        { word: 'living room', submitted: true, teacherScore: 7, maxScore: 10, feedback: 'Need to work on the "ing" sound' },
        { word: 'bathroom', submitted: true, teacherScore: 8, maxScore: 10, feedback: 'Good, clear pronunciation' }
      ]
    },
    writing: {
      completed: true,
      score: 0, // Not graded yet
      timeSpent: 600,
      attempts: 1,
      submittedAt: new Date('2025-01-25T14:45:00'),
      content: `My home is a small apartment in the city. We have a modern kitchen with a big fridge. Our living room has a comfortable sofa where we watch TV together. The bathroom is next to my parents' bedroom. I love my home because it's cozy and warm.`,
      wordCount: 45,
      vocabularyUsed: ['apartment', 'kitchen', 'fridge', 'living room', 'sofa', 'bathroom'],
      teacherFeedback: '',
      teacherScore: 0
    }
  },
  overallProgress: {
    completedExercises: 4,
    totalExercises: 4,
    averageScore: 88,
    totalTimeSpent: 1500,
    lastActivity: new Date('2025-01-25T14:45:00')
  }
};

interface TeacherDashboardProps {}

export default function TeacherDashboard({}: TeacherDashboardProps) {
  const [currentView, setCurrentView] = useState<'overview' | 'detailed' | 'grading'>('overview');
  const [selectedExercise, setSelectedExercise] = useState<string>('writing');
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [gradingSubmitted, setGradingSubmitted] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const submitGrading = () => {
    // In real implementation, this would save to database
    setGradingSubmitted(true);
    // Update student data with new feedback and score
    studentData.exercises.writing.teacherFeedback = feedback;
    studentData.exercises.writing.teacherScore = score;
    studentData.exercises.writing.score = score;
  };

  const exportToPDF = () => {
    // Placeholder for PDF export functionality
    alert('PDF export feature will generate a detailed report for parents including:\n\n' +
          '• Student performance summary\n' +
          '• Exercise details and scores\n' +
          '• Teacher feedback\n' +
          '• Recommendations for improvement\n' +
          '• Time spent on each activity');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Teacher Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">👩‍🏫 Teacher Dashboard - Unit 2</h1>
              <p className="text-gray-600">Monitor student progress and provide feedback</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">📊 Grade 6</Badge>
              <Badge className="bg-purple-100 text-purple-800">1 Student</Badge>
              <Button onClick={exportToPDF} variant="outline">
                📄 Export PDF Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Student Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">👨‍🎓 {studentData.name}</CardTitle>
                <p className="text-gray-600">Grade {studentData.grade} • Student ID: {studentData.id}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {studentData.overallProgress.averageScore}%
                </div>
                <p className="text-sm text-gray-600">Overall Score</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {studentData.overallProgress.completedExercises}/{studentData.overallProgress.totalExercises}
                </div>
                <p className="text-sm text-gray-600">Exercises Completed</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {formatTime(studentData.overallProgress.totalTimeSpent)}
                </div>
                <p className="text-sm text-gray-600">Total Time Spent</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">
                  {studentData.overallProgress.lastActivity.toLocaleDateString()}
                </div>
                <p className="text-sm text-gray-600">Last Activity</p>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">100%</div>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="overview">📊 Overview</TabsTrigger>
            <TabsTrigger value="detailed">🔍 Detailed Results</TabsTrigger>
            <TabsTrigger value="grading">✏️ Grading & Feedback</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Exercise Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>📋 Exercise Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(studentData.exercises).map(([key, exercise]) => (
                    <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium capitalize">
                          {key === 'fillBlanks' ? 'Fill in Blanks' : key}
                          {key === 'matching' ? ' 🔗' : 
                           key === 'fillBlanks' ? ' 📝' :
                           key === 'pronunciation' ? ' 🎤' : ' ✍️'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Time: {formatTime(exercise.timeSpent)} • 
                          Attempts: {exercise.attempts}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getScoreBadge(exercise.score)}>
                          {exercise.score}%
                        </Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {exercise.completed ? '✅ Completed' : '⏳ In Progress'}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle>📈 Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Vocabulary Recognition', 'Grammar Application', 'Pronunciation', 'Writing Skills'].map((skill, index) => {
                      const scores = [85, 100, 78, 0]; // Placeholder scores
                      return (
                        <div key={skill}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{skill}</span>
                            <span className={getScoreColor(scores[index])}>{scores[index] || 'Not graded'}%</span>
                          </div>
                          <Progress value={scores[index]} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>⚡ Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    variant="outline" 
                    className="p-6 h-auto flex-col"
                    onClick={() => setCurrentView('grading')}
                  >
                    <div className="text-2xl mb-2">✏️</div>
                    <div className="text-center">
                      <div className="font-medium">Grade Writing</div>
                      <div className="text-xs text-gray-600">1 pending</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="p-6 h-auto flex-col"
                    onClick={exportToPDF}
                  >
                    <div className="text-2xl mb-2">📄</div>
                    <div className="text-center">
                      <div className="font-medium">Export Report</div>
                      <div className="text-xs text-gray-600">For parents</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="p-6 h-auto flex-col"
                    onClick={() => setCurrentView('detailed')}
                  >
                    <div className="text-2xl mb-2">🔍</div>
                    <div className="text-center">
                      <div className="font-medium">View Details</div>
                      <div className="text-xs text-gray-600">All exercises</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Detailed Results Tab */}
          <TabsContent value="detailed" className="space-y-6">
            {Object.entries(studentData.exercises).map(([exerciseType, exercise]) => (
              <Card key={exerciseType}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="capitalize">
                      {exerciseType === 'fillBlanks' ? 'Fill in Blanks' : exerciseType} Results
                      {exerciseType === 'matching' ? ' 🔗' : 
                       exerciseType === 'fillBlanks' ? ' 📝' :
                       exerciseType === 'pronunciation' ? ' 🎤' : ' ✍️'}
                    </CardTitle>
                    <Badge className={getScoreBadge(exercise.score)}>
                      {exercise.score}%
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Submitted: {exercise.submittedAt?.toLocaleString()} • 
                    Time spent: {formatTime(exercise.timeSpent)}
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Matching Exercise Details */}
                  {exerciseType === 'matching' && 'details' in exercise && (
                    <div className="space-y-2">
                      {exercise.details.map((item: any, index: number) => (
                        <div key={index} className={`p-3 rounded-lg border ${
                          item.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-medium">{item.word}</span> → 
                              <span className="ml-1">{item.vietnamese}</span>
                              {!item.correct && item.studentAnswer && (
                                <span className="text-red-600 ml-2">
                                  (Student answered: {item.studentAnswer})
                                </span>
                              )}
                            </div>
                            <div>
                              {item.correct ? '✅' : '❌'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fill in Blanks Details */}
                  {exerciseType === 'fillBlanks' && 'details' in exercise && (
                    <div className="space-y-4">
                      {exercise.details.map((item: any, index: number) => (
                        <div key={index} className={`p-4 rounded-lg border ${
                          item.correct ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                        }`}>
                          <div className="mb-2">
                            <strong>Question:</strong> {item.question}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div>
                              <strong>Correct Answer:</strong> 
                              <span className="text-green-600 ml-1">{item.correctAnswer}</span>
                            </div>
                            <div>
                              <strong>Student Answer:</strong>
                              <span className={`ml-1 ${item.correct ? 'text-green-600' : 'text-red-600'}`}>
                                {item.studentAnswer}
                              </span>
                              <span className="ml-2">{item.correct ? '✅' : '❌'}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pronunciation Details */}
                  {exerciseType === 'pronunciation' && 'recordings' in exercise && (
                    <div className="space-y-3">
                      {exercise.recordings.map((recording: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{recording.word}</h4>
                            <Badge className={getScoreBadge((recording.teacherScore / recording.maxScore) * 100)}>
                              {recording.teacherScore}/{recording.maxScore}
                            </Badge>
                          </div>
                          <div className="text-sm">
                            <strong>Teacher Feedback:</strong> {recording.feedback}
                          </div>
                          <div className="mt-2">
                            <Button variant="outline" size="sm">
                              🎵 Play Recording
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Writing Details */}
                  {exerciseType === 'writing' && 'content' in exercise && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-medium mb-2">Student's Writing:</h4>
                        <p className="text-gray-800 leading-relaxed">{exercise.content}</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Word Count:</strong> {exercise.wordCount}
                        </div>
                        <div>
                          <strong>Vocabulary Used:</strong> {exercise.vocabularyUsed.length}
                        </div>
                        <div>
                          <strong>Status:</strong> 
                          <span className={exercise.teacherScore > 0 ? 'text-green-600' : 'text-yellow-600'}>
                            {exercise.teacherScore > 0 ? ' Graded' : ' Pending Review'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <strong className="text-sm">Vocabulary words used:</strong>
                        {exercise.vocabularyUsed.map((word: string) => (
                          <Badge key={word} variant="outline" className="text-xs">
                            {word}
                          </Badge>
                        ))}
                      </div>
                      {exercise.teacherFeedback && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <strong className="text-blue-800">Teacher Feedback:</strong>
                          <p className="text-blue-700 mt-1">{exercise.teacherFeedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Grading & Feedback Tab */}
          <TabsContent value="grading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>✏️ Grade Writing Exercise</CardTitle>
                <p className="text-sm text-gray-600">
                  Provide detailed feedback and score for the student's writing
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Student's Writing */}
                  <div>
                    <h4 className="font-semibold mb-3">Student's Writing:</h4>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <p className="text-gray-800 leading-relaxed">
                        {studentData.exercises.writing.content}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Word count: {studentData.exercises.writing.wordCount} • 
                      Vocabulary used: {studentData.exercises.writing.vocabularyUsed.join(', ')}
                    </div>
                  </div>

                  {/* Grading Form */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Score (0-100):</h4>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                        placeholder="Enter score"
                        disabled={gradingSubmitted}
                      />
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3">Grade Level:</h4>
                      <Badge className={getScoreBadge(score)}>
                        {score >= 90 ? 'Excellent (A)' :
                         score >= 80 ? 'Good (B)' :
                         score >= 70 ? 'Satisfactory (C)' :
                         score >= 60 ? 'Needs Improvement (D)' : 'Unsatisfactory (F)'}
                      </Badge>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <h4 className="font-semibold mb-3">Detailed Feedback:</h4>
                    <textarea
                      className="w-full h-32 p-3 border rounded-lg resize-none"
                      placeholder="Provide detailed feedback about grammar, vocabulary usage, sentence structure, creativity, etc."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      disabled={gradingSubmitted}
                    />
                  </div>

                  {/* Grading Criteria Checklist */}
                  <div>
                    <h4 className="font-semibold mb-3">Grading Criteria:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm">Used required vocabulary (5+ words)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm">Correct sentence structure</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm">Clear and coherent ideas</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm">Appropriate length (5-7 sentences)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">Creative and engaging content</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm">Proper grammar and spelling</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  {!gradingSubmitted ? (
                    <Button
                      onClick={submitGrading}
                      disabled={!feedback.trim() || score === 0}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      📝 Submit Grade & Feedback
                    </Button>
                  ) : (
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-green-800 font-semibold">✅ Grading Completed!</div>
                      <p className="text-sm text-green-600 mt-1">
                        Feedback has been saved and will be included in the PDF report.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}