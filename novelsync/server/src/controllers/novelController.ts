import { Request, Response } from "express";
import { getNovelsByAuthorId } from "../services/novelService";

export const getNovels = async (req: Request, res: Response) => {
  const authorId = req.params.authorId;
  try {
    const novels = await getNovelsByAuthorId(authorId);
    res.status(200).json(novels);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
