# Project Structure

## Current State
This is a **planning repository** containing:
- `edu-game-hub.md`: Complete multi-agent system specification
- `_resources/`: English Global Success Grade 6 curriculum materials (12 units)
- `app.log`: Application log file
- Configuration directories: `.serena`, `.claude`, `.zencoder`, `.vscode`

## Planned Final Structure
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
│   │   ├── /ui/ (shadcn/ui components)
│   │   ├── /game-ui/ (GameHUD, ScoreDisplay, etc.)
│   │   ├── /layout/ (Header, Sidebar, Navigation)
│   │   ├── /teacher/ (Dashboard, ClassManagement)
│   │   └── /student/ (GameLibrary, ProfileCard)
│   ├── /game/
│   │   ├── /scenes/ (BaseScene, MenuScene, GameScene)
│   │   ├── /entities/ (Player, GameEntity)
│   │   ├── /managers/ (AssetManager, StateManager)
│   │   └── /utils/ (GameUtils)
│   ├── /lib/ (supabase, auth, database)
│   ├── /hooks/ (useSocket, useGameRoom, useAudio)
│   ├── /utils/ (audioUtils, videoUtils, storageUtils)
│   ├── /types/ (database.types.ts)
│   └── /styles/ (globals.css, game-components.css)
├── /server/ (Socket.IO server)
├── /sql/ (Database schemas)
├── /.github/ (CI/CD workflows)
└── /docs/ (API documentation)
```

## Agent Responsibilities
- **Agent 1**: Infrastructure Architect (Next.js, Tailwind, shadcn/ui setup)
- **Agent 2**: Game Engine Specialist (Phaser.js integration)
- **Agent 3**: Backend Infrastructure (Supabase integration)
- **Agent 4**: Real-time Communication (Socket.IO)
- **Agent 5**: UI/UX Implementation (shadcn/ui components)
- **Agent 6**: Multimedia Integration (Web APIs, media)
- **Agent 7**: Deployment & DevOps (Vercel, CI/CD)