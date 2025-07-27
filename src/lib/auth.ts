import { User, Session } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { Tables } from '@/types/database.types'

export type AuthUser = User & {
  profile?: Tables<'profiles'>
}

export interface AuthState {
  user: AuthUser | null
  session: Session | null
  loading: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials extends LoginCredentials {
  fullName: string
  username?: string
  role?: 'student' | 'teacher'
  gradeLevel?: number
  school?: string
}

export interface UpdateProfileData {
  full_name?: string
  username?: string
  avatar_url?: string
  grade_level?: number
  school?: string
}

// Authentication functions
export const auth = {
  // Sign up new user
  async signUp(credentials: SignUpCredentials) {
    const { email, password, fullName, username, role, gradeLevel, school } = credentials
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username,
          role: role || 'student',
          grade_level: gradeLevel,
          school,
        }
      }
    })

    if (error) throw error
    return data
  },

  // Sign in user
  async signIn(credentials: LoginCredentials) {
    const { email, password } = credentials
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  },

  // Sign out user
  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Reset password
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    
    if (error) throw error
  },

  // Update password
  async updatePassword(newPassword: string) {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })
    
    if (error) throw error
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },

  // Get current user with profile
  async getCurrentUser(): Promise<AuthUser | null> {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    if (!user) return null

    // Fetch user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      ...user,
      profile: profile || undefined
    }
  }
}

// Profile management functions
export const profile = {
  // Update user profile
  async updateProfile(userId: string, data: UpdateProfileData) {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) throw error
  },

  // Get user profile
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  },

  // Upload avatar
  async uploadAvatar(userId: string, file: File) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}.${fileExt}`
    const filePath = `avatars/${fileName}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) throw uploadError

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath)

    // Update profile with new avatar URL
    await profile.updateProfile(userId, { avatar_url: publicUrl })

    return publicUrl
  }
}

// Auth state management helpers
export const authHelpers = {
  // Check if user is authenticated
  isAuthenticated(user: AuthUser | null): user is AuthUser {
    return user !== null
  },

  // Check if user is a teacher
  isTeacher(user: AuthUser | null): boolean {
    return user?.profile?.role === 'teacher'
  },

  // Check if user is a student
  isStudent(user: AuthUser | null): boolean {
    return user?.profile?.role === 'student'
  },

  // Get user's grade level
  getUserGradeLevel(user: AuthUser | null): number | null {
    return user?.profile?.grade_level || null
  },

  // Get user's display name
  getUserDisplayName(user: AuthUser | null): string {
    if (!user) return 'Guest'
    return user.profile?.full_name || user.profile?.username || user.email || 'User'
  },

  // Check if profile is complete
  isProfileComplete(user: AuthUser | null): boolean {
    if (!user?.profile) return false
    const { full_name, role } = user.profile
    return Boolean(full_name && role)
  }
}

// Auth event handlers
export const authEvents = {
  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },

  // Setup auth state listener with profile fetching
  onAuthStateChangeWithProfile(callback: (user: AuthUser | null, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const userWithProfile = await auth.getCurrentUser()
        callback(userWithProfile, session)
      } else {
        callback(null, session)
      }
    })
  }
}