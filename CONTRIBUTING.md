# Contributing to StackSentry Technologies

Thank you for your interest in contributing to StackSentry! This document provides guidelines and information about contributing to this project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Python 3.12+ (for backend development)
- Node.js 20+ (for frontend development)
- Git

### Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/stacksentry.git
   cd stacksentry
   ```
3. Add the upstream remote:
   ```bash
   git remote add upstream https://github.com/stacksentry/stacksentry.git
   ```
4. Create a branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Start the development environment:
   ```bash
   ./scripts/setup.sh --dev
   ```

## Development Workflow

### Backend

```bash
cd backend

# Run tests
pytest tests/ -v

# Run linter
ruff check app/

# Run formatter
ruff format app/

# Run type checker
mypy app/ --ignore-missing-imports

# Create a migration
alembic revision --autogenerate -m "description of changes"

# Apply migrations
alembic upgrade head
```

### Frontend

```bash
cd frontend

# Run tests
npm run test

# Run linter
npm run lint

# Type check
npm run typecheck

# Build
npm run build
```

## Code Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints for all function signatures
- Use async/await for all database operations
- Keep functions focused and under 50 lines
- Write docstrings for public functions
- Use meaningful variable and function names

### TypeScript (Frontend)

- Use TypeScript for all new code
- Follow the existing project structure
- Use functional components with hooks
- Keep components under 200 lines
- Use meaningful variable and function names
- Prefer named exports over default exports

### Git

- Write clear, concise commit messages
- Use conventional commit format:
  ```
  feat: add new feature
  fix: resolve bug in module
  docs: update documentation
  style: formatting changes
  refactor: code restructuring
  test: add missing tests
  chore: maintenance tasks
  ```

## Commit Guidelines

1. **Use the present tense** ("Add feature" not "Added feature")
2. **Use the imperative mood** ("Move cursor to..." not "Moves cursor to...")
3. **Reference issues and pull requests** liberally after the first line
4. **Keep the first line under 72 characters**
5. **Consider starting the commit message with an appropriate emoji:**
   - `feat: :sparkles:` for new features
   - `fix: :bug:` for bug fixes
   - `docs: :memo:` for documentation
   - `style: :art:` for formatting
   - `refactor: :hammer:` for refactoring
   - `test: :white_check_mark:` for tests
   - `chore: :wrench:` for maintenance

## Pull Request Process

1. **Ensure your code follows the project standards**
2. **Update documentation** if your changes affect the API or user interface
3. **Add tests** for new features and bug fixes
4. **Ensure all tests pass:**
   ```bash
   # Backend
   cd backend && pytest tests/ -v

   # Frontend
   cd frontend && npm run test
   ```
5. **Update the README** if necessary
6. **Create a descriptive PR title** using conventional commit format
7. **Fill out the PR template** completely
8. **Request review** from at least one maintainer

### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests pass locally
```

## Reporting Issues

### Bug Reports

When filing a bug report, please include:

1. **Clear and descriptive title**
2. **Steps to reproduce** the issue
3. **Expected behavior** vs **actual behavior**
4. **Environment details:**
   - OS and version
   - Browser (for frontend issues)
   - Python/Node.js version
   - Docker version

### Feature Requests

When suggesting a feature:

1. **Describe the problem** the feature would solve
2. **Describe the solution** you'd like
3. **Describe alternatives** you've considered
4. **Additional context** (mockups, examples, etc.)

## Questions?

If you have questions about contributing, feel free to:

- Open a discussion on GitHub
- Reach out to the maintainers

Thank you for contributing to StackSentry Technologies!
