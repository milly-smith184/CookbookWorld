CREATE DATABASE cookbookworld
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE cookbookworld;

-- Stores registered users. Never store plain-text passwords.
CREATE TABLE users (
    user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(60) NOT NULL,
    last_name VARCHAR(60) NOT NULL,
    email VARCHAR(254) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
        
    UNIQUE KEY uq_users_email (email)
    
) ENGINE=InnoDB;

-- Stores each user's saved Spoonacular recipes.
CREATE TABLE saved_recipes (
    saved_recipe_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    spoonacular_recipe_id INT NOT NULL,
    recipe_title VARCHAR(255) NOT NULL,
    recipe_image VARCHAR(1000) NULL,
    saved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE KEY uq_user_saved_recipe (user_id, spoonacular_recipe_id),

    KEY idx_saved_recipes_user_saved (user_id, saved_at),

    CONSTRAINT fk_saved_recipes_user
        FOREIGN KEY (user_id)
        REFERENCES users (user_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

) ENGINE=InnoDB;

-- Optional verification queries:
SHOW TABLES;
DESCRIBE users;
DESCRIBE saved_recipes;
