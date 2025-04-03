
-- Recipe Manager Database Schema
-- Compatible with PostgreSQL and MariaDB

-- Create recipes table
CREATE TABLE IF NOT EXISTS recipes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    ingredients JSON NOT NULL,
    steps JSON NOT NULL,
    image_url TEXT,
    video_url TEXT,
    calories DECIMAL(10,2) DEFAULT 0,
    protein DECIMAL(10,2) DEFAULT 0,
    fat DECIMAL(10,2) DEFAULT 0,
    carbs DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Note: The JSON type is used for arrays in MariaDB
-- For PostgreSQL, you can use TEXT[] for arrays
-- This export file is designed to be compatible with both systems
-- with minimal modifications
