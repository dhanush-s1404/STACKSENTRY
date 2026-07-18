#!/usr/bin/env bash
# ============================================================
# StackSentry Technologies - Database Backup Script
# ============================================================
set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-./backups}"
POSTGRES_USER="${POSTGRES_USER:-postgres}"
POSTGRES_DB="${POSTGRES_DB:-stacksentry}"
DB_CONTAINER="${DB_CONTAINER:-stacksentry-db}"
KEEP_BACKUPS="${KEEP_BACKUPS:-30}"
S3_BUCKET="${AWS_S3_BUCKET:-}"
S3_PREFIX="backups/stacksentry"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Generate timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/stacksentry_${TIMESTAMP}.sql.gz"

echo "============================================"
echo "  StackSentry Database Backup"
echo "  $(date)"
echo "============================================"
echo ""

# Create backup
echo "[1/4] Creating database backup..."
docker compose exec -T "$DB_CONTAINER" \
    pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
    --no-owner --no-privileges --verbose 2>/dev/null \
    | gzip > "$BACKUP_FILE"

if [ ! -f "$BACKUP_FILE" ] || [ ! -s "$BACKUP_FILE" ]; then
    echo "[ERROR] Backup file is empty or was not created"
    exit 1
fi

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "      Backup created: $BACKUP_FILE ($BACKUP_SIZE)"

# Verify backup integrity
echo "[2/4] Verifying backup integrity..."
gunzip -t "$BACKUP_FILE" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "      Backup integrity verified"
else
    echo "[ERROR] Backup file is corrupted"
    exit 1
fi

# Cleanup old backups
echo "[3/4] Cleaning up old backups..."
BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/stacksentry_*.sql.gz 2>/dev/null | wc -l)
if [ "$BACKUP_COUNT" -gt "$KEEP_BACKUPS" ]; then
    REMOVE_COUNT=$((BACKUP_COUNT - KEEP_BACKUPS))
    ls -1t "$BACKUP_DIR"/stacksentry_*.sql.gz | tail -n "$REMOVE_COUNT" | xargs rm -f
    echo "      Removed $REMOVE_COUNT old backup(s)"
else
    echo "      No old backups to remove ($BACKUP_COUNT/$KEEP_BACKUPS)"
fi

# Upload to S3 (optional)
if [ -n "$S3_BUCKET" ]; then
    echo "[4/4] Uploading to S3..."
    if command -v aws &> /dev/null; then
        aws s3 cp "$BACKUP_FILE" "s3://${S3_BUCKET}/${S3_PREFIX}/$(basename "$BACKUP_FILE")" \
            --storage-class STANDARD_IA 2>/dev/null
        echo "      Uploaded to s3://${S3_BUCKET}/${S3_PREFIX}/$(basename "$BACKUP_FILE")"
    else
        echo "      [WARN] AWS CLI not found, skipping S3 upload"
    fi
else
    echo "[4/4] S3 upload skipped (AWS_S3_BUCKET not set)"
fi

echo ""
echo "============================================"
echo "  Backup completed successfully!"
echo "  File: $BACKUP_FILE"
echo "  Size: $BACKUP_SIZE"
echo "============================================"
