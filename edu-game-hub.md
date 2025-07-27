# Multi-Agent System Specification
## English Learning Game Platform Setup

### Project Overview
**Platform Name**: EduGameHub
**Target**: English learning games for Global Success Grade 6 curriculum
**Architecture**: Full-stack web application with real-time gaming capabilities

---

## Agent Roles & Responsibilities

### 🏗️ **Agent 1: Infrastructure Architect**
**Primary Role**: Project foundation and configuration setup

**Tasks:**
1. **Next.js Application Setup**
   - Initialize Next.js 14+ project with TypeScript
   - Configure `next.config.js` with optimal settings for games
   - Setup folder structure following Next.js best practices
   - Configure environment variables template

2. **Tailwind CSS & shadcn/ui Integration**
   - Install and configure Tailwind CSS
   - Setup shadcn/ui with proper initialization (`npx shadcn-ui@latest init`)
   - Configure custom design tokens (colors, fonts, themes)
   - Setup responsive breakpoint strategies
   - Configure Tailwind plugins for animations

3. **shadcn/ui Component System**
   - Install base shadcn/ui components (Button, Input, Card, etc.)
   - Configure theme provider and dark mode support
   - Setup component variants and custom styling
   - Create component composition patterns

4. **Development Environment**
   - Setup ESLint, Prettier configuration
   - Configure Husky for pre-commit hooks
   - Create package.json scripts for development workflow
   - Setup VS Code workspace settings

**Deliverables:**
```
/project-root/
├── next.config.js
├── tailwind.config.js
├── components.json (shadcn/ui config)
├── tsconfig.json
├── .eslintrc.json
├── .env.example
├── package.json (with shadcn/ui dependencies)
└── /src/
    ├── components/
    │   └── ui/ (shadcn/ui components)
    └── lib/
        └── utils.ts (cn function & utilities)
```

---

### 🎮 **Agent 2: Game Engine Specialist**
**Primary Role**: Phaser.js integration and game framework setup

**Tasks:**
1. **Phaser.js Integration**
   - Install Phaser.js with proper TypeScript definitions
   - Create game wrapper component for Next.js integration
   - Setup game scenes architecture (Menu, Game, GameOver)
   - Configure asset loading and management system

2. **Game Framework Architecture**
   - Create base game classes (BaseScene, GameEntity, Player)
   - Implement game state management system
   - Setup collision detection framework
   - Create animation and sprite management utilities

3. **Canvas Integration**
   - Configure HTML5 Canvas with responsive design
   - Handle window resize and game scaling
   - Setup game loop and performance optimization
   - Create debugging tools for game development

**Deliverables:**
```
/src/
├── components/
│   └── GameCanvas.tsx
├── game/
│   ├── scenes/
│   │   ├── BaseScene.ts
│   │   ├── MenuScene.ts
│   │   └── GameScene.ts
│   ├── entities/
│   │   ├── Player.ts
│   │   └── GameEntity.ts
│   ├── managers/
│   │   ├── AssetManager.ts
│   │   └── StateManager.ts
│   └── utils/
│       └── GameUtils.ts
```

---

### 🗄️ **Agent 3: Backend Infrastructure Engineer**
**Primary Role**: Supabase integration and API architecture

**Tasks:**
1. **Supabase Configuration**
   - Setup Supabase project and environment
   - Configure authentication (email/password, social login)
   - Design database schema based on provided JSON structure
   - Setup Row Level Security (RLS) policies

2. **Database Design**
   - Create tables for units, vocabulary, grammar, users, game_sessions
   - Setup relationships and foreign keys
   - Create indexes for optimal query performance
   - Design triggers for automatic data updates

3. **API Architecture**
   - Setup Supabase client configuration
   - Create API utilities for CRUD operations
   - Implement authentication middleware
   - Setup real-time subscriptions for multiplayer features

**Deliverables:**
```
/src/
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   └── database.ts
├── types/
│   └── database.types.ts
├── api/
│   ├── auth/
│   ├── games/
│   ├── vocabulary/
│   └── progress/
└── sql/
    ├── schema.sql
    ├── rls_policies.sql
    └── sample_data.sql
```

---

### 🔄 **Agent 4: Real-time Communication Specialist**
**Primary Role**: Socket.IO implementation for multiplayer gaming

**Tasks:**
1. **Socket.IO Server Setup**
   - Configure Socket.IO server with Express.js
   - Setup connection handling and room management
   - Implement authentication for socket connections
   - Create event handlers for game communications

2. **Real-time Game Features**
   - Design multiplayer game session management
   - Implement player synchronization system
   - Create real-time scoring and leaderboard updates
   - Setup game state broadcasting

3. **Client-Side Socket Integration**
   - Create React hooks for socket connections
   - Implement reconnection logic
   - Handle offline/online state management
   - Create typing indicators and live feedback

**Deliverables:**
```
/server/
├── socket-server.js
├── handlers/
│   ├── gameHandler.js
│   ├── roomHandler.js
│   └── authHandler.js
└── middleware/
    └── socketAuth.js

/src/hooks/
├── useSocket.ts
├── useGameRoom.ts
└── useRealTimeScore.ts
```

---

### 🎨 **Agent 5: UI/UX Implementation Specialist**
**Primary Role**: User interface and user experience implementation using shadcn/ui

**Tasks:**
1. **shadcn/ui Component Implementation**
   - Install and customize required shadcn/ui components
   - Components needed: Button, Card, Input, Modal, Progress, Badge, Avatar, Tabs, Select, Sheet, Dialog, Tooltip, etc.
   - Create compound components using shadcn/ui primitives
   - Implement custom variants for gaming-specific UI elements

2. **Game-specific UI Components**
   - Create game HUD components using shadcn/ui as base
   - Design progress indicators and score displays
   - Implement modal systems for game states using Dialog/Sheet
   - Create custom gaming themes and color schemes

3. **Layout and Navigation**
   - Build responsive navigation using shadcn/ui components
   - Create teacher dashboard with Cards, Tabs, and Sheet components
   - Design student interface using shadcn/ui layout primitives
   - Implement breadcrumb navigation and sidebar

4. **Responsive Design & Accessibility**
   - Ensure mobile-first responsive design with shadcn/ui
   - Leverage built-in accessibility features
   - Create touch-friendly game controls
   - Implement dark/light mode using shadcn/ui theme system

**Deliverables:**
```
/src/
├── components/
│   ├── ui/ (shadcn/ui components - auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── progress.tsx
│   │   ├── badge.tsx
│   │   └── ... (other shadcn components)
│   ├── game-ui/
│   │   ├── GameHUD.tsx
│   │   ├── ScoreDisplay.tsx
│   │   ├── ProgressIndicator.tsx
│   │   └── GameModal.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navigation.tsx
│   │   └── Footer.tsx
│   ├── teacher/
│   │   ├── Dashboard.tsx
│   │   ├── ClassManagement.tsx
│   │   └── StudentProgress.tsx
│   └── student/
│       ├── GameLibrary.tsx
│       ├── ProfileCard.tsx
│       └── ProgressDashboard.tsx
├── lib/
│   └── utils.ts (cn function + shadcn utilities)
└── styles/
    ├── globals.css (with shadcn base styles)
    └── game-components.css (custom game styling)
```

---

### 🔊 **Agent 6: Multimedia Integration Engineer**
**Primary Role**: Audio, video, and asset management systems

**Tasks:**
1. **Web APIs Integration**
   - Implement Web Speech API for pronunciation
   - Setup MediaRecorder API for voice recording
   - Configure WebRTC for camera access
   - Integrate Web Audio API with Tone.js

2. **Asset Management System**
   - Setup Supabase Storage integration
   - Create asset upload and optimization pipeline
   - Implement caching strategies for media files
   - Create audio/video playback components

3. **Multimedia Features**
   - Build pronunciation practice components
   - Create video recording and playback system
   - Implement audio feedback and sound effects
   - Setup image optimization and lazy loading

**Deliverables:**
```
/src/
├── components/
│   ├── audio/
│   │   ├── SpeechRecognition.tsx
│   │   ├── PronunciationCheck.tsx
│   │   └── AudioPlayer.tsx
│   ├── video/
│   │   ├── CameraCapture.tsx
│   │   └── VideoRecorder.tsx
│   └── media/
│       ├── ImageOptimizer.tsx
│       └── AssetLoader.tsx
├── utils/
│   ├── audioUtils.ts
│   ├── videoUtils.ts
│   └── storageUtils.ts
└── hooks/
    ├── useAudio.ts
    └── useCamera.ts
```

---

## 🚀 **Agent 7: Deployment & DevOps Coordinator**
**Primary Role**: Production deployment and CI/CD setup

**Tasks:**
1. **Vercel Deployment Configuration**
   - Setup Vercel project with optimal settings
   - Configure environment variables for production
   - Setup preview deployments for staging
   - Implement automatic deployments from Git

2. **CI/CD Pipeline**
   - Setup GitHub Actions for testing and deployment
   - Configure automated testing workflows
   - Implement code quality checks
   - Setup deployment notifications

3. **Performance Optimization**
   - Configure caching strategies
   - Setup CDN for static assets
   - Implement performance monitoring
   - Create production build optimization

**Deliverables:**
```
/.github/
├── workflows/
│   ├── ci.yml
│   ├── deploy.yml
│   └── test.yml
├── vercel.json
├── Dockerfile (if needed)
└── deployment-guide.md
```

---

## 📋 **Coordination Requirements**

### **Agent Communication Protocol:**
1. Each agent must document their dependencies on other agents
2. Create integration checkpoints between agents
3. Establish shared type definitions and interfaces
4. Maintain consistent coding standards across all implementations

### **Integration Points:**
- **Agent 1 ↔ All**: Base configuration and project structure
- **Agent 2 ↔ Agent 5**: Game UI integration
- **Agent 3 ↔ Agent 4**: Database and real-time sync
- **Agent 6 ↔ Agent 3**: Media storage integration
- **Agent 7 ↔ All**: Deployment and environment setup

### **Shared Standards:**
- TypeScript strict mode enabled
- Consistent error handling patterns
- Standardized API response formats
- Common utility functions library
- Unified logging and monitoring approach

---

## 🎯 **Success Criteria**

### **Technical Requirements:**
- [ ] Application runs locally in development mode
- [ ] All games render properly in Phaser.js canvas
- [ ] Real-time multiplayer functionality works
- [ ] Database operations perform efficiently
- [ ] Media features (audio/video) function correctly
- [ ] Application deploys successfully to production

### **Performance Benchmarks:**
- Page load time < 2 seconds
- Game frame rate ≥ 60 FPS
- Database query response < 100ms
- Real-time latency < 50ms
- Asset loading optimization implemented

### **Code Quality:**
- 100% TypeScript coverage
- ESLint/Prettier compliance
- Unit test coverage ≥ 80%
- Component documentation complete
- Error boundaries implemented

---

## 📦 **Final Deliverable Structure**

```
/edu-game-hub/
├── README.md (comprehensive setup guide)
├── ARCHITECTURE.md (system overview)
├── package.json
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── .env.example
├── /src/
│   ├── /app/ (Next.js 14 app router)
│   ├── /components/
│   ├── /game/
│   ├── /lib/
│   ├── /hooks/
│   ├── /utils/
│   ├── /types/
│   └── /styles/
├── /server/ (Socket.IO server)
├── /sql/ (Database schemas)
├── /.github/ (CI/CD workflows)
└── /docs/ (API documentation)
```

**Timeline Estimate**: 2-3 weeks for complete implementation
**Team Size**: 7 specialized agents working in parallel
**Primary Dependencies**: Supabase account, Vercel account, domain name (optional)