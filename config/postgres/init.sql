-- Initialize Football Guess Who database

-- Create tables if prisma hasn't yet
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS footballers (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image_url VARCHAR(512) NOT NULL,
  team VARCHAR(255) NOT NULL,
  position VARCHAR(50) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  height INTEGER NOT NULL,
  strong_foot VARCHAR(50) NOT NULL,
  hair_color VARCHAR(50) NOT NULL,
  facial_hair BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY,
  status VARCHAR(50) NOT NULL DEFAULT 'WAITING',
  game_mode VARCHAR(50) NOT NULL DEFAULT 'SINGLE_PLAYER',
  creator_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

-- Create _PlayerGames join table for the many-to-many relationship
CREATE TABLE IF NOT EXISTS "_PlayerGames" (
  "A" UUID NOT NULL,
  "B" UUID NOT NULL,
  FOREIGN KEY ("A") REFERENCES games(id),
  FOREIGN KEY ("B") REFERENCES users(id),
  UNIQUE("A", "B")
);

-- Insert sample data for testing
INSERT INTO footballers (id, name, image_url, team, position, nationality, age, height, strong_foot, hair_color, facial_hair)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Lionel Messi', 'https://via.placeholder.com/150', 'Inter Miami', 'Forward', 'Argentina', 36, 170, 'Left', 'Brown', true),
  ('22222222-2222-2222-2222-222222222222', 'Cristiano Ronaldo', 'https://via.placeholder.com/150', 'Al Nassr', 'Forward', 'Portugal', 38, 187, 'Right', 'Black', false),
  ('33333333-3333-3333-3333-333333333333', 'Kylian Mbappé', 'https://via.placeholder.com/150', 'Real Madrid', 'Forward', 'France', 24, 178, 'Right', 'Black', false),
  ('44444444-4444-4444-4444-444444444444', 'Erling Haaland', 'https://via.placeholder.com/150', 'Manchester City', 'Forward', 'Norway', 23, 194, 'Left', 'Blonde', false)
ON CONFLICT (id) DO NOTHING;

-- Insert test admin user with password 'Admin123!'
INSERT INTO users (id, username, email, password) 
VALUES ('00000000-0000-0000-0000-000000000000', 'admin', 'admin@example.com', '$2b$10$8KVj4kNL8pY7yZ6Lp/lMietMSrBDTdw4EWcWUr1HDmHU8AiKQIwEi')
ON CONFLICT (username) DO NOTHING; 