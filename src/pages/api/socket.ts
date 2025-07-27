import { NextApiRequest, NextApiResponse } from 'next'
import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { initializeSocketIO } from '@/lib/socket-server'

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: {
    server: HTTPServer & {
      io?: SocketIOServer
    }
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  if (res.socket.server.io) {
    console.log('Socket.IO server already running')
    res.end()
    return
  }

  console.log('Initializing Socket.IO server...')
  
  const io = initializeSocketIO(res.socket.server)
  res.socket.server.io = io

  console.log('Socket.IO server initialized')
  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}