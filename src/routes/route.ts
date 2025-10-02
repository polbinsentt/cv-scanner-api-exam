import { Router } from "express";
import keywordRoutes from "./keyword.routes";
import scanRoutes from "./scan.routes";

const router = Router();

router.use("/keywords", keywordRoutes);
router.use("/", scanRoutes);

export default router;
