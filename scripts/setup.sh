#!/usr/bin/env bash
# ============================================================
# StackSentry Technologies - Setup Script
# ============================================================
set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }
info() { echo -e "${BLUE}[SETUP]${NC} $1"; }

# ============================================================
# 1. Check Prerequisites
# ============================================================
info "Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    error "Docker is not installed. Install Docker: https://docs.docker.com/get-docker/"
fi
log "Docker found: $(docker --version)"

if ! docker compose version &> /dev/null; then
    error "Docker Compose is not installed. Install Docker Compose plugin."
fi
log "Docker Compose found: $(docker compose version)"

if ! command -v git &> /dev/null; then
    warn "Git is not installed. Some features may not work."
fi

# ============================================================
# 2. Setup .env file
# ============================================================
info "Setting up environment configuration..."

if [ ! -f .env ]; then
    cp .env.example .env
    log "Created .env from .env.example"

    # Generate secrets
    SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(64))" 2>/dev/null || openssl rand -base64 64 | tr -d '\n')
    REFRESH_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(64))" 2>/dev/null || openssl rand -base64 64 | tr -d '\n')

    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|" .env
        sed -i '' "s|REFRESH_SECRET_KEY=.*|REFRESH_SECRET_KEY=${REFRESH_SECRET_KEY}|" .env
    else
        sed -i "s|SECRET_KEY=.*|SECRET_KEY=${SECRET_KEY}|" .env
        sed -i "s|REFRESH_SECRET_KEY=.*|REFRESH_SECRET_KEY=${REFRESH_SECRET_KEY}|" .env
    fi

    log "Generated secure secret keys"
    warn "Please review and update .env with your specific configuration (SMTP, AWS, etc.)"
else
    log ".env file already exists, skipping creation"
fi

# ============================================================
# 3. Create necessary directories
# ============================================================
info "Creating necessary directories..."

mkdir -p uploads uploads_dev nginx/certs backups logs
touch uploads/.gitkeep uploads_dev/.gitkeep

log "Directory structure created"

# ============================================================
# 4. Build and start containers
# ============================================================
info "Building Docker images..."

if [ "${1:-}" = "--dev" ]; then
    log "Starting in development mode..."
    docker compose -f docker-compose.yml -f docker-compose.dev.yml --profile dev up -d --build
else
    log "Starting in production mode..."
    docker compose up -d --build
fi

# ============================================================
# 5. Wait for database to be ready
# ============================================================
info "Waiting for database to be ready..."

for i in {1..30}; do
    if docker compose exec -T db pg_isready -U postgres &>/dev/null; then
        log "Database is ready!"
        break
    fi
    if [ "$i" -eq 30 ]; then
        error "Database failed to start within 30 seconds"
    fi
    echo -n "."
    sleep 1
done

# ============================================================
# 6. Run database migrations
# ============================================================
info "Running database migrations..."

docker compose exec -T backend alembic upgrade head 2>/dev/null || \
    warn "No migrations to run or alembic not configured yet"

log "Migrations completed"

# ============================================================
# 7. Seed admin user (if script exists)
# ============================================================
info "Seeding initial data..."

docker compose exec -T backend python -c "
import asyncio
from app.database import async_session_factory
from app.models.user import User, UserRole
from app.utils.auth import hash_password

async def seed():
    async with async_session_factory() as session:
        from sqlalchemy import select
        result = await session.execute(select(User).where(User.email == 'admin@stacksentry.com'))
        if not result.scalar_one_or_none():
            admin = User(
                email='admin@stacksentry.com',
                hashed_password=hash_password('Admin@123'),
                full_name='System Administrator',
                role=UserRole.admin,
                is_active=True,
                is_email_verified=True,
            )
            session.add(admin)
            await session.commit()
            print('Admin user created: admin@stacksentry.com / Admin@123')
        else:
            print('Admin user already exists')

asyncio.run(seed())
" 2>/dev/null || warn "Could not seed admin user (app may need to be fully set up first)"

# ============================================================
# 8. Print access URLs
# ============================================================
echo ""
echo "============================================"
echo "  StackSentry Technologies - Setup Complete"
echo "============================================"
echo ""
echo "  Services:"
echo "    Backend API:   http://localhost:8000"
echo "    Frontend:      http://localhost:3000"
echo "    Nginx Proxy:   http://localhost:80"
echo "    PostgreSQL:    localhost:5432"
echo ""
echo "  Default Admin:"
echo "    Email:    admin@stacksentry.com"
echo "    Password: Admin@123"
echo ""
echo "  Useful Commands:"
echo "    View logs:       docker compose logs -f"
echo "    Stop services:   docker compose down"
echo "    Restart:         docker compose restart"
echo "    Rebuild:         docker compose up -d --build"
echo "    Database shell:  docker compose exec db psql -U postgres -d stacksentry"
echo "    Backend shell:   docker compose exec backend bash"
echo ""
echo "============================================"
