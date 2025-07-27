'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authHelpers } from '@/lib/auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  BookOpen, 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  Clock, 
  Star,
  PlayCircle,
  ChevronRight,
  Award,
  Flame,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

interface StudentStats {
  totalUnitsCompleted: number
  totalUnits: number
  vocabularyLearned: number
  grammarRulesLearned: number
  gamesPlayed: number
  timeSpent: number
  currentStreak: number
  achievements: number
}

interface RecentActivity {
  id: string
  type: 'vocabulary' | 'grammar' | 'game' | 'achievement'
  title: string
  description: string
  timestamp: string
  score?: number
}

interface UpcomingLesson {
  id: string
  unitTitle: string
  lessonTitle: string
  estimatedTime: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export function StudentDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<StudentStats>({
    totalUnitsCompleted: 3,
    totalUnits: 12,
    vocabularyLearned: 45,
    grammarRulesLearned: 12,
    gamesPlayed: 28,
    timeSpent: 850, // minutes
    currentStreak: 7,
    achievements: 8
  })

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'vocabulary',
      title: 'Vocabulary Practice',
      description: 'Completed Unit 1: School & Education',
      timestamp: '2 hours ago',
      score: 85
    },
    {
      id: '2',
      type: 'game',
      title: 'Word Hunter',
      description: 'Found 12 vocabulary words',
      timestamp: '1 day ago',
      score: 92
    },
    {
      id: '3',
      type: 'achievement',
      title: 'Grammar Master',
      description: 'Unlocked for completing 10 grammar lessons',
      timestamp: '2 days ago'
    }
  ])

  const [upcomingLessons] = useState<UpcomingLesson[]>([
    {
      id: '1',
      unitTitle: 'Unit 2: My Family',
      lessonTitle: 'Lesson 1: Family Members',
      estimatedTime: '15 min',
      difficulty: 'easy'
    },
    {
      id: '2',
      unitTitle: 'Unit 2: My Family',
      lessonTitle: 'Lesson 2: Family Activities',
      estimatedTime: '20 min',
      difficulty: 'medium'
    }
  ])

  const userDisplayName = authHelpers.getUserDisplayName(user)
  const userGradeLevel = authHelpers.getUserGradeLevel(user)
  const completionPercentage = Math.round((stats.totalUnitsCompleted / stats.totalUnits) * 100)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vocabulary': return BookOpen
      case 'grammar': return Target
      case 'game': return PlayCircle
      case 'achievement': return Award
      default: return CheckCircle
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {userDisplayName}!</h1>
          <p className="text-muted-foreground">
            Ready to continue your English learning journey?
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            Grade {userGradeLevel}
          </Badge>
          <div className="flex items-center gap-1 text-orange-600">
            <Flame className="h-4 w-4" />
            <span className="font-semibold">{stats.currentStreak} day streak</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionPercentage}%</div>
            <Progress value={completionPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {stats.totalUnitsCompleted} of {stats.totalUnits} units completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vocabulary</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vocabularyLearned}</div>
            <p className="text-xs text-muted-foreground">
              Words learned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Games Played</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
            <p className="text-xs text-muted-foreground">
              Total games
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.timeSpent / 60)}h</div>
            <p className="text-xs text-muted-foreground">
              {stats.timeSpent % 60}m this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5" />
                Continue Learning
              </CardTitle>
              <CardDescription>
                Pick up where you left off
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{lesson.unitTitle}</p>
                    <p className="text-sm text-muted-foreground">{lesson.lessonTitle}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {lesson.estimatedTime}
                      </Badge>
                      <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/curriculum/unit-${lesson.id}`}>
                      Start
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                          {activity.score && (
                            <Badge variant="secondary" className="text-xs">
                              {activity.score}% score
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/games">
                  <Trophy className="h-4 w-4 mr-2" />
                  Play Games
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/vocabulary">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Study Vocabulary
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/progress">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Progress
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Latest Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Trophy className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">First Unit Complete</p>
                    <p className="text-xs text-muted-foreground">Completed Unit 1</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Target className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vocabulary Builder</p>
                    <p className="text-xs text-muted-foreground">Learned 50 words</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link href="/achievements">
                  View All Achievements
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Study Streak */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-orange-500" />
                Study Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {stats.currentStreak}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  days in a row!
                </p>
                <p className="text-xs text-muted-foreground">
                  Keep studying daily to maintain your streak and unlock special rewards!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}