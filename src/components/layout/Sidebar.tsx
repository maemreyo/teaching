'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { authHelpers } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Home,
  BookOpen,
  Trophy,
  Users,
  Settings,
  User,
  BarChart3,
  Calendar,
  MessageSquare,
  Award,
  ChevronDown,
  ChevronRight,
  Crown,
  GraduationCap,
  Library,
  Gamepad2,
  Target,
  TrendingUp
} from 'lucide-react'

interface SidebarProps {
  className?: string
  collapsed?: boolean
}

export function Sidebar({ className, collapsed = false }: SidebarProps) {
  const { user } = useAuth()
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(['main'])

  const isTeacher = authHelpers.isTeacher(user)
  const isStudent = authHelpers.isStudent(user)
  const userGradeLevel = authHelpers.getUserGradeLevel(user)

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  const navigationSections = [
    {
      id: 'main',
      title: 'Main',
      items: [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/curriculum', label: 'Curriculum', icon: BookOpen },
        { href: '/games', label: 'Games', icon: Gamepad2 },
      ]
    },
    {
      id: 'learning',
      title: 'Learning',
      items: [
        { href: '/vocabulary', label: 'Vocabulary', icon: Library },
        { href: '/grammar', label: 'Grammar', icon: Target },
        { href: '/progress', label: 'Progress', icon: TrendingUp },
        { href: '/achievements', label: 'Achievements', icon: Award },
      ]
    },
    ...(isTeacher ? [
      {
        id: 'teaching',
        title: 'Teaching Tools',
        items: [
          { href: '/students', label: 'Students', icon: Users },
          { href: '/classes', label: 'Classes', icon: Users },
          { href: '/analytics', label: 'Analytics', icon: BarChart3 },
          { href: '/assignments', label: 'Assignments', icon: Calendar },
        ]
      }
    ] : []),
    {
      id: 'account',
      title: 'Account',
      items: [
        { href: '/profile', label: 'Profile', icon: User },
        { href: '/settings', label: 'Settings', icon: Settings },
        ...(isTeacher ? [{ href: '/feedback', label: 'Feedback', icon: MessageSquare }] : []),
      ]
    }
  ]

  if (!user) {
    return null
  }

  return (
    <div className={cn(
      "flex flex-col h-full bg-background border-r",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      {/* User Info */}
      <div className={cn(
        "p-4 border-b",
        collapsed ? "p-2" : "p-4"
      )}>
        {collapsed ? (
          <div className="flex justify-center">
            <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">
                {authHelpers.getUserDisplayName(user).split(' ').map(n => n[0]).join('').toUpperCase()}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">
                  {authHelpers.getUserDisplayName(user).split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {authHelpers.getUserDisplayName(user)}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              {isTeacher && (
                <Badge variant="secondary" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Teacher
                </Badge>
              )}
              {isStudent && userGradeLevel && (
                <Badge variant="outline" className="text-xs">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Grade {userGradeLevel}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="space-y-2">
          {navigationSections.map((section) => (
            <div key={section.id}>
              {!collapsed && section.title && (
                <Collapsible
                  open={expandedSections.includes(section.id)}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between p-2 h-8 text-xs font-medium text-muted-foreground"
                    >
                      {section.title}
                      {expandedSections.includes(section.id) ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href

                      return (
                        <Button
                          key={item.href}
                          asChild
                          variant={isActive ? "secondary" : "ghost"}
                          size="sm"
                          className={cn(
                            "w-full justify-start gap-2 h-9",
                            isActive && "bg-secondary text-secondary-foreground"
                          )}
                        >
                          <Link href={item.href}>
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        </Button>
                      )
                    })}
                  </CollapsibleContent>
                </Collapsible>
              )}

              {collapsed && (
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href

                    return (
                      <Button
                        key={item.href}
                        asChild
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        className={cn(
                          "w-full justify-center p-2 h-10",
                          isActive && "bg-secondary text-secondary-foreground"
                        )}
                      >
                        <Link href={item.href} title={item.label}>
                          <Icon className="h-4 w-4" />
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              )}

              {!collapsed && section.id !== 'account' && <Separator className="my-2" />}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground text-center">
            <p>&copy; 2024 EduGameHub</p>
            <p>English Learning Platform</p>
          </div>
        </div>
      )}
    </div>
  )
}