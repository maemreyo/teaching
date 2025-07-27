# Development Guidelines

## Design Patterns
- **Clean Architecture**: Modular, clear boundaries - NO exceptions
- **User-Centric UI**: Understand user needs BEFORE design
- **Complete Implementation**: Full modules - NO snippets or placeholders
- **Security FIRST**: Error handling MANDATORY in ALL code

## Package Management Rules
- **ONLY pnpm**: NEVER use npm or yarn
- **Version Matching**: MUST check package.json versions before implementation
- **Dependencies**: Research existing dependencies before adding new ones

## Component Development
- **shadcn/ui Base**: Use shadcn/ui components as foundation
- **Single Responsibility**: Each component has ONE clear purpose
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Leverage built-in shadcn/ui accessibility features
- **Dark/Light Mode**: Implement using shadcn/ui theme system

## Game Development Specific
- **Phaser.js Integration**: Proper TypeScript definitions required
- **Performance**: Maintain ≥ 60 FPS frame rate
- **Canvas Responsive**: Handle window resize and game scaling
- **Asset Management**: Implement caching and optimization strategies

## Real-time Features
- **Socket.IO**: Implement with proper authentication
- **Reconnection Logic**: Handle offline/online state management
- **Room Management**: Design multiplayer session management
- **State Synchronization**: Broadcast game state efficiently

## Database Guidelines
- **Row Level Security**: MUST implement RLS policies
- **Query Performance**: Optimize with proper indexes
- **Real-time Subscriptions**: Use for multiplayer features
- **Data Relationships**: Design proper foreign key relationships

## Testing Strategy
- **Unit Tests**: ≥ 80% coverage required
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Performance Tests**: Validate benchmark requirements