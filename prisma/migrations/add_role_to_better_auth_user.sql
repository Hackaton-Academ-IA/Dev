-- Migration: add role column to Better-Auth's "user" table
-- Run once against your database:
--   psql "$DATABASE_URL" -f prisma/migrations/add_role_to_better_auth_user.sql
-- Or paste directly in pgAdmin / any SQL client.

ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

-- To promote an admin (replace the email):
-- UPDATE "user" SET role = 'admin' WHERE email = 'admin@example.com';
