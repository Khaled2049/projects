import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: String(process.env.DB_USER),
  host: String(process.env.DB_HOST),
  database: String(process.env.DB_NAME),
  password: String(process.env.DB_PASSWORD),
  port: parseInt(process.env.DB_PORT || "5433"),
});

const createTables = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS novels (
        id SERIAL PRIMARY KEY,
        author VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL
      );
    `);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables", err);
  } finally {
    client.release();
  }
};

createTables();

export default pool;
