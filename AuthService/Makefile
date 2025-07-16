MIGRATIONS_DIR=db/migrations
DB_URL=root:krishjain123@tcp(172.16.174.84:3306)/auth_dev

# Create a new migration -> gmake migrate-create name=create_entity_table
migrate-create:
	goose -dir $(MIGRATIONS_DIR) create $(name) sql

# Apply all migrations
migrate-up:
	goose -dir $(MIGRATIONS_DIR) mysql "$(DB_URL)" up

# Rollback last migration
migrate-down:
	goose -dir $(MIGRATIONS_DIR) mysql "$(DB_URL)" down

# Reset DB (rollback all + up all)
migrate-reset:
	goose -dir $(MIGRATIONS_DIR) mysql "$(DB_URL)" reset

# Show current migration status
migrate-status:
	goose -dir $(MIGRATIONS_DIR) mysql "$(DB_URL)" status

# Redo last migration
migrate-redo:
	goose -dir $(MIGRATIONS_DIR) mysql "$(DB_URL)" redo

# Migrate to specific version
migrate-to:
	goose -dir $(MIGRATIONS_DIR) mysql "$(DB_URL)" up-to $(version)

# Rollback to specific version
migrate-down-to:
	goose -dir $(MIGRATIONS_DIR) mysql "$(DB_URL)" down-to $(version)

# Force a specific version
migrate-force:
	goose -dir $(MIGRATIONS_DIR) mysql "$(DB_URL)" force $(version)

# Show Goose help
migrate-help:
	goose -h
