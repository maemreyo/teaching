'use client'

import { io, Socket } from 'socket.io-client'
import { GameEvents, GameRoom, PlayerInRoom } from './socket-server'

class SocketManager {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5

  async connect(token: string): Promise<Socket> {
    if (this.socket?.connected) {
      return this.socket
    }

    const serverUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin
      : 'http://localhost:3000'

    this.socket = io(serverUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: this.maxReconnectAttempts
    })

    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Failed to create socket'))
        return
      }

      this.socket.on('connect', () => {
        console.log('Connected to server')
        this.reconnectAttempts = 0
        resolve(this.socket!)
      })

      this.socket.on('connect_error', (error) => {
        console.error('Connection error:', error)
        this.reconnectAttempts++
        
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
          reject(new Error(`Failed to connect after ${this.maxReconnectAttempts} attempts`))
        }
      })

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected:', reason)
      })

      this.socket.on('error', (error) => {
        console.error('Socket error:', error)
      })
    })
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false
  }

  getSocket(): Socket | null {
    return this.socket
  }

  // Room management methods
  createRoom(gameType: string, unitId: string, maxPlayers?: number): void {
    this.socket?.emit('room:create', { gameType, unitId, maxPlayers })
  }

  joinRoom(roomCode: string): void {
    this.socket?.emit('room:join', { roomCode })
  }

  leaveRoom(roomCode: string): void {
    this.socket?.emit('room:leave', { roomCode })
  }

  setReady(roomCode: string, ready: boolean): void {
    this.socket?.emit('room:ready', { roomCode, ready })
  }

  // Game methods
  sendGameAction(roomCode: string, action: string, payload: any): void {
    this.socket?.emit('game:action', { roomCode, action, payload })
  }

  updateScore(roomCode: string, score: number): void {
    this.socket?.emit('game:score-update', { roomCode, score })
  }

  submitAnswer(roomCode: string, answer: any, correct: boolean, points: number): void {
    this.socket?.emit('game:answer-submitted', { roomCode, answer, correct, points })
  }

  // Chat methods
  sendMessage(roomCode: string, message: string): void {
    this.socket?.emit('chat:message', { roomCode, message })
  }

  setTyping(roomCode: string, isTyping: boolean): void {
    this.socket?.emit('chat:typing', { roomCode, isTyping })
  }

  // Event listeners
  onRoomCreated(callback: (room: GameRoom) => void): void {
    this.socket?.on('room:created', callback)
  }

  onRoomJoined(callback: (data: { room: GameRoom; player: PlayerInRoom }) => void): void {
    this.socket?.on('room:joined', callback)
  }

  onRoomUpdated(callback: (room: GameRoom) => void): void {
    this.socket?.on('room:updated', callback)
  }

  onPlayerJoined(callback: (player: PlayerInRoom) => void): void {
    this.socket?.on('room:player-joined', callback)
  }

  onPlayerLeft(callback: (data: { userId: string }) => void): void {
    this.socket?.on('room:player-left', callback)
  }

  onPlayerReady(callback: (data: { userId: string; ready: boolean }) => void): void {
    this.socket?.on('room:player-ready', callback)
  }

  onGameStart(callback: (data: { roomCode: string }) => void): void {
    this.socket?.on('room:game-start', callback)
  }

  onGameAction(callback: (data: { userId: string; action: string; payload: any }) => void): void {
    this.socket?.on('game:action', callback)
  }

  onScoreUpdate(callback: (data: { userId: string; score: number }) => void): void {
    this.socket?.on('game:score-update', callback)
  }

  onAnswerSubmitted(callback: (data: { userId: string; answer: any; correct: boolean; points: number }) => void): void {
    this.socket?.on('game:answer-submitted', callback)
  }

  onMessage(callback: (data: { userId: string; message: string; timestamp: string }) => void): void {
    this.socket?.on('chat:message', callback)
  }

  onTyping(callback: (data: { userId: string; isTyping: boolean }) => void): void {
    this.socket?.on('chat:typing', callback)
  }

  onError(callback: (error: { message: string }) => void): void {
    this.socket?.on('error', callback)
  }

  // Remove event listeners
  off(event: string, callback?: (...args: any[]) => void): void {
    this.socket?.off(event, callback)
  }

  removeAllListeners(): void {
    this.socket?.removeAllListeners()
  }
}

// Create singleton instance
export const socketManager = new SocketManager()

// React hook for using socket in components
export function useSocket() {
  return socketManager
}