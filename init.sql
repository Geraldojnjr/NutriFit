CREATE DATABASE IF NOT EXISTS recipe_manager;
USE recipe_manager;

DROP TABLE IF EXISTS recipes;

CREATE TABLE recipes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ingredients JSON NOT NULL,
    steps JSON NOT NULL,
    image_url VARCHAR(255),
    video_url VARCHAR(255),
    calories INT DEFAULT 0,
    protein INT DEFAULT 0,
    fat INT DEFAULT 0,
    carbs INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 

-- DROP TABLE IF EXISTS comments; Falta finalizar
-- CREATE TABLE comments (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   recipe_id UUID REFERENCES public.recipes(id) ON DELETE CASCADE,
--   text TEXT NOT NULL,
--   rating INTEGER NOT NULL CHECK (rating >= 0 AND rating <= 5),
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci; 
