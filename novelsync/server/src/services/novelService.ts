import pool from "../config/database";
import { Novel } from "../models/novel";

export const getNovelsByAuthorId = async (
  authorId: string
): Promise<Novel[]> => {
  const { rows } = await pool.query("SELECT * FROM novels WHERE author = $1", [
    authorId,
  ]);
  return rows;
};
