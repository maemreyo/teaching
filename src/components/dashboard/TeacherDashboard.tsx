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
  Users, 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Award,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PlusCircle,
  ChevronRight,
  GraduationCap,
  Target,
  FileText
} from 'lucide-react'
import Link from 'next/link'

interface TeacherStats {
  totalStudents: number
  activeStudents: number
  totalClasses: number
  completedAssignments: number
  pendingAssignments: number
  averageProgress: number
  weeklyEngagement: number
}

interface ClassOverview {
  id: string
  name: string
  gradeLevel: number
  totalStudents: number
  activeStudents: number
  averageProgress: number
  lastActive: string
}

interface RecentActivity {
  id: string
  type: 'assignment' | 'progress' | 'completion' | 'message'
  studentName: string
  className: string
  description: string
  timestamp: string
  urgent?: boolean
}

interface PendingTask {
  id: string
  type: 'review' | 'grade' | 'respond'
  title: string
  description: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
}

export function TeacherDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 156,
    activeStudents: 142,
    totalClasses: 6,
    completedAssignments: 89,
    pendingAssignments: 23,
    averageProgress: 67,
    weeklyEngagement: 85
  })

  const [classes] = useState<ClassOverview[]>([
    {
      id: '1',
      name: 'Grade 6A - Morning',
      gradeLevel: 6,
      totalStudents: 28,
      activeStudents: 26,
      averageProgress: 72,
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Grade 6B - Afternoon',
      gradeLevel: 6,
      totalStudents: 25,
      activeStudents: 23,
      averageProgress: 68,
      lastActive: '4 hours ago'
    },
    {
      id: '3',
      name: 'Grade 7A - Advanced',
      gradeLevel: 7,
      totalStudents: 22,
      activeStudents: 22,
      averageProgress: 84,
      lastActive: '1 hour ago'
    }
  ])

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'completion',
      studentName: 'Minh Nguyen',
      className: 'Grade 6A',
      description: 'Completed Unit 2: Family & Friends',
      timestamp: '30 minutes ago'
    },
    {
      id: '2',
      type: 'assignment',
      studentName: 'Lan Tran',
      className: 'Grade 6B',
      description: 'Submitted vocabulary practice assignment',
      timestamp: '1 hour ago'
    },
    {
      id: '3',
      type: 'progress',
      studentName: 'Duc Le',
      className: 'Grade 7A',
      description: 'Achieved 90% accuracy in grammar exercises',
      timestamp: '2 hours ago'
    },
    {
      id: '4',
      type: 'message',
      studentName: 'Hoa Pham',
      className: 'Grade 6A',
      description: 'Sent a question about pronunciation lesson',
      timestamp: '3 hours ago',
      urgent: true
    }
  ])

  const [pendingTasks] = useState<PendingTask[]>([
    {
      id: '1',
      type: 'grade',
      title: 'Grade Unit 1 Assessments',
      description: '15 assessments waiting for review',
      dueDate: 'Due today',
      priority: 'high'
    },
    {
      id: '2',
      type: 'respond',
      title: 'Student Messages',
      description: '3 messages require response',
      dueDate: 'Due today',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'review',
      title: 'Weekly Progress Reports',
      description: 'Review and approve weekly reports',
      dueDate: 'Due tomorrow',
      priority: 'low'
    }
  ])

  const userDisplayName = authHelpers.getUserDisplayName(user)
  const engagementPercentage = stats.weeklyEngagement

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment': return FileText
      case 'progress': return TrendingUp
      case 'completion': return CheckCircle
      case 'message': return AlertCircle
      default: return CheckCircle
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
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
            Here's what's happening with your students today
          </p>
        </div>
        <Button asChild>
          <Link href="/assignments/create">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Assignment
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeStudents} active this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Across grades 6-7
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingAssignments}</div>
            <p className="text-xs text-muted-foreground">
              Pending review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementPercentage}%</div>
            <Progress value={engagementPercentage} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Weekly engagement rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Class Overview
              </CardTitle>
              <CardDescription>
                Monitor progress across all your classes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {classes.map((classItem) => (
                <div
                  key={classItem.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{classItem.name}</p>
                      <Badge variant="secondary" className="text-xs">
                        Grade {classItem.gradeLevel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{classItem.activeStudents}/{classItem.totalStudents} active</span>
                      <span>{classItem.averageProgress}% avg progress</span>
                      <span>Last active {classItem.lastActive}</span>
                    </div>
                    <Progress value={classItem.averageProgress} className="w-48" />
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/classes/${classItem.id}`}>
                      View Details
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
                <BarChart3 className="h-5 w-5" />
                Recent Student Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.urgent ? 'bg-red-100' : 'bg-primary/10'
                      }`}>
                        <Icon className={`h-4 w-4 ${
                          activity.urgent ? 'text-red-600' : 'text-primary'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{activity.studentName}</p>
                          <Badge variant="outline" className="text-xs">
                            {activity.className}
                          </Badge>
                          {activity.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
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
          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-sm">{task.title}</p>
                    <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{task.description}</p>
                  <p className="text-xs font-medium text-orange-600">{task.dueDate}</p>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                <Link href="/tasks">
                  View All Tasks
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/assignments/create">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Assignment
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/curriculum/manage">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Manage Curriculum
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/messages">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Student Messages
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Performance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                This Week's Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Assignments graded</span>
                  <span className="font-semibold">{stats.completedAssignments}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Student messages</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average score</span>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Engagement rate</span>
                  <span className="font-semibold">{stats.weeklyEngagement}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}