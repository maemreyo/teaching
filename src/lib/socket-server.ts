import { Server as HTTPServer } from 'http'
import { NextApiRequest, NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'
import { supabase } from './supabase'
import { Tables } from '@/types/database.types'

export type SocketIOHandler = SocketIOServer

// Room management types
export interface GameRoom {
  id: string
  code: string
  hostId: string
  gameType: string
  unitId: string
  maxPlayers: number
  currentPlayers: string[]
  status: 'waiting' | 'playing' | 'finished'
  settings: Record<string, any>
  createdAt: Date
}

export interface PlayerInRoom {
  id: string
  userId: string
  username: string
  avatar?: string
  ready: boolean
  score: number
  isHost: boolean
}

// Game event types
export interface GameEvents {
  // Room events
  'room:join': (data: { roomCode: string; userId: string }) => void
  'room:leave': (data: { roomCode: string; userId: string }) => void
  'room:created': (room: GameRoom) => void
  'room:updated': (room: GameRoom) => void
  'room:player-joined': (player: PlayerInRoom) => void
  'room:player-left': (player: PlayerInRoom) => void
  'room:player-ready': (data: { userId: string; ready: boolean }) => void
  'room:game-start': (data: { roomCode: string }) => void
  'room:game-end': (data: { roomCode: string; results: any }) => void

  // Game events
  'game:action': (data: { action: string; payload: any }) => void
  'game:sync': (data: { gameState: any }) => void
  'game:score-update': (data: { userId: string; score: number }) => void
  'game:answer-submitted': (data: { userId: string; answer: any; correct: boolean }) => void

  // Chat events
  'chat:message': (data: { userId: string; message: string; timestamp: string }) => void
  'chat:typing': (data: { userId: string; isTyping: boolean }) => void

  // Progress events
  'progress:update': (data: { userId: string; progress: any }) => void
  'progress:achievement': (data: { userId: string; achievementId: string }) => void
}

// In-memory storage for active rooms (in production, use Redis)
const activeRooms = new Map<string, GameRoom>()
const roomPlayers = new Map<string, Map<string, PlayerInRoom>>()

export function initializeSocketIO(server: HTTPServer): SocketIOServer {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:3000'],
      methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
  })

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication token required'))
      }

      // Verify the token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (error || !user) {
        return next(new Error('Invalid authentication token'))
      }

      // Attach user info to socket
      socket.data.user = user
      socket.data.userId = user.id

      next()
    } catch (error) {
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`User ${socket.data.userId} connected`)

    // Room management handlers
    socket.on('room:create', async (data: { gameType: string; unitId: string; maxPlayers?: number }) => {
      try {
        const { gameType, unitId, maxPlayers = 4 } = data
        const userId = socket.data.userId

        // Generate unique room code
        const roomCode = generateRoomCode()

        // Create room in database
        const { data: roomData, error } = await supabase
          .from('multiplayer_rooms')
          .insert({
            room_code: roomCode,
            host_id: userId,
            game_type: gameType,
            unit_id: unitId,
            max_players: maxPlayers,
            current_players: 1,
            status: 'waiting',
            settings: {}
          })
          .select()
          .single()

        if (error) throw error

        // Create room object
        const room: GameRoom = {
          id: roomData.id,
          code: roomCode,
          hostId: userId,
          gameType,
          unitId,
          maxPlayers,
          currentPlayers: [userId],
          status: 'waiting',
          settings: {},
          createdAt: new Date(roomData.created_at)
        }

        // Store room in memory
        activeRooms.set(roomCode, room)
        roomPlayers.set(roomCode, new Map())

        // Join socket room
        socket.join(roomCode)

        // Add host as player
        const hostPlayer: PlayerInRoom = {
          id: socket.id,
          userId,
          username: socket.data.user.email || 'Host',
          ready: false,
          score: 0,
          isHost: true
        }

        roomPlayers.get(roomCode)?.set(userId, hostPlayer)

        socket.emit('room:created', room)
        socket.emit('room:joined', { room, player: hostPlayer })

      } catch (error) {
        socket.emit('error', { message: 'Failed to create room' })
      }
    })

    socket.on('room:join', async (data: { roomCode: string }) => {
      try {
        const { roomCode } = data
        const userId = socket.data.userId

        const room = activeRooms.get(roomCode)
        if (!room) {
          return socket.emit('error', { message: 'Room not found' })
        }

        if (room.currentPlayers.length >= room.maxPlayers) {
          return socket.emit('error', { message: 'Room is full' })
        }

        if (room.status !== 'waiting') {
          return socket.emit('error', { message: 'Game already in progress' })
        }

        // Add player to room
        room.currentPlayers.push(userId)

        // Update database
        await supabase
          .from('multiplayer_rooms')
          .update({ current_players: room.currentPlayers.length })
          .eq('room_code', roomCode)

        await supabase
          .from('room_participants')
          .insert({
            room_id: room.id,
            player_id: userId,
            ready: false
          })

        // Join socket room
        socket.join(roomCode)

        // Add player
        const player: PlayerInRoom = {
          id: socket.id,
          userId,
          username: socket.data.user.email || 'Player',
          ready: false,
          score: 0,
          isHost: false
        }

        roomPlayers.get(roomCode)?.set(userId, player)

        // Notify all players
        io.to(roomCode).emit('room:player-joined', player)
        socket.emit('room:joined', { room, player })

      } catch (error) {
        socket.emit('error', { message: 'Failed to join room' })
      }
    })

    socket.on('room:leave', async (data: { roomCode: string }) => {
      try {
        const { roomCode } = data
        const userId = socket.data.userId

        const room = activeRooms.get(roomCode)
        if (!room) return

        // Remove player from room
        room.currentPlayers = room.currentPlayers.filter(id => id !== userId)
        roomPlayers.get(roomCode)?.delete(userId)

        // Leave socket room
        socket.leave(roomCode)

        // Update database
        await supabase
          .from('room_participants')
          .delete()
          .eq('room_id', room.id)
          .eq('player_id', userId)

        if (room.currentPlayers.length === 0) {
          // Delete empty room
          activeRooms.delete(roomCode)
          roomPlayers.delete(roomCode)
          await supabase
            .from('multiplayer_rooms')
            .delete()
            .eq('room_code', roomCode)
        } else {
          // Update room
          await supabase
            .from('multiplayer_rooms')
            .update({ current_players: room.currentPlayers.length })
            .eq('room_code', roomCode)

          // If host left, assign new host
          if (room.hostId === userId && room.currentPlayers.length > 0) {
            room.hostId = room.currentPlayers[0]
            const newHost = roomPlayers.get(roomCode)?.get(room.hostId)
            if (newHost) {
              newHost.isHost = true
            }
          }

          io.to(roomCode).emit('room:player-left', { userId })
          io.to(roomCode).emit('room:updated', room)
        }

      } catch (error) {
        console.error('Error leaving room:', error)
      }
    })

    socket.on('room:ready', async (data: { roomCode: string; ready: boolean }) => {
      try {
        const { roomCode, ready } = data
        const userId = socket.data.userId

        const player = roomPlayers.get(roomCode)?.get(userId)
        if (!player) return

        player.ready = ready

        // Update database
        await supabase
          .from('room_participants')
          .update({ ready })
          .eq('player_id', userId)

        io.to(roomCode).emit('room:player-ready', { userId, ready })

        // Check if all players are ready
        const players = Array.from(roomPlayers.get(roomCode)?.values() || [])
        const allReady = players.length > 1 && players.every(p => p.ready)

        if (allReady) {
          const room = activeRooms.get(roomCode)
          if (room) {
            room.status = 'playing'
            await supabase
              .from('multiplayer_rooms')
              .update({ status: 'playing' })
              .eq('room_code', roomCode)

            io.to(roomCode).emit('room:game-start', { roomCode })
          }
        }

      } catch (error) {
        socket.emit('error', { message: 'Failed to update ready status' })
      }
    })

    // Game event handlers
    socket.on('game:action', (data: { roomCode: string; action: string; payload: any }) => {
      const { roomCode, action, payload } = data
      const userId = socket.data.userId

      // Broadcast to all players in room except sender
      socket.to(roomCode).emit('game:action', { userId, action, payload })
    })

    socket.on('game:score-update', async (data: { roomCode: string; score: number }) => {
      try {
        const { roomCode, score } = data
        const userId = socket.data.userId

        const player = roomPlayers.get(roomCode)?.get(userId)
        if (player) {
          player.score = score

          // Update database
          await supabase
            .from('room_participants')
            .update({ score })
            .eq('player_id', userId)

          io.to(roomCode).emit('game:score-update', { userId, score })
        }
      } catch (error) {
        console.error('Error updating score:', error)
      }
    })

    socket.on('game:answer-submitted', (data: { roomCode: string; answer: any; correct: boolean; points: number }) => {
      const { roomCode, answer, correct, points } = data
      const userId = socket.data.userId

      // Update player score
      const player = roomPlayers.get(roomCode)?.get(userId)
      if (player && correct) {
        player.score += points
      }

      io.to(roomCode).emit('game:answer-submitted', { userId, answer, correct, points })
    })

    // Chat handlers
    socket.on('chat:message', (data: { roomCode: string; message: string }) => {
      const { roomCode, message } = data
      const userId = socket.data.userId
      const timestamp = new Date().toISOString()

      io.to(roomCode).emit('chat:message', { userId, message, timestamp })
    })

    socket.on('chat:typing', (data: { roomCode: string; isTyping: boolean }) => {
      const { roomCode, isTyping } = data
      const userId = socket.data.userId

      socket.to(roomCode).emit('chat:typing', { userId, isTyping })
    })

    // Disconnect handler
    socket.on('disconnect', async () => {
      console.log(`User ${socket.data.userId} disconnected`)

      // Remove from all rooms
      for (const [roomCode, room] of activeRooms.entries()) {
        if (room.currentPlayers.includes(socket.data.userId)) {
          socket.emit('room:leave', { roomCode })
        }
      }
    })
  })

  return io
}

function generateRoomCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

export { activeRooms, roomPlayers }