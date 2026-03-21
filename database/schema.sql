CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    has_voted BOOLEAN DEFAULT FALSE
);

CREATE TABLE candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL
);

CREATE TABLE votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    candidate_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (candidate_id) REFERENCES candidates(id)
);
INSERT INTO candidates (name, position) VALUES
('Alice', 'President'),
('Bob', 'President'),
('Charlie', 'Secretary');
ALTER TABLE votes 
ADD CONSTRAINT unique_vote UNIQUE(user_id);
ALTER TABLE users 
ADD created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE votes 
ADD created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
