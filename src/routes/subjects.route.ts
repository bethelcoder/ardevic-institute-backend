import { and, desc, eq, getTableColumns, ilike, or, sql } from "drizzle-orm";
import { Router } from "express";
import { subjectRetrieval } from "../controllers/subject.controller";
const router = Router();

//GET all subjects with optional search, filtering and pagination
router.get("/", subjectRetrieval);

export default router;