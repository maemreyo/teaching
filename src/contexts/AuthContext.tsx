'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'
import { AuthUser, AuthState, authEvents } from '@/lib/auth'

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true
  })

  const signOut = async () => {
    const { auth } = await import('@/lib/auth')
    await auth.signOut()
  }

  const refreshUser = async () => {
    const { auth } = await import('@/lib/auth')
    const user = await auth.getCurrentUser()
    const session = await auth.getSession()
    
    setAuthState({
      user,
      session,
      loading: false
    })
  }

  useEffect(() => {
    // Set up auth state listener
    const { unsubscribe } = authEvents.onAuthStateChangeWithProfile(
      (user: AuthUser | null, session: Session | null) => {
        setAuthState({
          user,
          session,
          loading: false
        })
      }
    )

    // Initial auth state check
    refreshUser()

    return () => {
      unsubscribe()
    }
  }, [])

  const value: AuthContextType = {
    ...authState,
    signOut,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Convenience hooks
export function useUser() {
  const { user } = useAuth()
  return user
}

export function useSession() {
  const { session } = useAuth()
  return session
}

export function useAuthLoading() {
  const { loading } = useAuth()
  return loading
}