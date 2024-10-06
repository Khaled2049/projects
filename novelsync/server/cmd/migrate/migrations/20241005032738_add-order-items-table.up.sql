CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  orderId INT NOT NULL,
  bookId INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders(id),
  FOREIGN KEY (bookId) REFERENCES books(id)
);