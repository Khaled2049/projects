import { Router } from "express";
import { getNovels } from "../controllers/novelController";

const router = Router();

router.get("/novels/author/:authorId", getNovels);

export default router;
