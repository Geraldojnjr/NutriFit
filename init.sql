CREATE DATABASE IF NOT EXISTS recipe_manager;
USE recipe_manager;

DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS comments;

-- Create recipes table
 CREATE TABLE IF NOT EXISTS recipes (
     id VARCHAR(36) PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     ingredients JSON NOT NULL COMMENT 'Array of ingredient strings',
     steps JSON NOT NULL COMMENT 'Array of step strings',
     image_url TEXT,
     video_url TEXT,
     categories JSON COMMENT 'Array of category strings',
     calories DECIMAL(10,2) DEFAULT 0,
     protein DECIMAL(10,2) DEFAULT 0,
     fat DECIMAL(10,2) DEFAULT 0,
     carbs DECIMAL(10,2) DEFAULT 0,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     
     -- Add indexes for better performance
     INDEX idx_recipe_name (name),
     INDEX idx_recipe_created (created_at DESC)
 );
 
 -- Create comments table
 CREATE TABLE IF NOT EXISTS comments (
     id VARCHAR(36) PRIMARY KEY,
     recipe_id VARCHAR(36) NOT NULL,
     text TEXT NOT NULL,
     rating INT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     
     -- Add foreign key constraint
     FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
     
     -- Add indexes for better performance
     INDEX idx_comment_recipe (recipe_id),
     INDEX idx_comment_created (created_at DESC)
 );