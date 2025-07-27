'use client'

import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { authHelpers } from '@/lib/auth'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: ReactNode
  requireAuth?: boolean
  requireRole?: 'student' | 'teacher'
  requireCompleteProfile?: boolean
  redirectTo?: string
  fallback?: ReactNode
}

export function AuthGuard({
  children,
  requireAuth = true,
  requireRole,
  requireCompleteProfile = false,
  redirectTo,
  fallback
}: AuthGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Check authentication requirement
    if (requireAuth && !authHelpers.isAuthenticated(user)) {
      router.push(redirectTo || '/auth/login')
      return
    }

    // Check role requirement
    if (requireRole && user) {
      const isCorrectRole = 
        requireRole === 'student' ? authHelpers.isStudent(user) :
        requireRole === 'teacher' ? authHelpers.isTeacher(user) :
        false

      if (!isCorrectRole) {
        router.push('/dashboard?error=insufficient_permissions')
        return
      }
    }

    // Check complete profile requirement
    if (requireCompleteProfile && user && !authHelpers.isProfileComplete(user)) {
      router.push('/profile/complete')
      return
    }

    // If user is authenticated but trying to access auth pages, redirect to dashboard
    if (!requireAuth && authHelpers.isAuthenticated(user)) {
      router.push(redirectTo || '/dashboard')
      return
    }
  }, [user, loading, requireAuth, requireRole, requireCompleteProfile, redirectTo, router])

  // Show loading state
  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Check if user meets requirements
  const meetsAuthRequirement = !requireAuth || authHelpers.isAuthenticated(user)
  const meetsRoleRequirement = !requireRole || (
    requireRole === 'student' ? authHelpers.isStudent(user) :
    requireRole === 'teacher' ? authHelpers.isTeacher(user) :
    false
  )
  const meetsProfileRequirement = !requireCompleteProfile || authHelpers.isProfileComplete(user)

  if (!meetsAuthRequirement || !meetsRoleRequirement || !meetsProfileRequirement) {
    return fallback || null
  }

  return <>{children}</>
}

// Convenience components for common use cases
export function ProtectedRoute({ children, ...props }: Omit<AuthGuardProps, 'requireAuth'>) {
  return (
    <AuthGuard requireAuth={true} {...props}>
      {children}
    </AuthGuard>
  )
}

export function StudentOnlyRoute({ children, ...props }: Omit<AuthGuardProps, 'requireAuth' | 'requireRole'>) {
  return (
    <AuthGuard requireAuth={true} requireRole="student" {...props}>
      {children}
    </AuthGuard>
  )
}

export function TeacherOnlyRoute({ children, ...props }: Omit<AuthGuardProps, 'requireAuth' | 'requireRole'>) {
  return (
    <AuthGuard requireAuth={true} requireRole="teacher" {...props}>
      {children}
    </AuthGuard>
  )
}

export function PublicOnlyRoute({ children, ...props }: Omit<AuthGuardProps, 'requireAuth'>) {
  return (
    <AuthGuard requireAuth={false} {...props}>
      {children}
    </AuthGuard>
  )
}