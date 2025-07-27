'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { authHelpers, profile } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Upload, User, Mail, School, GraduationCap, Crown } from 'lucide-react'

interface UserProfileProps {
  editable?: boolean
  showActions?: boolean
}

export function UserProfile({ editable = false, showActions = true }: UserProfileProps) {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user?.profile?.full_name || '',
    username: user?.profile?.username || '',
    school: user?.profile?.school || '',
    grade_level: user?.profile?.grade_level || undefined
  })

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">No user data available</p>
        </CardContent>
      </Card>
    )
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    setError(null)

    try {
      await profile.uploadAvatar(user.id, file)
      await refreshUser()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload avatar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await profile.updateProfile(user.id, formData)
      await refreshUser()
      setIsEditing(false)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      full_name: user?.profile?.full_name || '',
      username: user?.profile?.username || '',
      school: user?.profile?.school || '',
      grade_level: user?.profile?.grade_level || undefined
    })
    setIsEditing(false)
    setError(null)
  }

  const userDisplayName = authHelpers.getUserDisplayName(user)
  const userRole = user.profile?.role
  const userGradeLevel = authHelpers.getUserGradeLevel(user)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage 
                src={user.profile?.avatar_url || undefined} 
                alt={userDisplayName}
              />
              <AvatarFallback className="text-lg">
                {userDisplayName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {editable && (
              <div className="absolute bottom-0 right-0">
                <Label htmlFor="avatar-upload" className="cursor-pointer">
                  <div className="bg-primary text-primary-foreground rounded-full p-1.5 hover:bg-primary/90 transition-colors">
                    <Upload className="h-3 w-3" />
                  </div>
                </Label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={isLoading}
                />
              </div>
            )}
          </div>
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {userDisplayName}
              {userRole === 'teacher' && (
                <Badge variant="secondary" className="text-xs">
                  <Crown className="h-3 w-3 mr-1" />
                  Teacher
                </Badge>
              )}
              {userRole === 'student' && userGradeLevel && (
                <Badge variant="outline" className="text-xs">
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Grade {userGradeLevel}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>Profile updated successfully!</AlertDescription>
          </Alert>
        )}

        <Separator />

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school">School</Label>
                <Input
                  id="school"
                  value={formData.school}
                  onChange={(e) => setFormData(prev => ({ ...prev, school: e.target.value }))}
                  disabled={isLoading}
                />
              </div>

              {userRole === 'student' && (
                <div className="space-y-2">
                  <Label htmlFor="grade_level">Grade Level</Label>
                  <Select 
                    value={formData.grade_level?.toString() || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, grade_level: parseInt(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                        <SelectItem key={grade} value={grade.toString()}>
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {showActions && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Full Name</p>
                  <p className="text-sm text-muted-foreground">
                    {user.profile?.full_name || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Username</p>
                  <p className="text-sm text-muted-foreground">
                    {user.profile?.username || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <School className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">School</p>
                  <p className="text-sm text-muted-foreground">
                    {user.profile?.school || 'Not provided'}
                  </p>
                </div>
              </div>

              {userRole === 'student' && (
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Grade Level</p>
                    <p className="text-sm text-muted-foreground">
                      {userGradeLevel ? `Grade ${userGradeLevel}` : 'Not provided'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {editable && showActions && (
              <div className="pt-4">
                <Button onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}