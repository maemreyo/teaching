# Multiplayer Architecture and Game Systems

## Real-time Communication Stack
- **Server**: Socket.IO with authentication middleware
- **Client**: Type-safe socket manager with automatic reconnection
- **Database**: Supabase integration for persistent room/player state
- **Security**: JWT token validation for all socket connections

## Game Room System
### Room Management
- **Creation**: Host creates room with game type, unit selection, max players
- **Joining**: Players join via room code or direct link
- **State sync**: Real-time updates for player status, ready state, scores
- **Persistence**: Room data stored in Supabase multiplayer_rooms table

### Player Management
- **Roles**: Host (room creator) vs regular players
- **Status tracking**: Ready/not ready, online/offline, scores
- **Profile integration**: Username, avatar, grade level display
- **Database**: room_participants table for player-room relationships

## Game Event System
### Event Types Implemented
- **Room events**: join, leave, ready, game start/end
- **Game events**: action broadcasting, score updates, answer submission
- **Chat events**: messaging, typing indicators
- **Progress events**: achievement unlocks, progress updates

### Event Broadcasting
- **Room-scoped**: Events only sent to players in same room
- **Authentication**: All events validated with user session
- **Rate limiting**: Built-in Socket.IO throttling for spam prevention
- **Error handling**: Graceful degradation and reconnection logic

## Game Types Supported
1. **Vocabulary Quiz**: Fast-paced vocabulary competition
2. **Grammar Race**: Speed grammar challenge completion
3. **Word Hunt**: Collaborative vocabulary collection game
4. **Dialogue Adventure**: Interactive conversation practice

## Integration Points
- **Curriculum**: Games target specific units and learning objectives
- **Assessment**: Real-time scoring and progress tracking
- **Voice features**: Pronunciation challenges in multiplayer context
- **Teacher tools**: Classroom management and progress monitoring

## UI Components
- **CreateRoomDialog**: Game selection, unit targeting, player limits
- **RoomLobby**: Player management, chat, ready system, game launch
- **Integration**: Works with existing auth and layout systems