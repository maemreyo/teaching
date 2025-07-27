'use client'

import { useState, useEffect } from 'react'
import { useSocket } from '@/contexts/SocketContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  Crown, 
  CheckCircle, 
  Clock, 
  Copy, 
  MessageSquare, 
  Settings,
  ExternalLink,
  UserPlus
} from 'lucide-react'
import { toast } from 'sonner'

interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  timestamp: string
}

export function RoomLobby() {
  const { 
    currentRoom, 
    currentPlayer, 
    players, 
    setReady, 
    leaveRoom,
    sendMessage,
    setTyping
  } = useSocket()
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])

  useEffect(() => {
    // Set up message listeners
    const socket = useSocket().socket
    if (!socket) return

    socket.on('chat:message', ({ userId, message, timestamp }) => {
      setChatMessages(prev => [...prev, {
        id: `${userId}-${timestamp}`,
        userId,
        username: getPlayerName(userId),
        message,
        timestamp
      }])
    })

    socket.on('chat:typing', ({ userId, isTyping: typing }) => {
      setTypingUsers(prev => 
        typing 
          ? [...prev.filter(id => id !== userId), userId]
          : prev.filter(id => id !== userId)
      )
    })

    return () => {
      socket.off('chat:message')
      socket.off('chat:typing')
    }
  }, [])

  const getPlayerName = (userId: string) => {
    const player = players.find(p => p.userId === userId)
    return player?.username || 'Unknown Player'
  }

  const handleReadyToggle = () => {
    if (!currentPlayer) return
    setReady(!currentPlayer.ready)
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    
    sendMessage(messageInput)
    setMessageInput('')
    
    if (isTyping) {
      setTyping(false)
      setIsTyping(false)
    }
  }

  const handleTyping = (value: string) => {
    setMessageInput(value)
    
    const shouldBeTyping = value.length > 0
    if (shouldBeTyping !== isTyping) {
      setTyping(shouldBeTyping)
      setIsTyping(shouldBeTyping)
    }
  }

  const copyRoomCode = () => {
    if (!currentRoom) return
    
    navigator.clipboard.writeText(currentRoom.code)
    toast.success('Room code copied to clipboard!')
  }

  const shareRoomLink = () => {
    if (!currentRoom) return
    
    const url = `${window.location.origin}/multiplayer/join/${currentRoom.code}`
    navigator.clipboard.writeText(url)
    toast.success('Room link copied to clipboard!')
  }

  if (!currentRoom || !currentPlayer) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No active room</p>
        </CardContent>
      </Card>
    )
  }

  const allPlayersReady = players.length > 1 && players.every(p => p.ready)
  const isHost = currentPlayer.isHost

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Lobby Area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Room Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Room: {currentRoom.code}
                  <Badge variant="secondary">{currentRoom.status}</Badge>
                </CardTitle>
                <CardDescription>
                  {currentRoom.gameType.replace('_', ' ')} • Max {currentRoom.maxPlayers} players
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyRoomCode}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Code
                </Button>
                <Button variant="outline" size="sm" onClick={shareRoomLink}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Players List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Players ({players.length}/{currentRoom.maxPlayers})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {players.map((player) => (
                <div
                  key={player.userId}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  <Avatar>
                    <AvatarImage src={player.avatar} />
                    <AvatarFallback>
                      {player.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{player.username}</span>
                      {player.isHost && (
                        <Crown className="h-4 w-4 text-yellow-500" />
                      )}
                      {player.ready && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>Score: {player.score}</span>
                      {player.ready ? (
                        <Badge variant="default" className="text-xs">Ready</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Not Ready</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty slots */}
              {Array.from({ length: currentRoom.maxPlayers - players.length }).map((_, index) => (
                <div
                  key={`empty-${index}`}
                  className="flex items-center gap-3 p-3 border border-dashed rounded-lg opacity-50"
                >
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <span className="text-muted-foreground">Waiting for player...</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Game Status */}
        <Card>
          <CardContent className="pt-6">
            {currentRoom.status === 'waiting' ? (
              <div className="text-center space-y-4">
                {allPlayersReady ? (
                  <div>
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">All Players Ready!</h3>
                    <p className="text-muted-foreground">Game will start shortly...</p>
                  </div>
                ) : (
                  <div>
                    <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold">Waiting for Players</h3>
                    <p className="text-muted-foreground">
                      {players.filter(p => !p.ready).length} player(s) need to get ready
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleReadyToggle}
                    variant={currentPlayer.ready ? "secondary" : "default"}
                    size="lg"
                  >
                    {currentPlayer.ready ? 'Not Ready' : 'Ready to Play'}
                  </Button>
                  {isHost && (
                    <Button variant="outline" size="lg">
                      <Settings className="h-4 w-4 mr-2" />
                      Room Settings
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h3 className="text-lg font-semibold">Game In Progress</h3>
                <p className="text-muted-foreground">The game is currently running...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chat Sidebar */}
      <div className="space-y-6">
        <Card className="h-[500px] flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Chat
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{msg.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))}
                
                {typingUsers.length > 0 && (
                  <div className="text-xs text-muted-foreground italic">
                    {typingUsers.map(getPlayerName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!messageInput.trim()}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Room Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={copyRoomCode}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Room Code
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={shareRoomLink}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Share Room Link
            </Button>
            <Button 
              variant="destructive" 
              className="w-full justify-start"
              onClick={leaveRoom}
            >
              Leave Room
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}