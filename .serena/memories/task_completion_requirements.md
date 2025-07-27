# Task Completion Requirements

## Pre-Implementation Checks
- **Research APIs/types/schemas** before ANY code implementation
- **Check package.json versions** before adding dependencies
- **Verify existing patterns** in codebase before writing new code

## Code Quality Checks (MANDATORY)
- **Linting**: `pnpm lint` - Must pass without errors
- **Type Checking**: `pnpm type-check` - Must pass without errors  
- **Formatting**: `pnpm format` - Code must be properly formatted
- **Testing**: `pnpm test` - All tests must pass

## Performance Benchmarks
- **Page load time**: < 2 seconds
- **Game frame rate**: ≥ 60 FPS
- **Database queries**: < 100ms response time
- **Real-time latency**: < 50ms for Socket.IO communications

## Security Requirements
- **Error handling**: MANDATORY in ALL code
- **No secrets in code**: Never expose API keys or sensitive data
- **RLS policies**: Implement Row Level Security for Supabase
- **Input validation**: All user inputs must be validated

## Documentation Requirements
- **Component documentation**: Every custom component must be documented
- **API documentation**: All API endpoints must be documented
- **README updates**: Update project README when adding major features
- **Type definitions**: Maintain shared type definitions

## Integration Requirements
- **Agent dependencies**: Document dependencies between different system components
- **Integration checkpoints**: Establish checkpoints between major modules
- **Consistent standards**: Maintain coding standards across all implementations