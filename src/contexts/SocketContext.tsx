'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { socketManager } from '@/lib/socket-client'
import { GameRoom, PlayerInRoom } from '@/lib/socket-server'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  currentRoom: GameRoom | null
  currentPlayer: PlayerInRoom | null
  players: PlayerInRoom[]
  isLoading: boolean
  error: string | null
  
  // Room methods
  createRoom: (gameType: string, unitId: string, maxPlayers?: number) => void
  joinRoom: (roomCode: string) => void
  leaveRoom: () => void
  setReady: (ready: boolean) => void
  
  // Game methods
  sendGameAction: (action: string, payload: any) => void
  updateScore: (score: number) => void
  submitAnswer: (answer: any, correct: boolean, points: number) => void
  
  // Chat methods
  sendMessage: (message: string) => void
  setTyping: (isTyping: boolean) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

interface SocketProviderProps {
  children: ReactNode
}

export function SocketProvider({ children }: SocketProviderProps) {
  const { user, session } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<GameRoom | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<PlayerInRoom | null>(null)
  const [players, setPlayers] = useState<PlayerInRoom[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Connect to socket when user is authenticated
  useEffect(() => {
    if (user && session?.access_token) {
      connectSocket(session.access_token)
    } else {
      disconnectSocket()
    }

    return () => {
      disconnectSocket()
    }
  }, [user, session])

  const connectSocket = async (token: string) => {
    if (socketManager.isConnected()) return

    setIsLoading(true)
    setError(null)

    try {
      const connectedSocket = await socketManager.connect(token)
      setSocket(connectedSocket)
      setIsConnected(true)
      setupEventListeners()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectSocket = () => {
    socketManager.removeAllListeners()
    socketManager.disconnect()
    setSocket(null)
    setIsConnected(false)
    setCurrentRoom(null)
    setCurrentPlayer(null)
    setPlayers([])
  }

  const setupEventListeners = () => {
    // Room events
    socketManager.onRoomCreated((room) => {
      setCurrentRoom(room)
      setError(null)
    })

    socketManager.onRoomJoined(({ room, player }) => {
      setCurrentRoom(room)
      setCurrentPlayer(player)
      setPlayers([player])
      setError(null)
    })

    socketManager.onRoomUpdated((room) => {
      setCurrentRoom(room)
    })

    socketManager.onPlayerJoined((player) => {
      setPlayers(prev => [...prev, player])
    })

    socketManager.onPlayerLeft(({ userId }) => {
      setPlayers(prev => prev.filter(p => p.userId !== userId))
    })

    socketManager.onPlayerReady(({ userId, ready }) => {
      setPlayers(prev => prev.map(p => 
        p.userId === userId ? { ...p, ready } : p
      ))
    })

    socketManager.onScoreUpdate(({ userId, score }) => {
      setPlayers(prev => prev.map(p => 
        p.userId === userId ? { ...p, score } : p
      ))
    })

    // Error handling
    socketManager.onError(({ message }) => {
      setError(message)
    })

    // Connection events
    const socketInstance = socketManager.getSocket()
    if (socketInstance) {
      socketInstance.on('connect', () => setIsConnected(true))
      socketInstance.on('disconnect', () => {
        setIsConnected(false)
        setCurrentRoom(null)
        setCurrentPlayer(null)
        setPlayers([])
      })
    }
  }

  // Room methods
  const createRoom = (gameType: string, unitId: string, maxPlayers?: number) => {
    if (!isConnected) {
      setError('Not connected to server')
      return
    }
    setError(null)
    socketManager.createRoom(gameType, unitId, maxPlayers)
  }

  const joinRoom = (roomCode: string) => {
    if (!isConnected) {
      setError('Not connected to server')
      return
    }
    setError(null)
    socketManager.joinRoom(roomCode)
  }

  const leaveRoom = () => {
    if (!currentRoom) return
    
    socketManager.leaveRoom(currentRoom.code)
    setCurrentRoom(null)
    setCurrentPlayer(null)
    setPlayers([])
  }

  const setReady = (ready: boolean) => {
    if (!currentRoom) return
    
    socketManager.setReady(currentRoom.code, ready)
    
    if (currentPlayer) {
      setCurrentPlayer({ ...currentPlayer, ready })
    }
  }

  // Game methods
  const sendGameAction = (action: string, payload: any) => {
    if (!currentRoom) return
    socketManager.sendGameAction(currentRoom.code, action, payload)
  }

  const updateScore = (score: number) => {
    if (!currentRoom) return
    socketManager.updateScore(currentRoom.code, score)
    
    if (currentPlayer) {
      setCurrentPlayer({ ...currentPlayer, score })
    }
  }

  const submitAnswer = (answer: any, correct: boolean, points: number) => {
    if (!currentRoom) return
    socketManager.submitAnswer(currentRoom.code, answer, correct, points)
  }

  // Chat methods
  const sendMessage = (message: string) => {
    if (!currentRoom) return
    socketManager.sendMessage(currentRoom.code, message)
  }

  const setTyping = (isTyping: boolean) => {
    if (!currentRoom) return
    socketManager.setTyping(currentRoom.code, isTyping)
  }

  const value: SocketContextType = {
    socket,
    isConnected,
    currentRoom,
    currentPlayer,
    players,
    isLoading,
    error,
    createRoom,
    joinRoom,
    leaveRoom,
    setReady,
    sendGameAction,
    updateScore,
    submitAnswer,
    sendMessage,
    setTyping
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket(): SocketContextType {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

// Convenience hooks
export function useSocketConnection() {
  const { isConnected, isLoading, error } = useSocket()
  return { isConnected, isLoading, error }
}

export function useGameRoom() {
  const { currentRoom, currentPlayer, players, createRoom, joinRoom, leaveRoom, setReady } = useSocket()
  return { currentRoom, currentPlayer, players, createRoom, joinRoom, leaveRoom, setReady }
}

export function useGameActions() {
  const { sendGameAction, updateScore, submitAnswer } = useSocket()
  return { sendGameAction, updateScore, submitAnswer }
}

export function useGameChat() {
  const { sendMessage, setTyping } = useSocket()
  return { sendMessage, setTyping }
}