-- Migration: add multi-choice fields to the Question table
-- Run manually: psql $DATABASE_URL -f prisma/migrations/add_quiz_fields.sql

ALTER TABLE "Question"
  ADD COLUMN IF NOT EXISTS matiere     TEXT   NOT NULL DEFAULT 'Culture Générale',
  ADD COLUMN IF NOT EXISTS choix       TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS explication TEXT   NOT NULL DEFAULT '';
