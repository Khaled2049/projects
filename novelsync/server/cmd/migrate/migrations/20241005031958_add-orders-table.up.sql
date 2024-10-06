CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  userId INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('pending', 'completed', 'cancelled')) NOT NULL DEFAULT 'pending',
  address TEXT NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);