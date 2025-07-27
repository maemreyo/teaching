'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function Unit2Hub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
              <span>←</span>
              <span>Back to Home</span>
            </Link>
            <div className="text-xs text-gray-500">
              EduGameHub • Vietnamese Online Tutoring System
            </div>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-2">🏠</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Unit 2: My Home</h1>
            <p className="text-lg text-gray-600">Complete English Learning System for Grade 6</p>
            <div className="flex items-center justify-center space-x-4 mt-4">
              <Badge className="bg-blue-100 text-blue-800">Global Success Curriculum</Badge>
              <Badge className="bg-green-100 text-green-800">Grade 6</Badge>
              <Badge className="bg-purple-100 text-purple-800">CEFR A1-A2</Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Teacher Tools */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-600 text-white">
              <CardTitle className="text-2xl flex items-center">
                <span className="mr-3">👩‍🏫</span>
                Teacher Tools
              </CardTitle>
              <p className="text-purple-100">Everything you need for online teaching via Google Meet</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📚</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Interactive Theory Presentation</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Screen-sharing ready slides with animations, pronunciation guides, and memory aids
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/unit2/vocabulary" target="_blank">
                        Launch Theory Presentation
                      </a>
                    </Button>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="flex items-start space-x-4">
                  <div className="text-2xl">📊</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Grading Dashboard</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Monitor student progress, provide feedback, and export PDF reports for parents
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/unit2/teacher-dashboard" target="_blank">
                        Open Grading Dashboard
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student Experience */}
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white">
              <CardTitle className="text-2xl flex items-center">
                <span className="mr-3">👨‍🎓</span>
                Student Experience
              </CardTitle>
              <p className="text-green-100">Interactive exercises and games for active learning</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl">✏️</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Interactive Exercises</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Word matching, fill-in-blanks, pronunciation practice, and creative writing
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/unit2/student-exercises" target="_blank">
                        Start Student Exercises
                      </a>
                    </Button>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="flex items-start space-x-4">
                  <div className="text-2xl">🎮</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Vocabulary Games</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      6 difficulty levels: Easy → Medium → Hard → Expert → Nightmare → Hell
                    </p>
                    <Button variant="outline" size="sm" asChild>
                      <a href="/unit2/vocabulary#games" target="_blank">
                        Play Vocabulary Games
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-3xl mb-3">📇</div>
              <h3 className="font-semibold text-gray-800 mb-2">Flashcard System</h3>
              <p className="text-sm text-gray-600">
                Interactive vocabulary cards with IPA pronunciation and memory aids
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="font-semibold text-gray-800 mb-2">Gamified Learning</h3>
              <p className="text-sm text-gray-600">
                Multiple difficulty levels to challenge and motivate students
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-3xl mb-3">🎤</div>
              <h3 className="font-semibold text-gray-800 mb-2">Pronunciation Practice</h3>
              <p className="text-sm text-gray-600">
                Audio recording and playback for speaking skill development
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="text-3xl mb-3">📄</div>
              <h3 className="font-semibent text-gray-800 mb-2">PDF Reports</h3>
              <p className="text-sm text-gray-600">
                Detailed progress reports with scores and feedback for parents
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">🚀 Quick Start Guide for Online Teaching</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-blue-800 mb-4">For Teachers (Google Meet):</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                    <span>Open <strong>Theory Presentation</strong> for screen sharing</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                    <span>Send <strong>Student Exercise</strong> link to your student</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                    <span>Monitor progress through <strong>Grading Dashboard</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                    <span>Provide feedback and export PDF report for parents</span>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-green-800 mb-4">For Students:</h3>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                    <span>Follow along with teacher's screen-shared lesson</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                    <span>Complete interactive exercises during or after lesson</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                    <span>Play vocabulary games to reinforce learning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 rounded-full w-6 h-6 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                    <span>Receive instant feedback and track progress</span>
                  </li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Start Teaching Unit 2?</h2>
          <p className="text-gray-600 mb-6">
            Everything you need for an engaging "My Home" vocabulary lesson is ready to use!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700" asChild>
              <a href="/unit2/vocabulary" target="_blank">
                🎯 Start Teaching Now
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a href="/unit2/student-exercises" target="_blank">
                👨‍🎓 Preview Student View
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}