-- Initialize the database for Football Guess Who

-- Create database if it doesn't exist
CREATE DATABASE football_guess_who
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TEMPLATE = template0;

-- Connect to database
\c football_guess_who;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create database user with restricted privileges
CREATE USER app_user WITH PASSWORD 'app_user_password';
GRANT CONNECT ON DATABASE football_guess_who TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Add security measures
ALTER DATABASE football_guess_who SET statement_timeout = '30s';
ALTER DATABASE football_guess_who SET idle_in_transaction_session_timeout = '60s';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_game_room_status ON public."GameRoom" (state);
CREATE INDEX IF NOT EXISTS idx_player_session_active ON public."PlayerSession" (is_active);
CREATE INDEX IF NOT EXISTS idx_footballer_traits ON public."Footballer" (position, nationality);

-- Add database logging for auditing
ALTER DATABASE football_guess_who SET log_statement = 'all';
ALTER DATABASE football_guess_who SET log_min_duration_statement = 1000; 