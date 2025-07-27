'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useSocket } from '@/contexts/SocketContext'
import { Plus, Users, Trophy, Target, Clock } from 'lucide-react'

const createRoomSchema = z.object({
  gameType: z.string().min(1, 'Please select a game type'),
  unitId: z.string().min(1, 'Please select a unit'),
  maxPlayers: z.number().min(2).max(8)
})

type CreateRoomFormData = z.infer<typeof createRoomSchema>

interface CreateRoomDialogProps {
  trigger?: React.ReactNode
  units?: Array<{ id: string; title: string; unitNumber: number }>
}

export function CreateRoomDialog({ trigger, units = [] }: CreateRoomDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { createRoom, isConnected, error } = useSocket()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      maxPlayers: 4
    }
  })

  const gameTypes = [
    {
      id: 'vocabulary_quiz',
      name: 'Vocabulary Quiz',
      description: 'Fast-paced vocabulary competition',
      icon: Target,
      estimatedTime: '10-15 min',
      difficulty: 'Easy'
    },
    {
      id: 'grammar_race',
      name: 'Grammar Race',
      description: 'Speed through grammar challenges',
      icon: Trophy,
      estimatedTime: '15-20 min',
      difficulty: 'Medium'
    },
    {
      id: 'word_hunt',
      name: 'Word Hunt',
      description: 'Find and collect vocabulary words',
      icon: Users,
      estimatedTime: '20-25 min',
      difficulty: 'Hard'
    }
  ]

  const onSubmit = async (data: CreateRoomFormData) => {
    if (!isConnected) {
      return
    }

    setIsLoading(true)
    try {
      createRoom(data.gameType, data.unitId, data.maxPlayers)
      reset()
      setOpen(false)
    } catch (err) {
      console.error('Failed to create room:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const selectedGameType = watch('gameType')
  const selectedGame = gameTypes.find(game => game.id === selectedGameType)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Room
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Multiplayer Room</DialogTitle>
          <DialogDescription>
            Set up a new multiplayer game session for you and your friends
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isConnected && (
            <Alert variant="destructive">
              <AlertDescription>
                Not connected to server. Please check your internet connection.
              </AlertDescription>
            </Alert>
          )}

          {/* Game Type Selection */}
          <div className="space-y-3">
            <Label>Game Type</Label>
            <div className="grid grid-cols-1 gap-3">
              {gameTypes.map((game) => {
                const Icon = game.icon
                const isSelected = selectedGameType === game.id
                
                return (
                  <Card 
                    key={game.id} 
                    className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setValue('gameType', game.id)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{game.name}</h3>
                        <p className="text-sm text-muted-foreground">{game.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {game.estimatedTime}
                          </span>
                          <span>Difficulty: {game.difficulty}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            {errors.gameType && (
              <p className="text-sm text-red-600">{errors.gameType.message}</p>
            )}
          </div>

          {/* Unit Selection */}
          <div className="space-y-2">
            <Label htmlFor="unitId">Unit</Label>
            <Select onValueChange={(value) => setValue('unitId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a unit to play" />
              </SelectTrigger>
              <SelectContent>
                {units.map((unit) => (
                  <SelectItem key={unit.id} value={unit.id}>
                    Unit {unit.unitNumber}: {unit.title}
                  </SelectItem>
                ))}
                {units.length === 0 && (
                  <SelectItem value="demo-unit" disabled>
                    Demo Unit: School & Education (Demo)
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.unitId && (
              <p className="text-sm text-red-600">{errors.unitId.message}</p>
            )}
          </div>

          {/* Max Players */}
          <div className="space-y-2">
            <Label htmlFor="maxPlayers">Maximum Players</Label>
            <Select onValueChange={(value) => setValue('maxPlayers', parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select max players" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Players</SelectItem>
                <SelectItem value="3">3 Players</SelectItem>
                <SelectItem value="4">4 Players</SelectItem>
                <SelectItem value="6">6 Players</SelectItem>
                <SelectItem value="8">8 Players</SelectItem>
              </SelectContent>
            </Select>
            {errors.maxPlayers && (
              <p className="text-sm text-red-600">{errors.maxPlayers.message}</p>
            )}
          </div>

          {/* Game Preview */}
          {selectedGame && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Game Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                    <selectedGame.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{selectedGame.name}</h3>
                    <p className="text-muted-foreground">{selectedGame.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {selectedGame.estimatedTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Target className="h-4 w-4" />
                        {selectedGame.difficulty}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        Up to {watch('maxPlayers')} players
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !isConnected}
              className="min-w-[120px]"
            >
              {isLoading ? 'Creating...' : 'Create Room'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}