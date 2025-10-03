import { Router } from "express";
import multer from "multer";
import * as scanController from "../controllers/ScannerController";
import { batchScanner } from "../controllers/BatchScannerController";
const router = Router();

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed!"));
    }
  },
});

//handles initial error handler for zip file upload
const uploadZip = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "application/zip" ||
      file.mimetype === "application/x-zip-compressed"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only zip files are allowed!"));
    }
  },
});

router.post("/scan", upload.single("cv"), scanController.scanCv);
router.post("/rescan", scanController.rescanCv);
router.post("/batch/scan", uploadZip.single("batchCv"), batchScanner); // route for batch scan
export default router;
