# Code Style and Conventions

## TypeScript Standards
- **Strict Mode**: Enabled for all TypeScript configurations
- **Type Coverage**: 100% TypeScript coverage required
- **Error Handling**: Consistent error handling patterns across all components
- **Logging**: Unified logging and monitoring approach

## Code Quality Requirements
- **Linting**: ESLint compliance mandatory  
- **Formatting**: Prettier configuration enforced
- **Testing**: Unit test coverage ≥ 80%
- **Documentation**: Component documentation complete
- **Error Boundaries**: Must be implemented for React components

## Architecture Patterns
- **Clean Architecture**: Modular design with clear boundaries
- **Separation of Concerns**: Strictly enforced
  - Logic layer SEPARATE from UI layer
  - Data access layer SEPARATE from business logic
  - NO mixing of concerns in ANY file
  - Each component has SINGLE responsibility

## API Standards
- **Response Formats**: Standardized API response formats
- **Utility Functions**: Common utility functions library
- **Type Definitions**: Shared type definitions and interfaces
- **Integration**: Consistent integration patterns between components

## Component Structure
- **shadcn/ui**: Use as base for all UI components
- **Custom Variants**: Create gaming-specific UI element variants
- **Compound Components**: Build using shadcn/ui primitives
- **Responsive Design**: Mobile-first approach with shadcn/ui